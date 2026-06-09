// Serva para monitorar a comunicação da missão
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useMission } from '../../context/MissionContext';
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

function BarraProgresso({ valor, maximo, cor, cores }) {
  const porcentagem = Math.min((valor / maximo) * 100, 100);

  return (
    <View style={[styles.progressTrack, { backgroundColor: cores.borda }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${porcentagem}%`, backgroundColor: cor },
        ]}
      />
    </View>
  );
}

// Define a cor do sinal conforme a intensidade da comunicação
function pegarCorSinal(intensidade) {
  if (intensidade > 70) return '#00FF88';
  if (intensidade > 40) return '#FFD700';
  return '#FF4757';
}

// Define a cor da latencia conforme o tempo de resposta
function pegarCorLatencia(latencia) {
  if (latencia < 300) return '#00FF88';
  if (latencia < 500) return '#FFD700';
  return '#FF4757';
}

function pegarCorQualidade(qualidade) {
  if (qualidade > 75) return '#00FF88';
  if (qualidade > 50) return '#FFD700';
  return '#FF4757';
}

function BarraSinal({ valor, texto, cores }) {
  const cor = pegarCorSinal(valor);

  return (
    <View style={styles.signalBarContainer}>
      <View style={styles.signalBarHeader}>
        <Text style={[styles.signalBarLabel, { color: cores.textoSecundario }]}>
          {texto}
        </Text>

        <Text style={[styles.signalBarValue, { color: cor }]}>
          {valor}%
        </Text>
      </View>

      <BarraProgresso valor={valor} maximo={100} cor={cor} cores={cores} />
    </View>
  );
}

function CardMetrica({ emoji, titulo, valor, unidade, cor, cores }) {
  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: cores.card,
          borderColor: cor + '33',
        },
      ]}
    >
      <Text style={styles.metricEmoji}>{emoji}</Text>

      <Text style={[styles.metricTitle, { color: cores.textoFraco }]}>
        {titulo}
      </Text>

      <Text style={[styles.metricValue, { color: cor }]}>
        {valor}
        <Text style={[styles.metricUnit, { color: cores.textoSecundario }]}>
          {' '}
          {unidade}
        </Text>
      </Text>
    </View>
  );
}

// Gera análises sobre sinal, latência, qualidade de transmissão e taxa de dados
function gerarPrevisoes(dadosComunicacao) {
  const previsoes = [];

  if (dadosComunicacao.intensidadeSinal < 30) {
    previsoes.push(
      '📡 A intensidade do sinal está criticamente baixa. Um apagão de comunicação é iminente. Protocolos de retransmissão devem ser ativados.'
    );
  } else if (dadosComunicacao.intensidadeSinal < 50) {
    previsoes.push(
      '📡 A intensidade do sinal está caindo. Se continuar assim, a confiabilidade da comunicação será reduzida no próximo ciclo.'
    );
  } else if (dadosComunicacao.intensidadeSinal > 80) {
    previsoes.push(
      '📡 A intensidade do sinal está excelente. O link de comunicação está estável e confiável.'
    );
  } else {
    previsoes.push(
      '📡 A intensidade do sinal está dentro da faixa aceitável. Continue monitorando possíveis quedas.'
    );
  }

  if (dadosComunicacao.latencia > 600) {
    previsoes.push(
      '⏱️ A latência está criticamente alta. Atrasos na transmissão podem afetar comunicações importantes da missão.'
    );
  } else if (dadosComunicacao.latencia > 400) {
    previsoes.push(
      '⏱️ A latência está acima do normal. Comandos em tempo real podem sofrer atrasos perceptíveis.'
    );
  } else {
    previsoes.push(
      '⏱️ A latência está dentro da faixa normal. Comandos e dados estão sendo transmitidos com eficiência.'
    );
  }

  if (dadosComunicacao.qualidadeTransmissao < 50) {
    previsoes.push(
      '📉 A qualidade de transmissão está criticamente reduzida. A integridade dos dados pode não ser garantida.'
    );
  } else if (dadosComunicacao.qualidadeTransmissao < 70) {
    previsoes.push(
      '📉 A qualidade de transmissão está abaixo do ideal. Alguns pacotes de dados podem precisar de retransmissão.'
    );
  } else {
    previsoes.push(
      '📶 A qualidade de transmissão está boa. A integridade dos dados está sendo mantida.'
    );
  }

  if (dadosComunicacao.taxaDados < 20) {
    previsoes.push(
      '🐢 A taxa de dados caiu bastante. Transferências grandes e uploads de telemetria podem atrasar.'
    );
  } else if (dadosComunicacao.taxaDados > 70) {
    previsoes.push(
      '🚀 A taxa de dados está alta. Este é um bom momento para uploads grandes de telemetria ou atualizações.'
    );
  }

  return previsoes;
}

export default function CommunicationsScreen() {
  const { dadosComunicacao } = useMission();
  const { cores } = usePreferences();

  const previsoes = gerarPrevisoes(dadosComunicacao);
  const corSinal = pegarCorSinal(dadosComunicacao.intensidadeSinal);
  const corLatencia = pegarCorLatencia(dadosComunicacao.latencia);
  const corQualidade = pegarCorQualidade(dadosComunicacao.qualidadeTransmissao);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: cores.textoPrincipal }]}>
          COMUNICAÇÃO
        </Text>

        <EtiquetaStatus status={dadosComunicacao.status} />
      </View>

      <Text style={[styles.subtitle, { color: cores.textoFraco }]}>
        Telemetria em tempo real — atualiza a cada 3 segundos
      </Text>

      {/* Visão geral do sinal, mostra a qualidade do sinal de comunicação */}
      <View
        style={[
          styles.overviewCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.overviewLabel, { color: cores.textoFraco }]}>
          QUALIDADE GERAL DO SINAL
        </Text>

        <Text style={[styles.overviewValue, { color: corSinal }]}>
          {dadosComunicacao.intensidadeSinal}%
        </Text>

        <BarraProgresso
          valor={dadosComunicacao.intensidadeSinal}
          maximo={100}
          cor={corSinal}
          cores={cores}
        />

        <Text style={[styles.overviewStatus, { color: corSinal }]}>
          {dadosComunicacao.intensidadeSinal > 70
            ? 'SINAL FORTE'
            : dadosComunicacao.intensidadeSinal > 40
            ? 'SINAL MODERADO'
            : 'SINAL FRACO'}
        </Text>
      </View>

      {/* Grade de métricas */}
      <View style={styles.grid}>
        <CardMetrica
          emoji="⏱️"
          titulo="Latência"
          valor={dadosComunicacao.latencia}
          unidade="ms"
          cor={corLatencia}
          cores={cores}
        />

        <CardMetrica
          emoji="📊"
          titulo="Taxa de dados"
          valor={dadosComunicacao.taxaDados}
          unidade="Mbps"
          cor={cores.destaque}
          cores={cores}
        />
      </View>

      {/* Qualidade da transmissão */}
      <View
        style={[
          styles.qualityCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <View style={styles.qualityHeader}>
          <View style={styles.qualityTitleRow}>
            <Text style={styles.qualityEmoji}>📶</Text>

            <Text style={[styles.qualityTitle, { color: cores.textoSecundario }]}>
              Qualidade da transmissão
            </Text>
          </View>

          <Text style={[styles.qualityValue, { color: corQualidade }]}>
            {dadosComunicacao.qualidadeTransmissao}%
          </Text>
        </View>

        <BarraProgresso
          valor={dadosComunicacao.qualidadeTransmissao}
          maximo={100}
          cor={corQualidade}
          cores={cores}
        />

        <View style={styles.qualityFooter}>
          <Text style={[styles.qualityRange, { color: cores.textoFraco }]}>
            0%
          </Text>

          <Text style={[styles.qualityRange, { color: cores.textoFraco }]}>
            100%
          </Text>
        </View>
      </View>

      {/* Barras de sinal, detalha os canais de envio, recebimento e qualidade do link */}
      <View
        style={[
          styles.signalBarsCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.signalBarsTitle, { color: cores.textoFraco }]}>
          DETALHAMENTO DOS CANAIS
        </Text>

        <BarraSinal
          valor={dadosComunicacao.intensidadeSinal}
          texto="Sinal de envio"
          cores={cores}
        />

        <BarraSinal
          valor={Math.min(dadosComunicacao.intensidadeSinal + 5, 100)}
          texto="Sinal de recebimento"
          cores={cores}
        />

        <BarraSinal
          valor={dadosComunicacao.qualidadeTransmissao}
          texto="Qualidade do link"
          cores={cores}
        />
      </View>

      {/* Análise preditiva */}
      <Text style={[styles.sectionTitle, { color: cores.textoFraco }]}>
        ANÁLISE PREDITIVA
      </Text>

      <View
        style={[
          styles.predictionCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        {previsoes.map((texto, index) => (
          <Text
            key={index}
            style={[styles.predictionItem, { color: cores.textoSecundario }]}
          >
            {texto}
          </Text>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 20,
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
  overviewCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  overviewLabel: {
    fontSize: 11,
    letterSpacing: 2,
  },
  overviewValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  overviewStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  metricEmoji: {
    fontSize: 28,
  },
  metricTitle: {
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  qualityCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityEmoji: {
    fontSize: 22,
  },
  qualityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  qualityValue: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  qualityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  qualityRange: {
    fontSize: 10,
  },
  signalBarsCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    gap: 16,
  },
  signalBarsTitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
  },
  signalBarContainer: {
    gap: 6,
  },
  signalBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signalBarLabel: {
    fontSize: 12,
  },
  signalBarValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  predictionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    gap: 14,
  },
  predictionItem: {
    fontSize: 13,
    lineHeight: 20,
  },
});