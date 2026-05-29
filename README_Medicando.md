# Medicando — Controle de Medicamentos (PWA)

Sistema mobile-first para cadastro de pacientes e registro de medicamentos, com funcionamento offline e exportação PDF.

## Tech Stack

| Tech | Versão |
|---|---|
| Next.js | 16.2.6 (webpack) |
| React | 19.2.4 |
| TypeScript | 5 |
| Firebase Firestore | 12.14 |
| Tailwind CSS | 4 |
| ShadCN UI (Base UI) | — |
| jsPDF + jspdf-autotable | 4.2 / 5.0 |
| Lucide React | 1.17 |

## Funcionalidades

- Cadastro de múltiplos pacientes
- Registro rápido de medicamentos (nome, dosagem, observação)
- Histórico cronológico por paciente
- Exportação PDF com acentuação
- Cache offline (Firestore persistentLocalCache)
- PWA instalável (manifest + service worker)
- Design mobile-first, max-w-sm centralizado

## Design Direction: Apothecary Modern

- **Tipografia**: Fraunces (serif display) + DM Sans (corpo)
- **Paleta**: Teal escuro `#0d5555` + Terracota `#d4826a` + Off-white `#faf8f5`
- **Animações**: Staggered fade-in, hover lift, scale no clique
- **Textura**: Noise grain sutil no fundo
- **Cards**: Moldura teal à esquerda, sombras suaves

## Estrutura do Projeto

```
Medicando/
├── AGENTE.md                 # Instruções do agente IA
├── directives/               # SOPs em Markdown
├── execution/                # Scripts determinísticos
└── controle-medicamentos/    # Aplicação Next.js
    ├── src/
    │   ├── app/              # Rotas App Router
    │   ├── components/ui/    # ShadCN
    │   ├── hooks/            # Hooks customizados
    │   ├── lib/              # Firebase + utils
    │   ├── services/         # Firestore CRUD
    │   ├── types/            # TypeScript types
    │   └── utils/            # PDF export
    ├── public/               # PWA manifest + sw
    ├── .env.local            # Firebase config
    └── next.config.ts
```

## Pré-requisitos

- Node.js 20+
- npm
- Projeto Firebase com Firestore

## Setup

```bash
cd controle-medicamentos
npm install
```

Preencha `.env.local` com as credenciais do Firebase Web App:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev --webpack` | Dev server |
| `npm run build --webpack` | Build produção |
| `npm start` | Servir produção |

## Modelagem Firestore

```
pacientes/{id}
  ├── nome: string
  ├── createdAt: timestamp
  └── registros/{id}
        ├── medicamento: string
        ├── dosagem: string
        ├── observacao: string
        └── createdAt: timestamp
```

## Deploy

```bash
npm run build --webpack
```

Fazer deploy na Vercel (ou outro host Node.js), configurando as mesmas variáveis do `.env.local`.

## Licença

MIT
