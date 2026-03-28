import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import db, { initDB } from '../utils/db';
import { AuthContext } from './AuthContext';
import apiClient from '../api/client';

export const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const { userId, userToken } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    initDB();

    // Listen for network changes to trigger auto-sync
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected && userId) processQueue();
    });
    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadUserData();
    } else {
      setJobs([]);
      setSyncQueue([]);
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      // 1. Load jobs for this user
      const userJobs = await db.getAllAsync('SELECT * FROM jobs WHERE user_id = ?', [userId]);

      // 2. Load notes for each job and attach them
      const jobsWithNotes = await Promise.all(userJobs.map(async (job) => {
        const notes = await db.getAllAsync(
          'SELECT * FROM notes WHERE job_id = ? AND user_id = ? ORDER BY id DESC',
          [job.id, userId]
        );
        return { ...job, notes: notes || [] };
      }));

      setJobs(jobsWithNotes);

      // 3. Load user-specific queue
      const queue = await db.getAllAsync('SELECT * FROM sync_queue WHERE user_id = ?', [userId]);
      setSyncQueue(queue);
    } catch (error) {
      console.error("Error loading SQLite data:", error);
    }
  };

  // --- JOB ACTIONS ---

  const createJob = async (jobData) => {
    const tempId = Date.now().toString();
    await db.runAsync(
      'INSERT INTO jobs (id, user_id, title, description, budget, city, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tempId, userId, jobData.title, jobData.description, jobData.budget, jobData.city, 'pending']
    );

    setJobs([{ ...jobData, id: tempId, user_id: userId, notes: [], sync_status: 'pending' }, ...jobs]);
    await addToQueue('JOB_CREATE', jobData, tempId);
  };

  const updateJob = async (jobId, jobData) => {
    await db.runAsync(
      'UPDATE jobs SET title = ?, description = ?, budget = ?, city = ?, sync_status = ? WHERE id = ? AND user_id = ?',
      [jobData.title, jobData.description, jobData.budget, jobData.city, 'pending', jobId, userId]
    );

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...jobData, sync_status: 'pending' } : j));
    await addToQueue('JOB_UPDATE', jobData, jobId);
  };

  // --- NOTE ACTIONS ---

  const addNote = async (jobId, noteText) => {
    const tempNoteId = `note_${Date.now()}`;

    // 1. Save note to SQLite
    await db.runAsync(
      'INSERT INTO notes (id, job_id, user_id, text, sync_status) VALUES (?, ?, ?, ?, ?)',
      [tempNoteId, jobId, userId, noteText, 'pending']
    );

    // 2. Update Local State (Optimistic UI)
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        const newNote = { id: tempNoteId, job_id: jobId, user_id: userId, text: noteText, sync_status: 'pending' };
        return { ...job, notes: [newNote, ...(job.notes || [])] };
      }
      return job;
    }));

    // 3. Add to Sync Queue
    const payload = { text: noteText }; // API expects { "text": "..." }
    await addToQueue('NOTE_CREATE', payload, jobId);
  };

  // --- SYNC ENGINE ---

  const addToQueue = async (type, payload, jobId) => {
    await db.runAsync(
      'INSERT INTO sync_queue (user_id, type, payload, job_id) VALUES (?, ?, ?, ?)',
      [userId, type, JSON.stringify(payload), jobId]
    );
    const queue = await db.getAllAsync('SELECT * FROM sync_queue WHERE user_id = ?', [userId]);
    setSyncQueue(queue);
    if (isOnline) processQueue();
  };

  const processQueue = async () => {
    if (!isOnline || !userId) return;

    const queue = await db.getAllAsync('SELECT * FROM sync_queue WHERE user_id = ?', [userId]);

    for (const item of queue) {
      try {
        const payload = JSON.parse(item.payload);

        if (item.type === 'JOB_CREATE') {
          await apiClient.post('/api/v1/jobs', payload);
        }
        else if (item.type === 'JOB_UPDATE') {
          await apiClient.put(`/api/v1/jobs/${item.job_id}`, payload);
        }
        else if (item.type === 'NOTE_CREATE') {
          // Path from Swagger: /api/v1/jobs/{job_id}/notes
          await apiClient.post(`/api/v1/jobs/${item.job_id}/notes`, payload);
        }

        // On Success: Remove from SQLite Queue
        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);

        // Update local status to 'synced' in SQLite
        if (item.type === 'NOTE_CREATE') {
          await db.runAsync('UPDATE notes SET sync_status = ? WHERE job_id = ? AND user_id = ?', ['synced', item.job_id, userId]);
        } else {
          await db.runAsync('UPDATE jobs SET sync_status = ? WHERE id = ? AND user_id = ?', ['synced', item.job_id, userId]);
        }

      } catch (error) {
        console.error(`Sync failed for ${item.type}:`, error.response?.data || error.message);
        // If 401, AuthContext interceptor will handle it. 
        // For other errors, we keep it in the queue to retry later.
        if (error.response?.status < 500) {
          // Client error (400, 404): Remove broken data from queue
          await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
        }
        break; // Stop processing loop on network/server error
      }
    }
    loadUserData(); // Refresh UI after sync attempts
  };

  return (
    <SyncContext.Provider value={{ jobs, createJob, updateJob, addNote, isOnline, syncQueue }}>
      {children}
    </SyncContext.Provider>
  );
};