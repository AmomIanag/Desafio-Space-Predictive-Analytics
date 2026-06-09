// Tela de configs do usuário e preferencias do aplicativo
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePreferences } from '../../context/PreferencesContext';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { preferences, alternarTema, cores, temaAtual } = usePreferences();
  const { user, logout } = useAuth();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: cores.textoPrincipal }]}>
          CONFIGURAÇÕES
        </Text>

        <Text style={[styles.subtitle, { color: cores.textoFraco }]}>
          Preferências do usuário e aparência do app
        </Text>
      </View>

      <View
        style={[ //Exibe os dados do usuário cadastrado
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cores.destaque }]}>
          Usuário
        </Text>

        <Text style={[styles.infoText, { color: cores.textoPrincipal }]}>
          Nome: {user?.nome || 'Não informado'}
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          RM: {user?.rm || 'Não informado'}
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          Turma: {user?.turma || 'Não informado'}
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          E-mail: {user?.email || 'Não informado'}
        </Text>
      </View>

      <View
        style={[ //Permite alterar entre modo claro e escuro (diferencial)
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cores.destaque }]}>
          Aparência
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          Tema atual: {temaAtual === 'dark' ? 'Escuro' : 'Claro'}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: cores.botao }]}
          onPress={alternarTema}
        >
          <Text style={[styles.buttonText, { color: cores.textoBotao }]}>
            Alternar para tema {temaAtual === 'dark' ? 'claro' : 'escuro'}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cores.destaque }]}>
          Alertas 
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          Temperatura crítica: {preferences.temperatureThreshold}°C
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          Radiação crítica: {preferences.radiationThreshold} mSv/h
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          Bateria crítica: {preferences.batteryThreshold}%
        </Text>

        <Text style={[styles.infoText, { color: cores.textoSecundario }]}>
          Sinal crítico: {preferences.signalThreshold}%
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: cores.perigo }]} // Encerra a sessão atual e volta pro login
        onPress={logout}
      >
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  logoutButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});