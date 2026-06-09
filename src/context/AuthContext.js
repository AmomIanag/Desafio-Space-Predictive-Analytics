import { createContext, useContext, useEffect, useState } from 'react';
import {
  saveSession,
  loadSession,
  clearSession,
  loadUser,
} from '../storage/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quando abre o app, ele verifica se já tem uma sessão salva por meio do async (async bom demais)
  useEffect(() => {
    async function loadSavedSession() {
      try {
        const savedSession = await loadSession();

        if (savedSession) {
          setUser(savedSession);
        }
      } catch (e) {
        console.log('Failed to load session:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedSession();
  }, []);

  async function login(email, password) {   //parte de logar, que pede o seu email e senha que precisam ser cadastrados
    setIsLoading(true);
    setError(null);

    const registeredUser = await loadUser();

    if (!registeredUser) {
      setError('Nenhum usuário cadastrado. Crie uma conta primeiro.');
      setIsLoading(false);
      return { success: false };
    }

    if (
      email.trim().toLowerCase() !== registeredUser.email.trim().toLowerCase() ||
      password !== registeredUser.senha
    ) {
      setError('E-mail ou senha inválidos.');
      setIsLoading(false);
      return { success: false };
    }

    const session = {        //sessão, onde a gente coloca todos os nossos dados, e o email e a senha são usados para logar
      nome: registeredUser.nome,
      turma: registeredUser.turma,
      rm: registeredUser.rm,
      email: registeredUser.email,
      loginAt: new Date().toISOString(),
    };

    //se o login estiver certo, salva a sessão pro usuario continuar conectado
    await saveSession(session);
    setUser(session);
    setIsLoading(false);

    return { success: true };
  }

  async function logout() { //funcao para fazer logout e voltar pra tela principal, ele remove a sessão e volta completamente deslogado
    await clearSession();
    setUser(null);
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}