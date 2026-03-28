import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SyncContext } from '../context/SyncContext';

export default function NetworkBanner() {
  const { isOnline, syncQueue } = useContext(SyncContext);
  if (isOnline && syncQueue.length === 0) {
    return (
      <View style={[styles.container, styles.online]}>
        <View style={styles.dotOnline} />
        <Text style={styles.text}>Back Online. All changes synced</Text>
      </View>
    );
  }
  if (!isOnline) {
    return (
      <View style={[styles.container, styles.offline]}>
        <View style={styles.dotOffline} />
        <Text style={styles.text}>Offline. {syncQueue.length} changes pending.</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 20, left: 20, right: 20, padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', elevation: 5, shadowOpacity: 0.1 },
  online: { borderLeftWidth: 5, borderLeftColor: '#34C759' },
  offline: { borderLeftWidth: 5, borderLeftColor: '#FF3B30' },
  dotOnline: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#34C759', marginRight: 10 },
  dotOffline: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', marginRight: 10 },
  text: { fontSize: 13, fontWeight: '600', color: '#333' }
});