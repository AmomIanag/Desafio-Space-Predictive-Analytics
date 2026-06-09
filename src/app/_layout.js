// src/app/_layout.js

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { MissionProvider } from '../context/MissionContext';
import { AlertProvider } from '../context/AlertContext';
import { PreferencesProvider } from '../context/PreferencesContext';

// This component only handles redirect logic — it renders nothing itself
function AuthGate() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [user, isLoading, segments]);

  return null;
}

// This component renders the loading screen or the app
function RootLayoutNav() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00D4FF" />
      </View>
    );
  }

  return (
    <>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// Root layout wraps everything in providers then renders the navigator
export default function RootLayout() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <MissionProvider>
          <AlertProvider>
            <StatusBar style="light" backgroundColor="#0A0E1A" />
            <RootLayoutNav />
          </AlertProvider>
        </MissionProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});