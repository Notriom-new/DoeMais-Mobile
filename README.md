# DoeMais Mobile — Sistema de Gestão de Estoque Social
**Projeto Integrador 8 — UNIVALI (Itajaí/SC)**  
*Metodologia TDD (Test-Driven Development) com React Native, Expo, TypeScript, Jest e React Native Testing Library.*

---

## 📋 Sobre o Projeto

O **DoeMais Mobile** é uma aplicação voltada para a gestão ágil, transparente e humanizada do estoque de doações em ONGs comunitárias e pontos de triagem de Itajaí e região. O sistema foi desenvolvido a partir dos protótipos de alta fidelidade do design system *DoeMais*, implementando regras de negócio rigorosas através do ciclo TDD (Red -> Green -> Refactor).

---

## 🛠️ Stack Tecnológica

- **Framework Mobile:** React Native com Expo (TypeScript)
- **Framework de Testes:** Jest + React Native Testing Library (`@testing-library/react-native`)
- **Gerenciamento de Estado:** Context API (`InventoryContext`) + Hooks Nativos
- **Design System & Estilização:** StyleSheet nativo seguindo os tokens de `DESIGN.md` (Paleta Emerald `#10B981` e Slate `#0F172A`)
- **Ícones:** Expo Vector Icons (`MaterialCommunityIcons`)

---

## 🧪 Metodologia TDD & Regras de Negócio

Cada módulo e regra foi desenvolvido estritamente seguindo o ciclo:
1. **RED:** Escrita do teste unitário (`*.test.ts` / `*.test.tsx`) descrevendo o comportamento esperado e validação da falha.
2. **GREEN:** Implementação do código necessário para o teste passar.
3. **REFACTOR:** Aprimoramento da tipagem TypeScript e limpeza de código.

### 1. Gestão de Estoque (`src/domain/inventory.ts`)
- **`calculateBalance(currentStock, quantity, type: 'ENTRY' | 'EXIT')`:**
  - ✅ Incrementa saldo em caso de `ENTRY`.
  - ✅ Decrementa saldo em caso de `EXIT`.
  - ✅ Impede saldo negativo: Lança exceção caso a quantidade de `EXIT` exceda o saldo atual disponível.
  - ✅ Valida que a quantidade movimentada seja estritamente maior que zero.
- **`checkExpirationAlert(expirationDate, referenceDate)`:**
  - ✅ Sinaliza alerta crítico caso o item esteja vencido ou vá vencer nos próximos 7 dias.
  - ✅ Retorna status `NORMAL` para itens com mais de 7 dias de validade ou não perecíveis.

### 2. Autenticação (`src/domain/auth.ts` & `src/screens/LoginScreen.tsx`)
- ✅ Validação de campos obrigatórios (E-mail e Senha).
- ✅ Validação de formato de e-mail e tamanho mínimo de senha.
- ✅ Autenticação unitária com credenciais válidas e mensagem de erro em dados inválidos.
- ✅ Suporte a biometria simulada e seleção de unidade social.

### 3. Cadastro de Item e Entradas (`src/screens/AddDonationScreen.tsx`)
- ✅ Cadastro de doações com Nome, Categoria (Alimentos, Higiene, Vestuário, Medicamentos), Quantidade (Stepper touch) e Data de Validade (Controle FIFO).
- ✅ Validação de campo obrigatório e opção para itens não perecíveis.

### 4. Saídas / Distribuição (`src/screens/ExitDonationScreen.tsx`)
- ✅ Seleção de item com prévia de saldo disponível em depósito.
- ✅ Controle numérico touch com presets rápidos (1 un, 5 un, 10 un, Tudo).
- ✅ Bloqueio de baixa acima do estoque disponível com feedback em tempo real.
- ✅ Seleção do motivo da saída (Família direta, Cesta emergencial, Repasse institucional, Descarte).

### 5. Inventário Central (`src/screens/InventoryScreen.tsx`)
- ✅ Bento Grid de métricas em tempo real: Total de unidades, Itens críticos e Itens vencendo em 7 dias.
- ✅ Filtros horizontais por categoria e busca em tempo real por texto/código de barras.
- ✅ Badges semânticos de triagem: "Normal", "Estoque Baixo" e "Vencendo".

---

## 📁 Estrutura de Pastas

```text
src/
├── components/          # Componentes visuais reutilizáveis
│   ├── Badge.tsx        # Pílulas de status (Normal, Baixo, Vencendo, Ao vivo)
│   ├── BottomNavigation.tsx # Abas de navegação persistentes
│   ├── Button.tsx       # Botão padrão (altura 52px, raio 12px, Emerald #10B981)
│   ├── Card.tsx         # Cartão com elevação e bordas Slate 200
│   ├── Header.tsx       # Barra superior com logo DoeMais
│   └── Input.tsx        # Campo de entrada com rótulo, ícones e validação
├── context/
│   └── InventoryContext.tsx # Estado central de doações e autenticação
├── domain/              # Regras de negócio puras (sem dependências visuais)
│   ├── auth.ts          # Regras e validações de autenticação
│   ├── auth.test.ts     # Testes TDD de autenticação
│   ├── inventory.ts     # Funções calculateBalance e checkExpirationAlert
│   └── inventory.test.ts # Testes TDD de regras de estoque
├── screens/             # Telas do aplicativo
│   ├── __tests__/       # Suíte de testes dos componentes de tela
│   │   ├── AddDonationScreen.test.tsx
│   │   ├── ExitDonationScreen.test.tsx
│   │   ├── InventoryScreen.test.tsx
│   │   └── LoginScreen.test.tsx
│   ├── AddDonationScreen.tsx
│   ├── ExitDonationScreen.tsx
│   ├── InventoryScreen.tsx
│   ├── LoginScreen.tsx
│   └── ProfileScreen.tsx
├── theme/               # Tokens de design baseados no DESIGN.md
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
├── types/               # Tipagens e interfaces TypeScript
│   ├── auth.ts
│   └── inventory.ts
├── App.tsx              # Componente raiz integrado
└── index.js             # Ponto de entrada do Expo
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn

### 1. Instalação das Dependências
```bash
npm install
```

### 2. Executar a Suíte de Testes (TDD)
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura de código
npm run test:coverage
```

### 3. Iniciar o Aplicativo no Expo
```bash
npm start
# ou
npx expo start
```
- Pressione `w` no terminal para abrir no navegador web.
- Pressione `a` para rodar no emulador Android ou leia o QR Code com o aplicativo Expo Go no celular.

---

## 👤 Credenciais de Acesso de Demonstração (MVP)

- **E-mail:** `coordenador@esperancaviva.org` (ou `voluntario@doemais.org`)
- **Senha:** `doemais2026`
