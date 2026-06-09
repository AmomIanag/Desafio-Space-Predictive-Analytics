// Serve para separar a parte de armazenamento dos alertas, deixando o código mais organizadinho
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALERTS_KEY = '@space_analytics:alerts';

// Salva os alertas no async
export async function saveAlerts(alerts) {
  try {
    const alertsString = JSON.stringify(alerts);
    await AsyncStorage.setItem(ALERTS_KEY, alertsString);
  } catch (e) {
    console.log('Failed to save alerts:', e);
  }
}

// carrega os alertas do async
export async function loadAlerts() {
  try {
    const alertsString = await AsyncStorage.getItem(ALERTS_KEY);
    if (alertsString === null) return [];
    return JSON.parse(alertsString);
  } catch (e) {
    console.log('Failed to load alerts:', e);
    return [];
  }
}