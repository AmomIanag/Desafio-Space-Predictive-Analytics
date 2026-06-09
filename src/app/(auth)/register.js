// Tela que vai depois que você clica em se cadastrar
import { saveUser } from '../../storage/authStorage';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState(''); // Estados dos campos do formulario de cadastro
  const [turma, setTurma] = useState('');
  const [rm, setRm] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erros, setErros] = useState({});

  function validarEmail(emailDigitado) { // Aqui ele valida se o email é um formato válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailDigitado);
  }

  function validarFormulario() { // Aqui ele valida se foi colocado tudo certinho caso contrario ele coloca uma mensagem de erro
    const novosErros = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório.';
    }

    if (!turma.trim()) {
      novosErros.turma = 'Turma é obrigatória.';
    }

    if (!rm.trim()) {
      novosErros.rm = 'RM é obrigatório.';
    }

    if (!email.trim()) {
      novosErros.email = 'E-mail é obrigatório.';
    } else if (!validarEmail(email)) {
      novosErros.email = 'Digite um e-mail válido.';
    }

    if (!senha.trim()) {
      novosErros.senha = 'Senha é obrigatória.';
    }

    if (!confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirme sua senha.';
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem.';
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

async function handleRegister() {
  const formularioValido = validarFormulario();

  if (!formularioValido) {
    return;
  }

  const novoUsuario = {
    nome,
    turma,
    rm,
    email,
    senha,
  };

  await saveUser(novoUsuario);

  router.replace('/(auth)/login');
}

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Registrar seu acesso para a missão</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>NOME</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#4A5568"
            value={nome}
            onChangeText={setNome}
          />
          {erros.nome ? <Text style={styles.errorText}>{erros.nome}</Text> : null}

          <Text style={styles.label}>TURMA</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua turma"
            placeholderTextColor="#4A5568"
            value={turma}
            onChangeText={setTurma}
          />
          {erros.turma ? <Text style={styles.errorText}>{erros.turma}</Text> : null}

          <Text style={styles.label}>RM</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu RM"
            placeholderTextColor="#4A5568"
            value={rm}
            onChangeText={setRm}
            keyboardType="numeric"
          />
          {erros.rm ? <Text style={styles.errorText}>{erros.rm}</Text> : null}

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
          {erros.email ? <Text style={styles.errorText}>{erros.email}</Text> : null}

          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#4A5568"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          {erros.senha ? <Text style={styles.errorText}>{erros.senha}</Text> : null}

          <Text style={styles.label}>CONFIRMAR SENHA</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme sua senha"
            placeholderTextColor="#4A5568"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
          {erros.confirmarSenha ? (
            <Text style={styles.errorText}>{erros.confirmarSenha}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.backButtonText}>Já tenho uma conta</Text>
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
    marginBottom: 32,
  },
  logo: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D4FF',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 13,
    color: '#4A5568',
    letterSpacing: 1,
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
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#00D4FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#0A0E1A',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 18,
  },
  backButtonText: {
    color: '#00D4FF',
    fontSize: 13,
  },
});