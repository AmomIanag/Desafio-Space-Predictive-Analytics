// src/context/PreferencesContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { savePreferences, loadPreferences } from '../storage/preferencesStorage';

const PreferencesContext = createContext(null);

const DEFAULT_PREFERENCES = {
  // Limites de alerta
  temperatureThreshold: 30,
  radiationThreshold: 4.0,
  batteryThreshold: 20,
  signalThreshold: 30,

  // Configurações de notificação
  alertSoundEnabled: true,
  criticalAlertsOnly: false,

  // Configurações de exibição
  refreshInterval: 3,
  temperatureUnit: 'celsius',

  // Tema visual
  tema: 'dark',
};

const TEMAS = {
  dark: {
    nome: 'Escuro',
    fundo: '#0A0E1A',
    card: '#111827',
    cardCritico: '#2D1B1B',
    cardAviso: '#2D2A1B',
    borda: '#1E2A3A',
    textoPrincipal: '#E2E8F0',
    textoSecundario: '#718096',
    textoFraco: '#4A5568',
    destaque: '#00D4FF',
    botao: '#00D4FF',
    textoBotao: '#0A0E1A',
    perigo: '#FF4757',
  },

  light: {
    nome: 'Claro',
    fundo: '#F4F7FB',
    card: '#FFFFFF',
    cardCritico: '#FFE5E5',
    cardAviso: '#FFF8D6',
    borda: '#D9E2EC',
    textoPrincipal: '#102A43',
    textoSecundario: '#486581',
    textoFraco: '#829AB1',
    destaque: '#0077B6',
    botao: '#0077B6',
    textoBotao: '#FFFFFF',
    perigo: '#D62828',
  },
};

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadSavedPreferences() {
      try {
        const saved = await loadPreferences();

        if (saved) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...saved });
        }
      } catch (e) {
        console.log('Erro ao carregar preferências:', e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadSavedPreferences();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    savePreferences(preferences);
  }, [preferences, isLoaded]);

  function updatePreferences(newValues) {
    setPreferences((prev) => ({
      ...prev,
      ...newValues,
    }));
  }

  function resetPreferences() {
    setPreferences(DEFAULT_PREFERENCES);
  }

  function alternarTema() {
    setPreferences((prev) => ({
      ...prev,
      tema: prev.tema === 'dark' ? 'light' : 'dark',
    }));
  }

  const temaAtual = preferences.tema || 'dark';
  const cores = TEMAS[temaAtual];

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        alternarTema,
        temaAtual,
        cores,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences deve ser usado dentro de um PreferencesProvider');
  }

  return context;
}