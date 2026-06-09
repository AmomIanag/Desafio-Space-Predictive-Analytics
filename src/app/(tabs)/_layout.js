// src/app/(tabs)/_layout.js

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { usePreferences } from '../../context/PreferencesContext';

function TabIcon({ emoji, focused }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>
        {emoji}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { cores } = usePreferences();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: cores.card,
            borderTopColor: cores.borda,
          },
        ],

        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoFraco,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛸" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Sensores',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📡" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energia',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚡" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="communications"
        options={{
          title: 'Comunicação',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📶" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🚨" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
  name="nasa"
  options={{
    title: 'NASA',
    tabBarIcon: ({ focused }) => (
      <TabIcon emoji="🌌" focused={focused} />
    ),
  }}
/>
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config.',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  emojiFocused: {
    opacity: 1,
  },
});