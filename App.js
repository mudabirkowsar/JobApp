import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <AppNavigator />
      </SyncProvider>
    </AuthProvider>
  );
}