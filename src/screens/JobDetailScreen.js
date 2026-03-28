import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { SyncContext } from '../context/SyncContext';

export default function JobDetailScreen({ route, navigation }) {
  const { jobId } = route.params;
  const { jobs, addNote } = useContext(SyncContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [noteText, setNoteText] = useState('');

  const job = jobs.find(j => j.id === jobId) || {
    title: 'Kitchen Renovation',
    clientName: 'Sarah Johnson',
    budget: '45,000',
    description: 'Complete kitchen remodel including new cabinets, countertops, and appliances. Modern design with focus on functionality.',
    location: 'San Francisco',
    startDate: 'Dec 15, 2024',
    notes: [
      { id: '1', text: 'Initial site inspection completed. Foundation looks good.', time: '2 hours ago' },
      { id: '2', text: 'Materials ordered and expected delivery next Tuesday.', time: '1 day ago' }
    ]
  };

  const renderTabs = () => (
    <View style={styles.tabBar}>
      {[
        { id: 'Overview', icon: 'file-text' },
        { id: 'Notes', icon: 'edit-3' },
        { id: 'Video', icon: 'video' },
      ].map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
          >
            <Feather name={tab.icon} size={18} color={isActive ? '#3277F1' : '#8A96AC'} />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.id}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1B2A4E" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{job.title}</Text>
          <Text style={styles.headerSubtitle}>{job.clientName}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditJob', { jobId })}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {renderTabs()}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {activeTab === 'Overview' && (
          <View>
            {/* Blue Budget Card */}
            <View style={styles.budgetCard}>
              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <View style={styles.budgetValueContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <Text style={styles.budgetValue}>{job.budget}</Text>
              </View>
            </View>

            {/* Info Grid */}
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Feather name="map-pin" size={16} color="#4CAF50" />
                </View>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{job.location || 'San Francisco'}</Text>
              </View>
              <View style={styles.infoBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#FFF9C4' }]}>
                  <Feather name="clock" size={16} color="#FBC02D" />
                </View>
                <Text style={styles.infoLabel}>Started</Text>
                <Text style={styles.infoValue}>{job.startDate || 'Dec 15, 2024'}</Text>
              </View>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Feather name="user" size={18} color="#3277F1" />
                <Text style={styles.detailTitle}>Client Information</Text>
              </View>
              <Text style={styles.detailValue}>{job.clientName}</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailTitleOnly}>Description</Text>
              <Text style={styles.descriptionText}>{job.description}</Text>
            </View>
          </View>
        )}

        {activeTab === 'Notes' && (
          <View>
            <TextInput
              placeholder="Add a new note..."
              style={styles.noteInput}
              multiline
              placeholderTextColor="#8A96AC"
              value={noteText}
              onChangeText={setNoteText}
            />
            <TouchableOpacity style={styles.addNoteBtn} onPress={() => { addNote(jobId, noteText); setNoteText(''); }}>
              <Feather name="plus" size={20} color="#FFF" />
              <Text style={styles.addNoteBtnText}>Add Note</Text>
            </TouchableOpacity>

            {job.notes.map(note => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteContent}>{note.text}</Text>
                <View style={styles.noteFooter}>
                  <Feather name="clock" size={12} color="#8A96AC" />
                  <Text style={styles.noteTime}>{note.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Video' && (
          <View>
            <View style={styles.uploadContainer}>
              <View style={styles.uploadIconCircle}>
                <Feather name="upload-cloud" size={28} color="#3277F1" />
              </View>
              <Text style={styles.uploadTitle}>Upload Site Video</Text>
              <Text style={styles.uploadSubtitle}>Drag and drop or click to browse</Text>
              <TouchableOpacity style={styles.browseBtn}>
                <Text style={styles.browseBtnText}>Browse Files</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emptyVideoState}>
              <Feather name="video" size={40} color="#8A96AC" />
              <Text style={styles.emptyText}>No videos uploaded yet</Text>
            </View>
          </View>
        )}

        {/* Network Banner Component mockup */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}><Feather name="wifi" size={18} color="#4CAF50" /></View>
          <View>
            <Text style={styles.bannerTitle}>Back Online</Text>
            <Text style={styles.bannerSubtitle}>All changes synced</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FF', paddingTop: 30, },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // backgroundColor: '#FFF'
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center'
  },
  headerTitleContainer: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B2A4E' },
  headerSubtitle: { color: '#8A96AC', fontSize: 14 },
  editBtn: {
    backgroundColor: '#3277F1',
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10
  },
  editBtnText: { color: '#FFF', fontWeight: 'bold' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FA',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 5
  },
  tabItem: {
    flex: 1, flexDirection: 'row',
    paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
    borderRadius: 12
  },
  activeTabItem: { backgroundColor: '#FFF', elevation: 2, shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { marginLeft: 8, color: '#8A96AC', fontWeight: '600' },
  activeTabText: { color: '#1B2A4E' },

  scrollContent: { padding: 20 },

  // Overview Tab Styles
  budgetCard: {
    backgroundColor: '#3277F1', borderRadius: 20, padding: 25, marginBottom: 20,
    shadowColor: '#3277F1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 20
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50', marginRight: 6 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  budgetLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 5 },
  budgetValueContainer: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { color: '#FFF', fontSize: 24, marginRight: 5, opacity: 0.8 },
  budgetValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoBox: { backgroundColor: '#FFF', width: '47%', padding: 20, borderRadius: 20 },
  iconCircle: { width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  infoLabel: { color: '#8A96AC', fontSize: 12, marginBottom: 4 },
  infoValue: { color: '#1B2A4E', fontSize: 16, fontWeight: 'bold' },

  detailCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailTitle: { marginLeft: 10, color: '#1B2A4E', fontWeight: 'bold', fontSize: 16 },
  detailTitleOnly: { color: '#1B2A4E', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  detailValue: { color: '#8A96AC', fontSize: 15 },
  descriptionText: { color: '#8A96AC', lineHeight: 22, fontSize: 14 },

  // Notes Tab Styles
  noteInput: {
    backgroundColor: '#FFF', padding: 20, borderRadius: 20,
    height: 120, textAlignVertical: 'top', color: '#1B2A4E', fontSize: 16
  },
  addNoteBtn: {
    flexDirection: 'row', backgroundColor: '#3277F1',
    padding: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    marginTop: 15, marginBottom: 25
  },
  addNoteBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  noteCard: {
    backgroundColor: '#FFF', padding: 20, borderRadius: 15,
    marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#3277F1'
  },
  noteContent: { color: '#1B2A4E', fontSize: 15, lineHeight: 22, marginBottom: 10 },
  noteFooter: { flexDirection: 'row', alignItems: 'center' },
  noteTime: { color: '#8A96AC', fontSize: 12, marginLeft: 5 },

  // Video Tab Styles
  uploadContainer: {
    backgroundColor: '#FFF', padding: 40, borderRadius: 20, alignItems: 'center',
    borderStyle: 'dashed', borderWidth: 2, borderColor: '#3277F1', marginBottom: 25
  },
  uploadIconCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0F5FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  uploadTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B2A4E', marginBottom: 5 },
  uploadSubtitle: { color: '#8A96AC', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  browseBtn: { backgroundColor: '#3277F1', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  browseBtnText: { color: '#FFF', fontWeight: 'bold' },
  emptyVideoState: {
    backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center'
  },
  emptyText: { color: '#8A96AC', marginTop: 10 },

  banner: {
    flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15,
    marginTop: 20, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },
  bannerIcon: { width: 40, height: 40, backgroundColor: '#E8F5E9', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  bannerTitle: { fontWeight: 'bold', color: '#1B2A4E' },
  bannerSubtitle: { color: '#8A96AC', fontSize: 12 }
});