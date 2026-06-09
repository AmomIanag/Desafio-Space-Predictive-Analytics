// Tela principal do app, aquela que a gente da de cara depois de logar, exibindo o resumo geral da missão
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMission } from '../../context/MissionContext';
import { useAlerts } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';

function EtiquetaStatus({ status }) {
  const coresStatus = {
    NOMINAL: '#00FF88',
    WARNING: '#FFD700',
    CRITICAL: '#FF4757',
  };

  const textos = {
    NOMINAL: 'NORMAL',
    WARNING: 'ATENÇÃO',
    CRITICAL: 'CRÍTICO',
  };

  return (
    <View style={[styles.badge, { backgroundColor: coresStatus[status] ?? '#4A5568' }]}>
      <Text style={styles.badgeText}>{textos[status] ?? status}</Text>
    </View>
  );
}

// Componente reutilizável para exibir o status resumido de cada sistema
function CardSistema({ titulo, emoji, valor, unidade, status, aoPressionar, cores }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cores.card,
          borderColor: cores.borda,
        },
      ]}
      onPress={aoPressionar}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{emoji}</Text>
        <EtiquetaStatus status={status} />
      </View>

      <Text style={[styles.cardTitle, { color: cores.textoFraco }]}>
        {titulo}
      </Text>

      <Text style={[styles.cardValue, { color: cores.textoPrincipal }]}>
        {valor}
        <Text style={[styles.cardUnit, { color: cores.textoSecundario }]}>
          {' '}
          {unidade}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const { user } = useAuth(); 
  const { cores } = usePreferences(); // Consome as cores do tema atual (preferencias do usuario)

  const {
    infoMissao,
    dadosSensores,
    dadosEnergia,
    dadosComunicacao,
    dadosOrbitais,
  } = useMission(); // consome os dados da missão simulada

  const { unreadCount } = useAlerts(); // Consome os alertas não lidos
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: cores.destaque }]}>
          Bem-vindo, {user?.nome || 'tripulante'}
        </Text>

        <Text style={[styles.role, { color: cores.textoFraco }]}>
          RM: {user?.rm} | Turma: {user?.turma}
        </Text>
      </View>


      {/* Informações da missão espacial (simulada) */} 
      <View
        style={[
          styles.missionCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <View style={styles.missionRow}>
          <Text style={[styles.missionLabel, { color: cores.textoFraco }]}>
            MISSÃO
          </Text>

          <EtiquetaStatus status={infoMissao.status === 'ATIVA' ? 'NOMINAL' : 'WARNING'} />
        </View>

        <Text style={[styles.missionName, { color: cores.destaque }]}>
          {infoMissao.nome}
        </Text>

        <View style={styles.missionDetails}>
          <Text style={[styles.missionDetail, { color: cores.textoSecundario }]}>
            🌍 Órbita: {infoMissao.altitudeOrbital} km
          </Text>

          <Text style={[styles.missionDetail, { color: cores.textoSecundario }]}>
            👨‍🚀 Time: {infoMissao.quantidadeTripulantes}
          </Text>

          <Text style={[styles.missionDetail, { color: cores.textoSecundario }]}>
            📅 Desde: {infoMissao.dataInicio}
          </Text>
        </View>
      </View>

      {/* Aviso de alertas */}
      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => router.push('/(tabs)/alerts')}
        >
          <Text style={styles.alertBannerText}>
            🚨 {unreadCount} alerta{unreadCount > 1 ? 's' : ''} não lido
            {unreadCount > 1 ? 's' : ''} — toque para visualizar
          </Text>
        </TouchableOpacity>
      )}

      {/* Cards de navegação dos sistemas simulados */}
      <Text style={[styles.sectionTitle, { color: cores.textoFraco }]}>
        STATUS DOS SISTEMAS
      </Text>

      <View style={styles.grid}>
        <CardSistema
          titulo="Sensores"
          emoji="🌡️"
          valor={dadosSensores.temperatura}
          unidade="°C"
          status={dadosSensores.status}
          aoPressionar={() => router.push('/(tabs)/sensors')}
          cores={cores}
        />

        <CardSistema
          titulo="Energia"
          emoji="⚡"
          valor={dadosEnergia.nivelBateria}
          unidade="%"
          status={dadosEnergia.status}
          aoPressionar={() => router.push('/(tabs)/energy')}
          cores={cores}
        />

        <CardSistema
          titulo="Comunicação"
          emoji="📡"
          valor={dadosComunicacao.intensidadeSinal}
          unidade="%"
          status={dadosComunicacao.status}
          aoPressionar={() => router.push('/(tabs)/communications')}
          cores={cores}
        />

        <CardSistema
          titulo="Órbita"
          emoji="🪐"
          valor={dadosOrbitais.altitude}
          unidade="km"
          status={dadosOrbitais.status}
          aoPressionar={() => router.push('/(tabs)/sensors')}
          cores={cores}
        />
      </View>

      {/* Interpretacao simples dos dados para apoiar a tomada de decisão */}
      <Text style={[styles.sectionTitle, { color: cores.textoFraco }]}>
        INTELIGÊNCIA DA MISSÃO
      </Text>

      <View
        style={[
          styles.interpretationCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.interpretationItem, { color: cores.textoSecundario }]}>
          🔋 Bateria em {dadosEnergia.nivelBateria}% —{' '}
          {dadosEnergia.nivelBateria > 60
            ? 'os níveis de energia estão saudáveis.'
            : dadosEnergia.nivelBateria > 30
            ? 'é recomendado reduzir consumos não essenciais.'
            : 'gerenciamento imediato de energia é necessário.'}
        </Text>

        <Text style={[styles.interpretationItem, { color: cores.textoSecundario }]}>
          📶 Sinal em {dadosComunicacao.intensidadeSinal}% —{' '}
          {dadosComunicacao.intensidadeSinal > 70
            ? 'a comunicação está estável.'
            : dadosComunicacao.intensidadeSinal > 40
            ? 'a qualidade do sinal pode afetar as transmissões.'
            : 'o link de comunicação está em risco.'}
        </Text>

        <Text style={[styles.interpretationItem, { color: cores.textoSecundario }]}>
          🌡️ Temperatura em {dadosSensores.temperatura}°C —{' '}
          {dadosSensores.temperatura < 25
            ? 'os sistemas térmicos operam normalmente.'
            : dadosSensores.temperatura < 30
            ? 'pequena elevação térmica detectada.'
            : 'limite térmico de alerta ultrapassado.'}
        </Text>

        <Text style={[styles.interpretationItem, { color: cores.textoSecundario }]}>
          🪐 Desvio orbital em {dadosOrbitais.desvio}° —{' '}
          {dadosOrbitais.desvio < 0.1
            ? 'a órbita está estável.'
            : dadosOrbitais.desvio < 0.2
            ? 'pequeno desvio detectado, monitoramento recomendado.'
            : 'uma manobra de correção pode ser necessária.'}
        </Text>
      </View>
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
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 2,
  },
  missionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  missionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionLabel: {
    fontSize: 11,
    letterSpacing: 2,
  },
  missionName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 12,
  },
  missionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  missionDetail: {
    fontSize: 12,
  },
  alertBanner: {
    backgroundColor: '#2D1B1B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF4757',
  },
  alertBannerText: {
    color: '#FF4757',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    width: '47%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardUnit: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0A0E1A',
    letterSpacing: 1,
  },
  interpretationCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    gap: 14,
  },
  interpretationItem: {
    fontSize: 13,
    lineHeight: 20,
  },
});