import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SyncContext } from '../context/SyncContext';

export default function EditJobScreen({ route, navigation }) {
  const { jobId } = route.params;
  const { jobs, updateJob } = useContext(SyncContext);

  const [form, setForm] = useState({
    title: '',
    description: '',
    clientName: '',
    city: '',
    budget: '',
    startDate: '',
    status: ''
  });

  useEffect(() => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setForm(job);
    }
  }, [jobId, jobs]);

  const InputLabel = ({ label }) => <Text style={styles.label}>{label}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1B2A4E" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Edit Job</Text>
          <Text style={styles.subtitle}>Fill in the details below</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Job Details */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="briefcase" size={20} color="#3277F1" />
            <Text style={styles.sectionTitle}>Job Details</Text>
          </View>

          <InputLabel label="Job Title *" />
          <TextInput
            style={styles.input}
            value={form.title}
            placeholder="e.g., Kitchen Renovation"
            placeholderTextColor="#8A96AC"
            onChangeText={t => setForm({ ...form, title: t })}
          />

          <InputLabel label="Description" />
          <TextInput
            multiline
            style={[styles.input, styles.textArea]}
            value={form.description}
            placeholder="Add job description..."
            placeholderTextColor="#8A96AC"
            onChangeText={t => setForm({ ...form, description: t })}
          />
        </View>

        {/* Section 2: Client Info */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Client Info</Text>
          </View>

          <InputLabel label="Client Name *" />
          <TextInput
            style={styles.input}
            value={form.clientName}
            placeholder="e.g., John Smith"
            placeholderTextColor="#8A96AC"
            onChangeText={t => setForm({ ...form, clientName: t })}
          />

          <InputLabel label="City *" />
          <View style={styles.iconInputContainer}>
            <Feather name="map-pin" size={18} color="#8A96AC" style={styles.inputIcon} />
            <TextInput
              style={styles.iconInput}
              value={form.city}
              placeholder="e.g., San Francisco"
              placeholderTextColor="#8A96AC"
              onChangeText={t => setForm({ ...form, city: t })}
            />
          </View>
        </View>

        {/* Section 3: Budget & Timeline */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="dollar-sign" size={20} color="#FBC02D" />
            <Text style={styles.sectionTitle}>Budget & Timeline</Text>
          </View>

          <InputLabel label="Budget (USD) *" />
          <View style={styles.iconInputContainer}>
            <Feather name="dollar-sign" size={18} color="#8A96AC" style={styles.inputIcon} />
            <TextInput
              style={styles.iconInput}
              value={form.budget?.toString()}
              placeholder="0"
              placeholderTextColor="#8A96AC"
              keyboardType="numeric"
              onChangeText={t => setForm({ ...form, budget: t })}
            />
          </View>

          <InputLabel label="Start Date" />
          <View style={styles.iconInputContainer}>
            <Feather name="calendar" size={18} color="#8A96AC" style={styles.inputIcon} />
            <TextInput
              style={styles.iconInput}
              value={form.startDate}
              placeholder="Select Date"
              placeholderTextColor="#8A96AC"
              editable={false}
            />
          </View>

          <InputLabel label="Status" />
          <View style={styles.iconInputContainer}>
            <TextInput
              style={styles.iconInput}
              value={form.status || 'Active'}
              placeholderTextColor="#8A96AC"
              editable={false}
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => { updateJob(jobId, form); navigation.goBack(); }}
        >
          <Text style={styles.btnText}>Update Job</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FF',
    paddingTop: 30

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B2A4E',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A96AC',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B2A4E',
    marginLeft: 10,
  },
  label: {
    fontSize: 13,
    color: '#8A96AC',
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 15,
    color: '#1B2A4E',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  iconInput: {
    flex: 1,
    fontSize: 15,
    color: '#1B2A4E',
  },
  btn: {
    backgroundColor: '#3277F1',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3277F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  }
});