# Medicando — Controle de Medicamentos

PWA mobile-first para controle de medicamentos.

## Tech Stack

- **Next.js 16** (webpack) + React 19
- **Firebase Firestore** com cache persistente offline
- **Tailwind CSS 4** + ShadCN UI (Base UI)
- **jsPDF** + jspdf-autotable para exportação
- **Fraunces** + **DM Sans** (Google Fonts)
- **Lucide React** para ícones

## Funcionalidades

- Cadastro de pacientes com navegação automática para ficha
- Registro de medicamentos com medicamento, dosagem e observação
- Data e hora automáticas em cada registro
- Histórico cronológico com data/hora
- Exportação PDF com tabela completa
- PWA instalável com suporte offline
- Design mobile-first (max-w-sm)
- Tratamento de erros com feedback visual

## Como rodar

```bash
npm install
npm run dev --webpack
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Copie `.env.local` e preencha com as credenciais do Firebase Web App:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Regras do Firestore

Para desenvolvimento, use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Modo teste. Para produção, implemente autenticação e restrinja por usuário.

## Build

```bash
npm run build --webpack
npm start
```

> Nota: `--webpack` é necessário nesta plataforma pois o Turbopack não tem suporte a binários nativos.
