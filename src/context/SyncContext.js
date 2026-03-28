import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Storage } from '../utils/storage';
import apiClient from '../api/client';

export const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState([]);

  useEffect(() => {
    const initData = async () => {
      const localJobs = await Storage.get('jobs') || [];
      const localQueue = await Storage.get('syncQueue') || [];
      setJobs(localJobs);
      setSyncQueue(localQueue);
    };
    initData();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) processQueue();
    });
    return unsubscribe;
  }, []);

  const processQueue = async () => {
    const currentQueue = await Storage.get('syncQueue') || [];
    if (currentQueue.length === 0) return;

    let remainingQueue = [...currentQueue];
    for (const item of currentQueue) {
      try {
        if (item.type === 'JOB_CREATE') await apiClient.post('/jobs', item.payload);
        if (item.type === 'JOB_UPDATE') await apiClient.put(`/jobs/${item.jobId}`, item.payload);
        if (item.type === 'NOTE_ADD') await apiClient.post(`/jobs/${item.jobId}/notes`, item.payload);
        if (item.type === 'VIDEO_UPLOAD') {
          const formData = new FormData();
          formData.append('video', { uri: item.uri, name: 'video.mp4', type: 'video/mp4' });
          await apiClient.post(`/jobs/${item.jobId}/video`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        remainingQueue = remainingQueue.filter(q => q.id !== item.id);
        await Storage.save('syncQueue', remainingQueue);
      } catch (e) {
        if (e.response?.status < 500) { // Skip client errors to prevent infinite loops
          remainingQueue = remainingQueue.filter(q => q.id !== item.id);
          await Storage.save('syncQueue', remainingQueue);
        }
      }
    }
    setSyncQueue(remainingQueue);
  };

  const addToQueue = async (task) => {
    const newQueue = [...syncQueue, { ...task, id: Date.now().toString() }];
    setSyncQueue(newQueue);
    await Storage.save('syncQueue', newQueue);
    if (isOnline) processQueue();
  };

  const createJob = async (jobData) => {
    const newJob = { ...jobData, id: Date.now().toString(), notes: [], syncStatus: 'pending' };
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    await Storage.save('jobs', updatedJobs);
    addToQueue({ type: 'JOB_CREATE', payload: jobData });
  };

  const updateJob = async (jobId, jobData) => {
    const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, ...jobData } : j);
    setJobs(updatedJobs);
    await Storage.save('jobs', updatedJobs);
    addToQueue({ type: 'JOB_UPDATE', jobId, payload: jobData });
  };

  const addNote = async (jobId, noteText) => {
    const note = { id: Date.now().toString(), text: noteText, createdAt: new Date().toISOString() };
    const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, notes: [note, ...(j.notes || [])] } : j);
    setJobs(updatedJobs);
    await Storage.save('jobs', updatedJobs);
    addToQueue({ type: 'NOTE_ADD', jobId, payload: { text: noteText } });
  };

  return (
    <SyncContext.Provider value={{ jobs, createJob, updateJob, addNote, isOnline, syncQueue, addToQueue }}>
      {children}
    </SyncContext.Provider>
  );
};