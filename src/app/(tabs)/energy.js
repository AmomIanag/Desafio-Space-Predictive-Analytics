// Tela que serve para monitorar o sistema de energia da missão
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

// Define a cor da bateria de acordo com o nivel atual dela
function pegarCorBateria(nivel) {
  if (nivel > 60) return '#00FF88';
  if (nivel > 30) return '#FFD700';
  return '#FF4757';
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

// Analisa geração consumo e bateria para prever riscos energéticos
function gerarPrevisoes(dadosEnergia) {
  const previsoes = [];
  const saldoEnergia = dadosEnergia.geracaoSolar - dadosEnergia.consumo;

  if (saldoEnergia >= 0) {
    previsoes.push(
      `☀️ A geração solar (${dadosEnergia.geracaoSolar} kW) está maior que o consumo (${dadosEnergia.consumo} kW). A bateria está sendo carregada com saldo positivo de ${saldoEnergia.toFixed(1)} kW.`
    );
  } else {
    previsoes.push(
      `⚡ O consumo (${dadosEnergia.consumo} kW) está maior que a geração solar (${dadosEnergia.geracaoSolar} kW). A bateria está descarregando com déficit de ${Math.abs(saldoEnergia).toFixed(1)} kW.`
    );
  }

  if (dadosEnergia.nivelBateria < 20) {
    previsoes.push(
      '🔴 A bateria está em nível crítico. Recomenda-se reduzir imediatamente os sistemas não essenciais.'
    );
  } else if (dadosEnergia.nivelBateria < 40) {
    previsoes.push(
      '🟡 A bateria está abaixo do nível ideal. Considere ativar o modo de baixo consumo em sistemas não críticos.'
    );
  } else {
    previsoes.push(
      '🟢 O nível da bateria está saudável. Nenhuma ação de gerenciamento de energia é necessária no momento.'
    );
  }

  if (dadosEnergia.autonomiaHoras < 10) {
    previsoes.push(
      `⏱️ A autonomia estimada da bateria está crítica: ${dadosEnergia.autonomiaHoras} horas. Protocolos de energia emergencial devem ser considerados.`
    );
  } else if (dadosEnergia.autonomiaHoras < 24) {
    previsoes.push(
      `⏱️ A autonomia estimada da bateria é de ${dadosEnergia.autonomiaHoras} horas. Monitore com atenção no próximo ciclo.`
    );
  } else {
    previsoes.push(
      `⏱️ A autonomia estimada da bateria é de ${dadosEnergia.autonomiaHoras} horas. As reservas de energia são suficientes para continuar a operação.`
    );
  }

  if (dadosEnergia.consumo > 11) {
    previsoes.push(
      '📈 O consumo de energia aumentou acima da média. Revise os sistemas ativos para evitar gasto desnecessário.'
    );
  }

  return previsoes;
}

export default function EnergyScreen() {
  const { dadosEnergia } = useMission();
  const { cores } = usePreferences();

  const corBateria = pegarCorBateria(dadosEnergia.nivelBateria);
  const previsoes = gerarPrevisoes(dadosEnergia);
  const saldoEnergia = dadosEnergia.geracaoSolar - dadosEnergia.consumo;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: cores.textoPrincipal }]}>
          SISTEMA DE ENERGIA
        </Text>

        <EtiquetaStatus status={dadosEnergia.status} />
      </View>

      <Text style={[styles.subtitle, { color: cores.textoFraco }]}>
        Telemetria em tempo real — atualiza a cada 3 segundos
      </Text>

      {/* Card da bateria, mostra o nivel atual da bateria e a autonomia estimada */}
      <View
        style={[
          styles.batteryCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <View style={styles.batteryHeader}>
          <View style={styles.batteryTitleRow}>
            <Text style={styles.batteryEmoji}>🔋</Text>

            <Text style={[styles.batteryTitle, { color: cores.textoSecundario }]}>
              Nível da bateria
            </Text>
          </View>

          <Text style={[styles.batteryValue, { color: corBateria }]}>
            {dadosEnergia.nivelBateria}
            <Text style={[styles.batteryUnit, { color: cores.textoSecundario }]}>
              {' '}
              %
            </Text>
          </Text>
        </View>

        <BarraProgresso
          valor={dadosEnergia.nivelBateria}
          maximo={100}
          cor={corBateria}
          cores={cores}
        />

        <View style={styles.batteryFooter}>
          <Text style={[styles.batteryRange, { color: cores.textoFraco }]}>
            0%
          </Text>

          <Text style={[styles.batteryAutonomy, { color: cores.textoSecundario }]}>
            ⏱ {dadosEnergia.autonomiaHoras}h restantes
          </Text>

          <Text style={[styles.batteryRange, { color: cores.textoFraco }]}>
            100%
          </Text>
        </View>
      </View>

      {/* Grade de métricas */}
      <View style={styles.grid}>
        <CardMetrica
          emoji="☀️"
          titulo="Geração solar"
          valor={dadosEnergia.geracaoSolar}
          unidade="kW"
          cor="#FFD700"
          cores={cores}
        />

        <CardMetrica
          emoji="⚡"
          titulo="Consumo"
          valor={dadosEnergia.consumo}
          unidade="kW"
          cor="#FF6B6B"
          cores={cores}
        />
      </View>

      {/* Balanço de energia, calcula se a missão está gerando energia excedente ou consumindo reservas */}
      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.balanceLabel, { color: cores.textoFraco }]}>
          BALANÇO DE ENERGIA
        </Text>

        <Text
          style={[
            styles.balanceValue,
            {
              color: saldoEnergia >= 0 ? '#00FF88' : '#FF4757',
            },
          ]}
        >
          {saldoEnergia >= 0 ? '+' : ''}
          {saldoEnergia.toFixed(1)} kW
        </Text>

        <Text style={[styles.balanceDescription, { color: cores.textoSecundario }]}>
          {saldoEnergia >= 0
            ? 'O sistema está gerando energia excedente'
            : 'O sistema está usando reservas da bateria'}
        </Text>
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
  batteryCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  batteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batteryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batteryEmoji: {
    fontSize: 22,
  },
  batteryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  batteryValue: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  batteryUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  batteryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  batteryRange: {
    fontSize: 10,
  },
  batteryAutonomy: {
    fontSize: 12,
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
  balanceCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  balanceLabel: {
    fontSize: 11,
    letterSpacing: 2,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceDescription: {
    fontSize: 12,
    textAlign: 'center',
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