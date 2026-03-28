import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Ensure you have expo/vector-icons installed
import { AuthContext } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { signup } = useContext(AuthContext);

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await signup(form.name, form.email, form.password);
      // Success: Navigation usually happens automatically via AuthContext/AppNavigator
    } catch (error) {
      // Show the error message from the Swagger documentation (Bad Request / Internal Error)
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      alert(errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={24} color="#1B2A4E" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join CJM today</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#8A96AC" style={styles.inputIcon} />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#8A96AC"
            style={styles.input}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#8A96AC" style={styles.inputIcon} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#8A96AC"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#8A96AC" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8A96AC"
            style={styles.input}
            secureTextEntry={!isPasswordVisible}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#8A96AC" />
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>Password must be at least 8 characters</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.btn}
        onPress={handleSignUp}
      >
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FF', // Light blue background from screenshot
    paddingHorizontal: 25,
    paddingTop:30,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B2A4E', // Darker navy text
  },
  subtitle: {
    fontSize: 16,
    color: '#8A96AC',
    marginTop: 5,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1B2A4E',
  },
  helperText: {
    color: '#8A96AC',
    fontSize: 13,
    marginLeft: 5,
    marginTop: -5,
    marginBottom: 25,
  },
  btn: {
    backgroundColor: '#3277F1', // Primary blue
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // Button Shadow
    shadowColor: '#3277F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#8A96AC',
    fontSize: 15,
  },
  signInLink: {
    color: '#3277F1',
    fontSize: 15,
    fontWeight: 'bold',
  },
});