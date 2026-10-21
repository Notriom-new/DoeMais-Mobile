# 📱 Manual Completo: Como Publicar o DoeMais Mobile na Google Play Store

Este manual reúne o passo a passo técnico e operacional para gerar o pacote de produção Android (`.aab`) do **DoeMais Mobile** usando **Expo Application Services (EAS)** e realizar a publicação oficial no **Google Play Console**.

---

## 📑 Sumário
1. [Pré-requisitos e Contas](#1-pré-requisitos-e-contas)
2. [Configuração do Aplicativo (`app.json` e `eas.json`)](#2-configuração-do-aplicativo)
3. [Instalação e Configuração do EAS CLI](#3-instalação-e-configuração-do-eas-cli)
4. [Geração do Pacote de Produção (`.aab`)](#4-geração-do-pacote-de-produção-aab)
5. [Criação do App no Google Play Console](#5-criação-do-app-no-google-play-console)
6. [Preenchimento das Declarações Obrigatórias](#6-preenchimento-das-declarações-obrigatórias)
7. [Ativos Gráficos (Screenshots e Banners)](#7-ativos-gráficos-screenshots-e-banners)
8. [Testes Internos e Publicação Oficial](#8-testes-internos-e-publicação-oficial)

---

## 1. Pré-requisitos e Contas

1. **Conta de Desenvolvedor no Google Play Console:**
   - Acesse [play.google.com/console](https://play.google.com/console).
   - Requer pagamento de taxa única de registro de **US$ 25**.
   - Conclua a verificação de identidade exigida pelo Google.

2. **Conta na Expo (Gratuita):**
   - Crie uma conta em [expo.dev](https://expo.dev) para compilar os pacotes na nuvem sem precisar do Android Studio instalado localmente.

---

## 2. Configuração do Aplicativo

Para o Android aceitar a publicação, o aplicativo precisa de um **identificador de pacote exclusivo (`package`)** e controle de versão no `app.json`.

Abra o arquivo `app.json` e adicione a seção `android`:

```json
{
  "expo": {
    "name": "DoeMais Mobile",
    "slug": "doemais-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#F8FAFC"
    },
    "android": {
      "package": "br.org.doemais.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "backgroundColor": "#10B981"
      },
      "permissions": [
        "CAMERA"
      ]
    }
  }
}
```

> ⚠️ **Atenção:** 
> - O `package` deve ser único no mundo (ex: `br.org.doemais.mobile` ou `com.notriom.doemais`).
> - A cada nova atualização enviada à Play Store, incremente o `versionCode` (1, 2, 3...) e atualize o `version` ("1.0.1", "1.1.0").

---

## 3. Instalação e Configuração do EAS CLI

O **EAS (Expo Application Services)** é a ferramenta oficial recomendada pela equipe do Expo para compilar e assinar binários nativos.

### Passo 1: Instale o EAS CLI globalmente
Abra o terminal e execute:
```bash
npm install -g eas-cli
```

### Passo 2: Faça login na sua conta Expo
```bash
eas login
```

### Passo 3: Inicialize a configuração de Build
Na pasta raiz do projeto (`stitch_doemais_donation_inventory_mobile`), execute:
```bash
eas build:configure
```
*Selecione a plataforma **Android** (ou All).*  
Isso criará automaticamente o arquivo `eas.json` com os perfis de compilação.

Exemplo de `eas.json` gerado:
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 4. Geração do Pacote de Produção (`.aab`)

A Google Play Store exige o formato **Android App Bundle (`.aab`)** para novas publicações (e não mais o `.apk` comum).

### Execute a compilação:
```bash
eas build --platform android --profile production
```

### O que o EAS fará:
1. **Keystore (Chave Criptográfica):** Quando perguntado:
   `Generate a new Android Keystore?` -> Escolha **Yes**.  
   *A Expo guardará com segurança a chave de assinatura na sua conta.*
2. **Compilação na Nuvem:** O código será enviado para os servidores da Expo e compilado.
3. **Download:** Ao término (leva de 5 a 10 minutos), o terminal fornecerá um link direto para baixar o arquivo `doemais-mobile.aab`.

---

## 5. Criação do App no Google Play Console

1. No painel do [Google Play Console](https://play.google.com/console), clique em **Criar app**.
2. Preencha os detalhes básicos:
   - **Nome do app:** `DoeMais Mobile - Gestão de Doações`
   - **Idioma padrão:** Português (Brasil) - pt-BR
   - **App ou jogo:** App
   - **Gratuito ou pago:** Gratuito
3. Aceite os termos de conformidade e clique em **Criar app**.

---

## 6. Preenchimento das Declarações Obrigatórias

Na barra lateral, navegue até **Conteúdo do app** e complete os itens obrigatórios:

1. **Acesso a apps:**
   - Selecione *"Todas as funcionalidades ou algumas estão restritas"*.
   - Adicione instruções de login para a equipe de revisão do Google:
     - **E-mail:** `coordenador@esperancaviva.org`
     - **Senha:** `doemais2026`
2. **Anúncios:** Selecione *"Não, meu app não contém anúncios"*.
3. **Classificação de conteúdo:** Responda ao questionário do IARC (classificação livre / aplicativo de utilidade social).
4. **Público-alvo:** Selecione maiores de 18 anos (voluntários e operadores de ONGs).
5. **Segurança dos dados (Data Safety):**
   - Declare que o app coleta e-mail e nome para autenticação e gestão do estoque social.
   - Declare que os dados são trafegados via conexão criptografada (HTTPS).
6. **Política de Privacidade:**
   - É obrigatório fornecer uma URL pública contendo os termos de privacidade do app (pode ser uma página no GitHub Pages ou Notion).

---

## 7. Ativos Gráficos (Screenshots e Banners)

Na aba **Presença na loja** -> **Ficha principal da loja**:

1. **Textos de Divulgação:**
   - **Descrição curta (até 80 caracteres):**  
     `Gestão ágil e transparente de estoque e doações para ONGs e projetos sociais.`
   - **Descrição completa (até 4000 caracteres):**  
     Apresente o DoeMais Mobile, destacando controle de validade FIFO, registro de entradas, baixas e auditoria comunitária.
2. **Ícone do App:**
   - Imagem PNG 32 bits, resolução de **512 x 512 px** (máx. 1 MB).
3. **Gráfico de Recursos (Banner Promocional):**
   - Imagem JPG ou PNG, resolução de **1024 x 500 px** (máx. 15 MB).
4. **Capturas de Tela (Screenshots):**
   - Mínimo de 2 capturas de tela para celulares (recomendado: 4 a 6 telas).
   - Você pode usar as capturas já geradas na pasta local do projeto:
     - `doemais_login/screen.png` (Tela de Login)
     - `doemais_estoque_e_invent_rio/screen.png` (Dashboard e Estoque)
     - `doemais_registrar_entrada/screen.png` (Entrada de Doações)
     - `doemais_registrar_sa_da/screen.png` (Saídas e Distribuição)

---

## 8. Testes Internos e Publicação Oficial

Recomenda-se iniciar pela **Trilha de Teste Interno** antes de ir para Produção.

1. No menu lateral, acesse **Teste** -> **Teste interno**.
2. Clique em **Criar nova versão**.
3. Faça upload do arquivo `.aab` que você baixou do EAS.
4. Adicione as notas da versão (ex.: `Versão inicial do MVP DoeMais Mobile - Gestão de Estoque Social`).
5. Clique em **Salvar** e depois em **Revisar versão**.
6. Cadastre a lista de e-mails dos testadores (sua equipe do Projeto Integrador UNIVALI e professores avaliadores).
7. Copie o link do teste interno e abra no celular Android para instalar e testar o app real!

### Indo para Produção:
Após validar a versão de teste interno, clique em **Promover versão** para **Produção**, envie para a revisão do Google. Em geral, a aprovação ocorre entre 24h e 72h úteis.

---

## 💡 Dica Bônus: Envio Automático com `eas submit`
Depois de configurada a chave de API do Google Cloud, você pode enviar futuras atualizações com um único comando direto do terminal:

```bash
eas submit --platform android
```
Isso faz o upload automático do `.aab` para a sua ficha no Google Play Console sem necessidade de download e upload manual!
