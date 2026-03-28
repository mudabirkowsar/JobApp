import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Install: npx expo install expo-linear-gradient
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#121B2D', '#0F2038', '#0D1726']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.content}>
          {/* Logo with Sparkle */}
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={['#3277F1', '#29BD75']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBox}
            >
              <Feather name="briefcase" size={45} color="#FFF" />
            </LinearGradient>
            {/* Top Right Sparkle */}
            <View style={styles.sparkle}>
              <MaterialCommunityIcons name="star-four-points" size={24} color="#FBC02D" />
            </View>
          </View>

          <Text style={styles.title}>CJM</Text>
          <Text style={styles.subtitle}>Contractor Job Management</Text>
        </View>

        <View style={styles.footer}>
          {/* Create Account Button */}
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.secondaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.legalText}>
            By continuing, you agree to CJM's Terms of Service and Privacy Policy
          </Text>
        </View>
        
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // Logo glow
    shadowColor: '#3277F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  sparkle: {
    position: 'absolute',
    top: -15,
    right: -15,
    transform: [{ rotate: '15deg' }],
  },
  title: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#8A96AC', // Muted grey-blue
    fontSize: 15,
    marginTop: 5,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: '#3277F1',
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    // Button glow
    shadowColor: '#3277F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Glassmorphism effect
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legalText: {
    color: '#5D6B82',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});