import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  StatusBar,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SyncContext } from '../context/SyncContext';
import { AuthContext } from '../context/AuthContext';

export default function JobListScreen({ navigation }) {
  const { jobs } = useContext(SyncContext);
  const { user } = useContext(AuthContext);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic: Filter by Job Title or Client Name
  const filteredJobs = jobs?.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.clientName?.toLowerCase().includes(query)
    );
  }) || [];

  const renderStatusPill = (status) => {
    let colors = { bg: '#E8F5E9', text: '#4CAF50' }; // Active (Green)
    if (status === 'Pending') colors = { bg: '#FFF9C4', text: '#FBC02D' };
    if (status === 'Completed') colors = { bg: '#E3F2FD', text: '#2196F3' };

    return (
      <View style={[styles.pill, { backgroundColor: colors.bg }]}>
        <Feather name="target" size={12} color={colors.text} style={{ marginRight: 4 }} />
        <Text style={[styles.pillText, { color: colors.text }]}>{status}</Text>
      </View>
    );
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        {renderStatusPill(item.status || 'Active')}
      </View>

      <Text style={styles.clientName}>{item.clientName}</Text>

      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
            <Feather name="dollar-sign" size={14} color="#3277F1" />
          </View>
          <Text style={styles.statText}>${item.budget?.toLocaleString()}</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Feather name="map-pin" size={14} color="#4CAF50" />
          </View>
          <Text style={styles.statText}>{item.city}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <Feather name="clock" size={14} color="#8A96AC" />
        <Text style={styles.footerText}>Started {item.startDate || "Dec 15, 2024"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("UserProfile")} style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || "U"}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#8A96AC" />
        <TextInput
          placeholder="Search jobs..."
          placeholderTextColor="#8A96AC"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Jobs ({filteredJobs.length})</Text>
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={50} color="#8A96AC" />
            <Text style={styles.emptyText}>No jobs found matching your search.</Text>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateJob')}>
        <Feather name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Network Banner */}
      <View style={styles.networkBanner}>
        <View style={styles.bannerIconCircle}>
          <MaterialCommunityIcons name="wifi" size={20} color="#4CAF50" />
        </View>
        <View>
          <Text style={styles.bannerTitle}>Back Online</Text>
          <Text style={styles.bannerSubtitle}>All changes synced</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FF',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  welcomeText: {
    color: '#8A96AC',
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B2A4E',
  },
  avatar: {
    width: 45,
    height: 45,
    backgroundColor: '#3277F1',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3277F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1B2A4E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B2A4E',
  },
  viewAllText: {
    color: '#3277F1',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B2A4E',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientName: {
    color: '#8A96AC',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  cardStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2A4E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F5FF',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8A96AC',
    marginLeft: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 25,
    width: 65,
    height: 65,
    backgroundColor: '#3277F1',
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3277F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  networkBanner: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B2A4E',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#8A96AC',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    color: '#8A96AC',
    fontSize: 16,
    textAlign: 'center',
  }
});