# Space Predictive Analytics

### Global Solution 2026.1 — Cross-Platform Application Development | FIAP

![Banner do Projeto](./assets/screenshots/banner.png)

## Descrição

O **Space Predictive Analytics** é um aplicativo mobile desenvolvido em React Native com Expo para simular o monitoramento inteligente de uma missão espacial. A solução apresenta dashboards com dados simulados de sensores, energia, comunicação e estabilidade orbital, além de alertas automáticos baseados em limites críticos. Como diferencial, o app também possui modo claro/escuro, persistência local com AsyncStorage e integração com a NASA Open API para exibir dados astronômicos reais.

## Equipe

| Nome                   | RM       |
| -------------          | -------- |
| Amom Ianaguivara Brito | RM565718 |
| Fernanto Antônio       | RM562549 |
| Victor Chen            | RM565363 |

## Telas do Aplicativo

### Login

![Login](./assets/screenshots/login.png)

Tela inicial de autenticação do usuário, permitindo o acesso ao aplicativo por meio de e-mail e senha cadastrados.

### Cadastro

![Cadastro](./assets/screenshots/cadastro.png)

Formulário de cadastro com nome, turma, RM, e-mail, senha e confirmação de senha, incluindo validações dos campos preenchidos.

### Home — Dashboard Principal

![Home](./assets/screenshots/home.png)

Visão geral da missão espacial simulada, exibindo nome da missão, data de início, altitude orbital, tripulação e resumo dos principais sistemas monitorados.

### Dashboard de Sensores

![Sensores](./assets/screenshots/sensores.png)

Dashboard com dados simulados de sensores ambientais, incluindo temperatura, pressão, radiação e umidade, além de análise preditiva sobre possíveis riscos.

### Dashboard de Energia

![Energia](./assets/screenshots/energia.png)

Indicadores do sistema de energia da missão, mostrando nível da bateria, geração solar, consumo, autonomia estimada e balanço energético.

### Dashboard de Comunicação

![Comunicação](./assets/screenshots/comunicacao.png)

Monitoramento do sistema de comunicação, incluindo intensidade do sinal, latência, taxa de dados e qualidade da transmissão.

### Alertas

![Alertas](./assets/screenshots/alertas.png)

Central de alertas gerados automaticamente com base nos dados simulados da missão, organizados por nível de criticidade.

### NASA Open API

![NASA](./assets/screenshots/nasa.png)

Tela integrada com a NASA Open API, exibindo a imagem astronômica do dia, título, data e descrição oficial retornada pela API.

### Configurações

![Configurações](./assets/screenshots/configuracoes.png)

Tela de configurações do aplicativo, exibindo dados do usuário, preferências da aplicação, modo claro/escuro e opção de sair da conta.

### Modo Claro

![Modo Claro](./assets/screenshots/modo-claro.png)

Exemplo da interface utilizando o tema claro, demonstrando a personalização visual do aplicativo.

## Funcionalidades

* [x] Dashboard principal com resumo da missão espacial simulada
* [x] Dashboard de sensores com dados em tempo real simulado
* [x] Dashboard de energia com nível de bateria, geração solar e consumo
* [x] Dashboard de comunicação com sinal, latência e taxa de dados
* [x] Sistema de alertas automáticos por limiar crítico
* [x] Interpretação inteligente dos dados monitorados
* [x] Análises preditivas para apoio à tomada de decisão
* [x] Login e cadastro de usuário com validação
* [x] Persistência de sessão, usuário, alertas e preferências com AsyncStorage
* [x] Navegação com Expo Router usando Tabs e rotas de autenticação
* [x] Context API para gerenciamento de estado global
* [x] Alternância entre modo claro e modo escuro
* [x] Integração com NASA Open API

## Tecnologias

* React Native
* Expo
* Expo Router
* JavaScript
* Context API
* AsyncStorage
* NASA Open API
* React Hooks: useState e useEffect

## Como Executar

### Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

- Node.js
- Git
- Expo Go no celular ou emulador Android/iOS configurado
- Editor de código, como Visual Studio Code

### Clonando o repositório

Clone o repositório com o comando:

```bash
git clone https://github.com/AmomIanag/Desafio-Space-Predictive-Analytics.git
```
Acesse a pasta do projeto:
```bash
cd Desafio-Space-Predictive-Analytics
```
### Instalando as dependências

Todas as bibliotecas utilizadas no projeto estão listadas no arquivo package.json.

Para instalar as dependências, execute:
```bash
npm install
```
Esse comando instala automaticamente as dependências necessárias para o funcionamento do aplicativo, incluindo React Native, Expo, Expo Router, AsyncStorage e demais bibliotecas utilizadas no projeto.

### Configurando a API da NASA

O aplicativo possui integração com a NASA Open API, utilizada para exibir a imagem astronômica do dia.

No arquivo:
```bash
src/app/(tabs)/nasa.js
```
localize o endpoint da API:
```bash
https://api.nasa.gov/planetary/apod?api_key=SUA_CHAVE_AQUI
```
Substitua SUA_CHAVE_AQUI pela sua chave da NASA Open API.
Também é possível utilizar a chave de teste:
```bash
DEMO_KEY
```
Porém, a DEMO_KEY possui limite baixo de requisições, então o ideal é utilizar uma chave própria da NASA para testar e apresentar o projeto.

### Iniciando o projeto

Para iniciar o aplicativo, execute:
```bash
npx expo start
```
Após iniciar o Metro Bundler, escolha uma das opções:

Pressione a no terminal para abrir no emulador Android;
Escaneie o QR Code com o Expo Go no celular;
Use o painel do Expo no navegador para escolher o dispositivo.

### Limpando cache, se necessário

Caso o aplicativo apresente erro de cache, tela travada ou carregamento infinito, execute:
```bash
npx expo start -c
```
Esse comando reinicia o Expo limpando o cache do projeto.

### Observação

A pasta node_modules não é enviada para o GitHub, pois ela é gerada automaticamente na instalação das dependências.

Para recriar a pasta node_modules em outra máquina, basta executar:
```bash
npm install
```

## Vídeo de Demonstração

[Clique aqui para assistir à demonstração](https://youtube.com/...)

## Licença

Este projeto foi desenvolvido para fins acadêmicos — FIAP 2026.
