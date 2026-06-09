// Serve para listar e gerenciar os alertas gerados automaticamente
import { useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAlerts } from '../../context/AlertContext';
import { usePreferences } from '../../context/PreferencesContext';

// Componente usado para exibir cada alerta
function CardAlerta({ alerta, aoRemover, cores }) {
  const critico = alerta.severidade === 'CRITICAL';

  const emojisCategoria = {
    SENSOR: '🌡️',
    ENERGIA: '⚡',
    COMUNICAÇÃO: '📡',
    ORBITAL: '🪐',
  };

  const textosSeveridade = {
    WARNING: 'ATENÇÃO',
    CRITICAL: 'CRÍTICO',
  };

  function formatarHora(dataISO) {
    const data = new Date(dataISO);

    return data.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  return (
    <View
      style={[
        styles.alertCard,
        {
          backgroundColor: critico ? cores.cardCritico : cores.cardAviso,
          borderColor: critico ? '#FF475766' : '#FFD70066',
        },
      ]}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleRow}>
          <Text style={styles.alertEmoji}>
            {emojisCategoria[alerta.categoria] ?? '⚠️'}
          </Text>

          <View>
            <Text
              style={[
                styles.alertSeverity,
                { color: critico ? '#FF4757' : '#FFD700' },
              ]}
            >
              {textosSeveridade[alerta.severidade] ?? alerta.severidade}
            </Text>

            <Text style={[styles.alertCategory, { color: cores.textoFraco }]}>
              {alerta.categoria}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.dismissButton, { backgroundColor: cores.borda }]}
          onPress={() => aoRemover(alerta.id)}
        >
          <Text style={[styles.dismissText, { color: cores.textoSecundario }]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.alertMessage, { color: cores.textoSecundario }]}>
        {alerta.mensagem}
      </Text>

      <Text style={[styles.alertTime, { color: cores.textoFraco }]}>
        🕐 {formatarHora(alerta.dataHora)}
      </Text>
    </View>
  );
}

export default function AlertsScreen() {
  const {
    alertas,
    quantidadeNaoLidos,
    removerAlerta,
    removerTodosAlertas,
    marcarTodosComoLidos,
  } = useAlerts();

  const { cores } = usePreferences();

  // Ao abrir a tela, os alertas são marcados como lidos
  useEffect(() => {
    if (quantidadeNaoLidos > 0) {
      marcarTodosComoLidos();
    }
  }, []);

  const alertasCriticos = alertas.filter( // Separa os alertas por severidade para melhorar a visualização
    (alerta) => alerta.severidade === 'CRITICAL'
  );

  const alertasAtencao = alertas.filter(
    (alerta) => alerta.severidade === 'WARNING'
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: cores.textoPrincipal }]}>
          CENTRAL DE ALERTAS
        </Text>

        {alertas.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: cores.borda }]}
            onPress={removerTodosAlertas}
          >
            <Text style={[styles.clearButtonText, { color: cores.perigo }]}>
              Limpar tudo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.subtitle, { color: cores.textoFraco }]}>
        {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} ativo
        {alertas.length !== 1 ? 's' : ''}
      </Text>

      {/* Resumo, mostra um resumo da quantidade de alertas críticos, de atenção e totais */}
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: cores.cardCritico,
              borderColor: '#FF475733',
            },
          ]}
        >
          <Text style={[styles.summaryCount, { color: cores.textoPrincipal }]}>
            {alertasCriticos.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: cores.textoFraco }]}>
            CRÍTICOS
          </Text>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: cores.cardAviso,
              borderColor: '#FFD70033',
            },
          ]}
        >
          <Text style={[styles.summaryCount, { color: cores.textoPrincipal }]}>
            {alertasAtencao.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: cores.textoFraco }]}>
            ATENÇÃO
          </Text>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: cores.card,
              borderColor: cores.borda,
            },
          ]}
        >
          <Text style={[styles.summaryCount, { color: cores.textoPrincipal }]}>
            {alertas.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: cores.textoFraco }]}>
            TOTAL
          </Text>
        </View>
      </View>

      {/* Estado vazio, mensagem exibida quando não existem alertas ativos */}
      {alertas.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🤠</Text>

          <Text style={styles.emptyTitle}>
            Todos os sistemas estão normais
          </Text>

          <Text style={[styles.emptySubtitle, { color: cores.textoFraco }]}>
            Nenhum alerta ativo foi detectado. Todos os sistemas da missão estão
            operando dentro dos parâmetros esperados.
          </Text>
        </View>
      )}

      {/* Alertas críticos */}
      {alertasCriticos.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: cores.textoFraco }]}>
            CRÍTICOS
          </Text>

          {alertasCriticos.map((alerta) => (
            <CardAlerta
              key={alerta.id}
              alerta={alerta}
              aoRemover={removerAlerta}
              cores={cores}
            />
          ))}
        </>
      )}

      {/* Alertas de atenção */}
      {alertasAtencao.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: cores.textoFraco }]}>
            ATENÇÃO
          </Text>

          {alertasAtencao.map((alerta) => (
            <CardAlerta
              key={alerta.id}
              alerta={alerta}
              aoRemover={removerAlerta}
              cores={cores}
            />
          ))}
        </>
      )}
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
  clearButton: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF88',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 4,
  },
  alertCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertEmoji: {
    fontSize: 24,
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  alertCategory: {
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 2,
  },
  dismissButton: {
    borderRadius: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertTime: {
    fontSize: 11,
  },
});