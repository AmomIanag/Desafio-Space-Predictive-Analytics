// Basicamente salva as preferências do usuario no async
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@space_analytics:preferences';

// Salva as preferências do usuario no async
export async function savePreferences(preferences) {
  try {
    const preferencesString = JSON.stringify(preferences);
    await AsyncStorage.setItem(PREFERENCES_KEY, preferencesString);
  } catch (e) {
    console.log('Failed to save preferences:', e);
  }
}

// Carrega as preferências salvas quando o app é aberto
export async function loadPreferences() {
  try {
    const preferencesString = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (preferencesString === null) return null;
    return JSON.parse(preferencesString);
  } catch (e) {
    console.log('Failed to load preferences:', e);
    return null;
  }
}