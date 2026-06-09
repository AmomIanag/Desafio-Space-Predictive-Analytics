// Serve para salvar e carregar dados de autenticação do async
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@space_analytics:session';
const USER_KEY = '@space_analytics:user';

// Salva a e carrega a sessão do usuário logado
export async function saveSession(session) {
  try {
    const sessionString = JSON.stringify(session);
    await AsyncStorage.setItem(SESSION_KEY, sessionString);
  } catch (e) {
    console.log('Failed to save session:', e);
  }
}

// Carrega a sessão salva para o usuário continuar conectado
export async function loadSession() {
  try {
    const sessionString = await AsyncStorage.getItem(SESSION_KEY);

    if (sessionString === null) {
      return null;
    }

    return JSON.parse(sessionString);
  } catch (e) {
    console.log('Failed to load session:', e);
    return null;
  }
}

// Remove a sessão ao fazer logout, voltando para a tela de login
export async function clearSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.log('Failed to clear session:', e);
  }
}

// Salva os dados do usuário cadastrado
export async function saveUser(user) {
  try {
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, userString);
  } catch (e) {
    console.log('Failed to save user:', e);
  }
}

// Carrega os dados do usuário cadastrado para validar o login
export async function loadUser() {
  try {
    const userString = await AsyncStorage.getItem(USER_KEY);

    if (userString === null) {
      return null;
    }

    return JSON.parse(userString);
  } catch (e) {
    console.log('Failed to load user:', e);
    return null;
  }
}