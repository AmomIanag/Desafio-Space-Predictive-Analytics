// Tela que a gente da de cara quando abre o app, login

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, error, isLoading, clearError } = useAuth();

  const [email, setEmail] = useState(''); // Estados usados para controlar campo de email
  const [password, setPassword] = useState(''); // Estado usado para controlar campo de senha
  const [validationError, setValidationError] = useState(null); // Validação

  function validate() {
    if (!email.trim()) {
      setValidationError('E-mail é obrigatório.');
      return false;
    }

    if (!password.trim()) {
      setValidationError('Senha necessária.'); // Caso o usuario nao coloque senha
      return false;
    }

    setValidationError(null);
    return true;
  }

  async function handleLogin() {
    clearError();

    if (!validate()) {
      return;
    }

    await login(email, password);
  }

  function goToRegister() { // Vai pra tela de se cadastrar
    router.push('/(auth)/register');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🛸</Text>
          <Text style={styles.title}>SPACE ANALYTICS</Text>
          <Text style={styles.subtitle}>Missão Espacial</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-MAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#4A5568"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#4A5568"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {validationError ? (
            <Text style={styles.errorText}>{validationError}</Text>
          ) : null}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#0A0E1A" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
            <Text style={styles.registerText}>Criar uma conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00D4FF',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#4A5568',
    letterSpacing: 2,
    marginTop: 6,
  },
  form: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
  label: {
    fontSize: 11,
    color: '#00D4FF',
    letterSpacing: 2,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0A0E1A',
    borderWidth: 1,
    borderColor: '#1E2A3A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#E2E8F0',
    fontSize: 15,
  },
  errorText: {
    color: '#FF4757',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00D4FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0A0E1A',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 18,
  },
  registerText: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    alignItems: 'center',
    marginTop: 32,
  },
  hintText: {
    color: '#4A5568',
    fontSize: 12,
    marginBottom: 6,
    letterSpacing: 1,
  },
  hintCredential: {
    color: '#2D3748',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
});