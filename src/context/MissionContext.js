// Esse contexto serve pra armazenar e simular os dados da missão espacial (dados fictícios)
import { createContext, useContext, useEffect, useState } from 'react';

const MissionContext = createContext(null);

// Context que garante que os dados simulados fiquem dentro de uma faixa segura (nao pode aparecer sinal forte 103% né KKK)
function limitarValor(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

// Cria pequenas variacoes totalmente aleatórias para simular dados em tempo real
function variarValor(valor, quantidade) {
  const variacao = (Math.random() - 0.5) * 2 * quantidade;
  return parseFloat((valor + variacao).toFixed(2));
}

export function MissionProvider({ children }) {
  const [infoMissao] = useState({
    nome: 'AMOM-7',
    status: 'ATIVA',
    dataInicio: '12/01/2027',
    altitudeOrbital: 408,
    quantidadeTripulantes: 4,
  });

  // Aqui começam os usestates que são os estados principais da missão: sensores, energia, comunicacao e orbita
  
  // Dados dos sensores, simula alterações nos sensores ambientais da missão
  const [dadosSensores, setDadosSensores] = useState({
    temperatura: 22.4, // Graus em celsius
    pressao: 101.3, // kPa
    radiacao: 2.1, // mSv/h
    umidade: 45.0, // %
    status: 'NOMINAL',
  });

  // Dados de energia, simula o comportamento da bateria, geração solar e o consumo
  const [dadosEnergia, setDadosEnergia] = useState({
    nivelBateria: 87.0, // %
    geracaoSolar: 12.4, // kW
    consumo: 9.8, // kW
    autonomiaHoras: 72.0, // horas restantes
    status: 'NOMINAL',
  });

  // Dados de comunicação, simula qualidade do sinal e da transmissão de dados
  const [dadosComunicacao, setDadosComunicacao] = useState({
    intensidadeSinal: 78.0, // %
    latencia: 320, // ms
    qualidadeTransmissao: 91.0, // %
    taxaDados: 54.0, // Mbps
    status: 'NOMINAL',
  });

  // Dados orbitais, ele simula pequenas variacoes na altitude, velocidade e desvio orbital
  const [dadosOrbitais, setDadosOrbitais] = useState({
    altitude: 408.0, // km
    velocidade: 7.66, // km/s
    inclinacao: 51.6, // graus
    desvio: 0.02, // graus
    status: 'NOMINAL',
  });

  // Simulação em tempo real
  // Atualiza todos os dados a cada 3 segundos com pequenas variações aleatórias
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDadosSensores((anterior) => {
        const temperatura = limitarValor(
          variarValor(anterior.temperatura, 0.5),
          18,
          35
        );

        const pressao = limitarValor(
          variarValor(anterior.pressao, 0.3),
          98,
          105
        );

        const radiacao = limitarValor(
          variarValor(anterior.radiacao, 0.1),
          0.5,
          5.0
        );

        const umidade = limitarValor(
          variarValor(anterior.umidade, 0.5),
          30,
          70
        );

        const status =
          temperatura > 30 || radiacao > 4.0 ? 'WARNING' : 'NOMINAL';

        return {
          temperatura,
          pressao,
          radiacao,
          umidade,
          status,
        };
      });

      setDadosEnergia((anterior) => {
        const geracaoSolar = limitarValor(
          variarValor(anterior.geracaoSolar, 0.3),
          8,
          16
        );

        const consumo = limitarValor(
          variarValor(anterior.consumo, 0.2),
          7,
          13
        );

        const nivelBateria = limitarValor(
          variarValor(anterior.nivelBateria, 0.4),
          10,
          100
        );

        const autonomiaHoras = limitarValor(
          parseFloat((nivelBateria / consumo).toFixed(1)),
          0,
          120
        );

        const status =
          nivelBateria < 20
            ? 'CRITICAL'
            : nivelBateria < 40
            ? 'WARNING'
            : 'NOMINAL';

        return {
          nivelBateria,
          geracaoSolar,
          consumo,
          autonomiaHoras,
          status,
        };
      });

      setDadosComunicacao((anterior) => {
        const intensidadeSinal = limitarValor(
          variarValor(anterior.intensidadeSinal, 1.5),
          20,
          100
        );

        const latencia = limitarValor(
          variarValor(anterior.latencia, 10),
          100,
          800
        );

        const qualidadeTransmissao = limitarValor(
          variarValor(anterior.qualidadeTransmissao, 1.0),
          40,
          100
        );

        const taxaDados = limitarValor(
          variarValor(anterior.taxaDados, 1.0),
          10,
          100
        );

        const status =
          intensidadeSinal < 30 || qualidadeTransmissao < 50
            ? 'CRITICAL'
            : intensidadeSinal < 50
            ? 'WARNING'
            : 'NOMINAL';

        return {
          intensidadeSinal,
          latencia,
          qualidadeTransmissao,
          taxaDados,
          status,
        };
      });

      setDadosOrbitais((anterior) => {
        const altitude = limitarValor(
          variarValor(anterior.altitude, 0.5),
          380,
          430
        );

        const velocidade = limitarValor(
          variarValor(anterior.velocidade, 0.01),
          7.5,
          7.9
        );

        const inclinacao = limitarValor(
          variarValor(anterior.inclinacao, 0.05),
          51.0,
          52.0
        );

        const desvio = limitarValor(
          variarValor(anterior.desvio, 0.005),
          0,
          0.5
        );

        const status =
          desvio > 0.3
            ? 'CRITICAL'
            : desvio > 0.15
            ? 'WARNING'
            : 'NOMINAL';

        return {
          altitude,
          velocidade,
          inclinacao,
          desvio,
          status,
        };
      });
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <MissionContext.Provider
      value={{
        infoMissao,
        dadosSensores,
        dadosEnergia,
        dadosComunicacao,
        dadosOrbitais,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const contexto = useContext(MissionContext);

  if (!contexto) {
    throw new Error('useMission deve ser usado dentro de um MissionProvider');
  }

  return contexto;
}