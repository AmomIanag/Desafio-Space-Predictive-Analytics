// Tela que serve para exibir os dados dos sensores da missão
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

// Barra visual que serve pra representar o nível de cada medição
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

// Card reutilizável para exibir cada sensor com valor, unidade e descrição
function CardSensor({
  titulo,
  emoji,
  valor,
  unidade,
  minimo,
  maximo,
  cor,
  descricao,
  cores,
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cores.card,
          borderColor: cores.borda,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardEmoji}>{emoji}</Text>
          <Text style={[styles.cardTitle, { color: cores.textoSecundario }]}>
            {titulo}
          </Text>
        </View>

        <Text style={[styles.cardValue, { color: cores.textoPrincipal }]}>
          {valor}
          <Text style={[styles.cardUnit, { color: cores.textoSecundario }]}>
            {' '}
            {unidade}
          </Text>
        </Text>
      </View>

      <BarraProgresso
        valor={valor - minimo}
        maximo={maximo - minimo}
        cor={cor}
        cores={cores}
      />

      <View style={styles.cardFooter}>
        <Text style={[styles.cardRange, { color: cores.textoFraco }]}>
          {minimo} {unidade}
        </Text>

        <Text style={[styles.cardRange, { color: cores.textoFraco }]}>
          {maximo} {unidade}
        </Text>
      </View>

      <Text style={[styles.cardDescription, { color: cores.textoFraco }]}>
        {descricao}
      </Text>
    </View>
  );
}

// Gera interpretações preditivas com base nos dados atuais dos sensores
function gerarPrevisoes(dadosSensores) {
  const previsoes = [];

  if (dadosSensores.temperatura > 28) {
    previsoes.push(
      '🌡️ A temperatura está subindo. Se continuar nesse ritmo, o limite de alerta térmico pode ser atingido no próximo ciclo.'
    );
  } else if (dadosSensores.temperatura < 20) {
    previsoes.push(
      '🌡️ A temperatura está abaixo do intervalo normal. É recomendado verificar os sistemas de isolamento térmico.'
    );
  } else {
    previsoes.push(
      '🌡️ A temperatura está dentro da faixa normal de operação. Nenhuma anomalia térmica prevista.'
    );
  }

  if (dadosSensores.radiacao > 3.5) {
    previsoes.push(
      '☢️ Os níveis de radiação estão elevados. A exposição contínua pode exigir protocolos de proteção da tripulação.'
    );
  } else {
    previsoes.push(
      '☢️ Radiação dentro dos limites aceitáveis. Nenhuma ação de proteção é necessária no momento.'
    );
  }

  if (dadosSensores.pressao < 99) {
    previsoes.push(
      '🌬️ A pressão está levemente abaixo do ideal. Recomenda-se verificar os sensores de integridade do módulo.'
    );
  } else {
    previsoes.push(
      '🌬️ A pressão está estável. Os sistemas atmosféricos funcionam conforme o esperado.'
    );
  }

  if (dadosSensores.umidade > 60) {
    previsoes.push(
      '💧 A umidade está alta. Há risco de condensação afetar equipamentos sensíveis se não houver correção.'
    );
  } else {
    previsoes.push(
      '💧 Os níveis de umidade estão normais. Nenhum risco relacionado à umidade foi detectado.'
    );
  }

  return previsoes;
}

export default function SensorsScreen() {
  const { dadosSensores } = useMission();
  const { cores } = usePreferences();

  const previsoes = gerarPrevisoes(dadosSensores);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* Header (cabeçalho) */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: cores.textoPrincipal }]}>
          SISTEMA DE SENSORES
        </Text>

        <EtiquetaStatus status={dadosSensores.status} />
      </View>

      <Text style={[styles.subtitle, { color: cores.textoFraco }]}>
        Telemetria em tempo real — atualiza a cada 3 segundos
      </Text>

      {/* Cards dos sensores, mostra os principais sensores ambientais da missão */}
      <CardSensor
        titulo="Temperatura"
        emoji="🌡️"
        valor={dadosSensores.temperatura}
        unidade="°C"
        minimo={18}
        maximo={35}
        cor={dadosSensores.temperatura > 30 ? '#FF4757' : cores.destaque}
        descricao="Temperatura interna da cabine e dos equipamentos"
        cores={cores}
      />

      <CardSensor
        titulo="Pressão"
        emoji="🌬️"
        valor={dadosSensores.pressao}
        unidade="kPa"
        minimo={98}
        maximo={105}
        cor="#00FF88"
        descricao="Pressão atmosférica dentro do módulo"
        cores={cores}
      />

      <CardSensor
        titulo="Radiação"
        emoji="☢️"
        valor={dadosSensores.radiacao}
        unidade="mSv/h"
        minimo={0.5}
        maximo={5.0}
        cor={
          dadosSensores.radiacao > 4.0
            ? '#FF4757'
            : dadosSensores.radiacao > 3.0
            ? '#FFD700'
            : '#00FF88'
        }
        descricao="Taxa de exposição à radiação cósmica"
        cores={cores}
      />

      <CardSensor
        titulo="Umidade"
        emoji="💧"
        valor={dadosSensores.umidade}
        unidade="%"
        minimo={30}
        maximo={70}
        cor="#A78BFA"
        descricao="Umidade relativa dentro do módulo habitável"
        cores={cores}
      />

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
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardRange: {
    fontSize: 10,
  },
  cardDescription: {
    fontSize: 12,
    fontStyle: 'italic',
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