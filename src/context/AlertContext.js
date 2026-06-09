// Context responsavel por gerar, armazenar e controlar os alertas da missão
import { createContext, useContext, useEffect, useState } from 'react';
import { saveAlerts, loadAlerts } from '../storage/alertStorage';
import { useMission } from './MissionContext';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const {
    dadosSensores,
    dadosEnergia,
    dadosComunicacao,
    dadosOrbitais,
  } = useMission();

  const [alertas, setAlertas] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega os alertas salvos quando o app inicia
  useEffect(() => {
    async function carregarAlertasSalvos() {
      try {
        const salvos = await loadAlerts();

        if (salvos) {
          setAlertas(salvos);
        }
      } catch (e) {
        console.log('Erro ao carregar alertas:', e);
      } finally {
        setCarregado(true);
      }
    }

    carregarAlertasSalvos(); //carrega os alertas salvos anteriormente no async
  }, []);

  // Salva os alertas no AsyncStorage sempre que eles mudam
  useEffect(() => {
    if (!carregado) {
      return;
    }

    saveAlerts(alertas); //salva os alertas sempre que a lista alterar
  }, [alertas, carregado]);

  // Observa os dados da missão e gera alertas automaticamente
  useEffect(() => {
    const novosAlertas = [];

    // Verificações dos sensores
    if (dadosSensores.temperatura > 30) {
      novosAlertas.push(
        criarAlerta(
          'WARNING',
          'SENSOR',
          `Temperatura alta detectada: ${dadosSensores.temperatura}°C`
        )
      );
    }

    if (dadosSensores.radiacao > 4.0) {
      novosAlertas.push(
        criarAlerta(
          'CRITICAL',
          'SENSOR',
          `Nível perigoso de radiação: ${dadosSensores.radiacao} mSv/h`
        )
      );
    }

    // Verificações de energia
    if (dadosEnergia.nivelBateria < 20) {
      novosAlertas.push(
        criarAlerta(
          'CRITICAL',
          'ENERGIA',
          `Bateria em nível crítico: ${dadosEnergia.nivelBateria}%`
        )
      );
    } else if (dadosEnergia.nivelBateria < 40) {
      novosAlertas.push(
        criarAlerta(
          'WARNING',
          'ENERGIA',
          `Nível de bateria baixo: ${dadosEnergia.nivelBateria}%`
        )
      );
    }

    // Verificações de comunicação
    if (dadosComunicacao.intensidadeSinal < 30) {
      novosAlertas.push(
        criarAlerta(
          'CRITICAL',
          'COMUNICAÇÃO',
          `Perda de sinal iminente: ${dadosComunicacao.intensidadeSinal}%`
        )
      );
    } else if (dadosComunicacao.intensidadeSinal < 50) {
      novosAlertas.push(
        criarAlerta(
          'WARNING',
          'COMUNICAÇÃO',
          `Sinal fraco detectado: ${dadosComunicacao.intensidadeSinal}%`
        )
      );
    }

    if (dadosComunicacao.qualidadeTransmissao < 50) {
      novosAlertas.push(
        criarAlerta(
          'CRITICAL',
          'COMUNICAÇÃO',
          `Qualidade de transmissão reduzida: ${dadosComunicacao.qualidadeTransmissao}%`
        )
      );
    }

    // Verificações orbitais
    if (dadosOrbitais.desvio > 0.3) {
      novosAlertas.push(
        criarAlerta(
          'CRITICAL',
          'ORBITAL',
          `Desvio orbital crítico: ${dadosOrbitais.desvio}°`
        )
      );
    } else if (dadosOrbitais.desvio > 0.15) {
      novosAlertas.push(
        criarAlerta(
          'WARNING',
          'ORBITAL',
          `Desvio orbital detectado: ${dadosOrbitais.desvio}°`
        )
      );
    }

    if (novosAlertas.length === 0) {
      return;
    }

    // Adiciona novos alertas e evita duplicados em menos de 10 segundos
    setAlertas((anteriores) => {
      const agora = Date.now();

      const filtrados = novosAlertas.filter((novoAlerta) => {
        return !anteriores.some(
          (existente) =>
            existente.mensagem === novoAlerta.mensagem &&
            agora - new Date(existente.dataHora).getTime() < 10000
        );
      });

      if (filtrados.length === 0) {
        return anteriores;
      }

      return [...filtrados, ...anteriores].slice(0, 50);
    });
  }, [dadosSensores, dadosEnergia, dadosComunicacao, dadosOrbitais]);

  //Cria um objeto de alerta com categoria, severidade, mensagem e horario
  function criarAlerta(severidade, categoria, mensagem) {
    return {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      severidade,
      categoria,
      mensagem,
      dataHora: new Date().toISOString(),
      lido: false,
    };
  }

  function removerAlerta(id) { // função que remove apenas um alerta específico da lista
    setAlertas((anteriores) => anteriores.filter((alerta) => alerta.id !== id));
  }

  function removerTodosAlertas() {
    setAlertas([]);
  }

  function marcarTodosComoLidos() { //função que marca os alertas como lidos quando o usuário acessa a tela de alerts
    setAlertas((anteriores) =>
      anteriores.map((alerta) => ({
        ...alerta,
        lido: true,
      }))
    );
  }

  const quantidadeNaoLidos = alertas.filter((alerta) => !alerta.lido).length;

  return (
    <AlertContext.Provider
      value={{
        alertas,
        quantidadeNaoLidos,
        removerAlerta,
        removerTodosAlertas,
        marcarTodosComoLidos,

        // Mantive esses nomes antigos temporariamente para não quebrar outras telas ainda
        alerts: alertas,
        unreadCount: quantidadeNaoLidos,
        dismissAlert: removerAlerta,
        dismissAllAlerts: removerTodosAlertas,
        markAllAsRead: marcarTodosComoLidos,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const contexto = useContext(AlertContext);

  if (!contexto) {
    throw new Error('useAlerts deve ser usado dentro de um AlertProvider');
  }

  return contexto;
}