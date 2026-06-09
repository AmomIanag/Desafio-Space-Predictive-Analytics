// Tela responsável por consumir dados reais da nasa open API (diferencial)
import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { usePreferences } from '../../context/PreferencesContext';

export default function NasaScreen() {
  const { cores } = usePreferences();

  const [dadosNasa, setDadosNasa] = useState(null); //Estados usados pra controlar os dados da API, carregamentos e erros
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function buscarDadosNasa() { // Faz a demanda para a Nasa APOD e armazena o resultado na tab do app
    try {
      setCarregando(true);
      setErro(null);

      const resposta = await fetch( // Endpoint da NASA que retorna imagem astronômica do dia
        'https://api.nasa.gov/planetary/apod?api_key=dXG9AoR7Py672nSkQXV7uxHv3x33XdnXZxcc1w3x' // API KEY
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || 'Erro ao buscar dados da NASA.');
      }

      setDadosNasa(dados);
    } catch (e) {
      setErro('Não foi possível carregar os dados da NASA no momento.');
      console.log('Erro NASA API:', e);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarDadosNasa(); // Busca os dados da nasa automaticamente quando a tela é aberta
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: cores.textoPrincipal }]}>
          NASA OPEN API
        </Text>

        <Text style={[styles.subtitle, { color: cores.textoFraco }]}>
          Astronomy Picture of the Day — dados reais da NASA
        </Text>
      </View>

      {carregando && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: cores.card,
              borderColor: cores.borda,
            },
          ]}
        >
          <ActivityIndicator size="large" color={cores.destaque} />

          <Text style={[styles.loadingText, { color: cores.textoSecundario }]}> 
            Carregando dados reais da NASA...
          </Text>
        </View>
      )}

      {erro && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: cores.card,
              borderColor: cores.borda,
            },
          ]}
        >
          <Text style={styles.errorEmoji}>⚠️</Text>

          <Text style={[styles.errorText, { color: cores.perigo }]}>
            {erro}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: cores.botao }]}
            onPress={buscarDadosNasa}
          >
            <Text style={[styles.buttonText, { color: cores.textoBotao }]}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {dadosNasa && !carregando && !erro && (
        <>
          <View
            style={[
              styles.card,
              {
                backgroundColor: cores.card,
                borderColor: cores.borda,
              },
            ]}
          >
            <Text style={[styles.sectionLabel, { color: cores.textoFraco }]}>
              IMAGEM ASTRONÔMICA DO DIA
            </Text>

            <Text style={[styles.nasaTitle, { color: cores.destaque }]}>
              {dadosNasa.title}
            </Text>

            <Text style={[styles.dateText, { color: cores.textoFraco }]}>
              Data: {dadosNasa.date}
            </Text>

            {dadosNasa.media_type === 'image' ? (
              <Image
                source={{ uri: dadosNasa.url }}
                style={styles.nasaImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.videoBox, //caso a nasa retorne um vídeo, o app mostra um botão para abrir o conteúdo
                  {
                    backgroundColor: cores.borda,
                  },
                ]}
              >
                <Text style={[styles.videoText, { color: cores.textoPrincipal }]}>
                  🎥 O conteúdo de hoje é um vídeo.
                </Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: cores.botao }]}
                  onPress={() => Linking.openURL(dadosNasa.url)}
                >
                  <Text style={[styles.buttonText, { color: cores.textoBotao }]}>
                    Abrir vídeo da NASA
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
            <Text style={[styles.sectionLabel, { color: cores.textoFraco }]}>
              DESCRIÇÃO
            </Text>

            <Text style={[styles.explanation, { color: cores.textoSecundario }]}>
              {dadosNasa.explanation}
            </Text>
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
            <Text style={[styles.sectionLabel, { color: cores.textoFraco }]}>
              INTEGRAÇÃO COM API EXTERNA
            </Text>

            <Text style={[styles.explanation, { color: cores.textoSecundario }]}>
              Esta tela consome dados reais da NASA Open API usando fetch,
              useState e useEffect. A integração complementa os dados simulados
              da missão com informações astronômicas reais.
            </Text>
          </View>
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
    marginTop: 10,
    marginBottom: 20,
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
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },
  errorEmoji: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 10,
  },
  nasaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 14,
  },
  nasaImage: {
    width: '100%',
    height: 260,
    borderRadius: 14,
  },
  videoBox: {
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  videoText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  explanation: {
    fontSize: 13,
    lineHeight: 21,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});