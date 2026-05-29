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

- Cadastro de pacientes
- Registro rápido de medicamentos com dosagem e observação
- Histórico cronológico
- Exportação PDF
- PWA instalável com suporte offline
- Design mobile-first (max-w-sm)

## Como rodar

```bash
npm install
npm run dev --webpack
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Copie `.env.local` e preencha com as credenciais do Firebase Web App.

## Build

```bash
npm run build --webpack
npm start
```

> Nota: `--webpack` é necessário nesta plataforma pois o Turbopack não tem suporte a binários nativos.
