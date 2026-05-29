# README — Sistema de Controle de Medicamentos (PWA)

## Visão Geral

Sistema PWA para controle de medicamentos, desenvolvido com:

- Next.js 15
- TypeScript
- Firebase Firestore
- TailwindCSS
- ShadCN UI
- jsPDF + jspdf-autotable
- @ducanh2912/next-pwa

> 📱 **Mobile-first:** o sistema é projetado exclusivamente para uso em smartphones.
> Todo layout, interações e componentes devem ser pensados para tela pequena e toque.

O sistema permite:

- Cadastro de múltiplos pacientes
- Registro rápido de medicamentos
- Histórico cronológico
- Exportação PDF (com suporte a acentuação em português)
- Funcionamento offline
- Instalação como aplicativo no celular via PWA
- Hospedagem na Vercel

---

# ETAPA 1 — CRIAÇÃO DO PROJETO

## Criar projeto Next.js

Execute:

```bash
npx create-next-app@latest controle-medicamentos
```

Responda:

```txt
TypeScript? → Yes
ESLint? → Yes
Tailwind? → Yes
src/? → Yes
App Router? → Yes
Turbopack? → Yes
```

Entrar no projeto:

```bash
cd controle-medicamentos
```

---

# ETAPA 2 — INSTALAR DEPENDÊNCIAS

## Firebase

```bash
npm install firebase
```

## PWA

> ⚠️ O pacote `next-pwa` original está descontinuado e tem conflitos com Next.js 15.
> Use `@ducanh2912/next-pwa` no lugar.

```bash
npm install @ducanh2912/next-pwa
```

## PDF

```bash
npm install jspdf jspdf-autotable
```

> ⚠️ Para suporte a acentuação em português, adicione uma fonte UTF-8 ao jsPDF.
> Veja a Etapa 11 para configuração.

## Ícones

```bash
npm install lucide-react
```

## Forms

```bash
npm install react-hook-form zod @hookform/resolvers
```

---

# ETAPA 3 — INSTALAR SHADCN UI

Executar:

```bash
npx shadcn@latest init
```

Sugestões:

```txt
Style → Default
Base color → Slate
```

Adicionar componentes:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add select
```

---

# ETAPA 4 — CONFIGURAR FIREBASE

## Criar projeto

Acesse:

https://console.firebase.google.com/

Criar:
- novo projeto
- Firestore Database
- Web App

---

## Criar arquivo

```txt
src/lib/firebase.ts
```

Conteúdo:

```ts
import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Cache persistente para funcionamento offline
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
```

> ✅ O cache persistente já está configurado aqui, eliminando a necessidade de uma etapa separada.

---

# ETAPA 5 — CRIAR .ENV.LOCAL

Criar:

```txt
.env.local
```

Conteúdo:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> ⚠️ Nunca suba o `.env.local` para o repositório. Confirme que está no `.gitignore`.

---

# ETAPA 6 — ESTRUTURA DE PASTAS

Criar estrutura:

```txt
src/
├── app/
├── components/
├── lib/
├── services/
├── types/
├── hooks/
├── utils/
```

---

# ETAPA 7 — DESIGN MOBILE-FIRST

## Princípios obrigatórios

Como o app é exclusivo para smartphones, todas as telas devem seguir:

**Layout:**
- Largura máxima de `448px` (equivale a `max-w-sm` no Tailwind) centralizada
- Nunca usar layouts de múltiplas colunas na tela principal
- Padding horizontal mínimo de `16px` em todos os lados (`px-4`)

**Botões e toque:**
- Altura mínima de `48px` em todos os botões e elementos clicáveis (`min-h-[48px]`)
- Botão de ação principal fixo na parte inferior da tela (`fixed bottom-0`)
- Evitar menus dropdown complexos — preferir bottom sheets ou telas dedicadas

**Tipografia:**
- Fonte mínima de `16px` para inputs (evita zoom automático no iOS)
- Títulos compactos, sem textos longos em linha

**Formulários:**
- Inputs com `text-base` (16px) obrigatório para evitar zoom no iOS
- Teclado numérico para campos de dosagem: `inputMode="numeric"`

**Navegação:**
- Preferir navegação por abas na parte inferior (bottom navigation)
- Evitar menus laterais (hamburger)

## Configuração do viewport

No arquivo `src/app/layout.tsx`, garantir:

```tsx
export const metadata = {
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0f172a",
};
```

> ⚠️ `maximum-scale=1` evita zoom acidental ao tocar em inputs no iOS.

## Classe base recomendada para páginas

```tsx
<main className="min-h-screen max-w-sm mx-auto px-4 pb-24">
  {/* conteúdo */}
</main>
```

---

# ETAPA 8 — MODELAGEM DO FIRESTORE

## Coleção

```txt
pacientes
```

Documento:

```json
{
  "nome": "Éder",
  "createdAt": "timestamp"
}
```

---

## Subcoleção

```txt
pacientes/{id}/registros
```

Documento:

```json
{
  "medicamento": "Dipirona",
  "dosagem": "500mg",
  "observacao": "Após almoço",
  "createdAt": "timestamp"
}
```

---

# ETAPA 9 — FUNCIONALIDADES PRINCIPAIS

## Tela Inicial

Objetivo:
- listar pacientes em cards tocáveis (tela cheia, sem sidebar)
- botão fixo no rodapé para criar novo paciente

---

## Tela do Paciente

Objetivo:
- botão de destaque no topo para registrar medicamento (ação mais frequente)
- listar histórico em scroll vertical
- filtrar datas
- exportar PDF

> 📱 O botão de registro deve ser grande e fácil de tocar com o polegar (área inferior da tela).

---

# ETAPA 10 — CONFIGURAR PWA

## Criar arquivo

```txt
next.config.ts
```

Conteúdo:

```ts
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA({
  reactStrictMode: true,
});
```

---

## Criar Manifest

Arquivo:

```txt
public/manifest.json
```

Conteúdo atualizado para smartphone:

```json
{
  "name": "Controle de Medicamentos",
  "short_name": "Medicamentos",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

> 📱 `"orientation": "portrait"` trava o app em modo retrato, adequado para uso com uma mão.

---

# ETAPA 11 — EXPORTAÇÃO PDF

Criar:

```txt
src/utils/exportPdf.ts
```

Conteúdo base com suporte a acentuação:

```ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ⚠️ Para acentuação correta em português, use a fonte Helvetica
// ou adicione uma fonte TTF com suporte UTF-8 via doc.addFont()

export function exportarPDF(
  nomePaciente: string,
  registros: { medicamento: string; dosagem: string; observacao: string; data: string }[]
) {
  const doc = new jsPDF();

  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text(`Histórico de Medicamentos — ${nomePaciente}`, 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [["Data", "Medicamento", "Dosagem", "Observação"]],
    body: registros.map((r) => [r.data, r.medicamento, r.dosagem, r.observacao]),
    styles: { font: "helvetica", fontSize: 9 },
    headStyles: { fillColor: [15, 23, 42] },
  });

  doc.save(`historico-${nomePaciente}.pdf`);
}
```

> ⚠️ Teste com nomes que contenham acentos (ã, ç, é) logo no início do desenvolvimento.
> Se aparecerem caracteres estranhos, adicione uma fonte TTF via `doc.addFont()`.

---

# ETAPA 12 — DEPLOY NA VERCEL

## Subir no GitHub

```bash
git init
git add .
git commit -m "Primeiro commit"
```

Criar repositório no GitHub e fazer push.

---

## Deploy

Acesse:

https://vercel.com/

Conectar:
- GitHub
- importar projeto
- configurar variáveis de ambiente (as mesmas do `.env.local`)

Deploy automático a cada `git push`.

---

# ETAPA 13 — MELHORIAS FUTURAS

## Recomendadas

- Autenticação de usuários (Firebase Auth)
- Tema escuro
- Dashboard
- Gráficos de uso
- Notificações e lembretes de medicação
- Atalho "repetir última dose"
- Backup automático
- Exportar Excel
- Controle de sintomas
- Controle de pressão arterial
- Controle de glicemia
- Compartilhamento familiar

---

# ETAPA 14 — ROADMAP

## MVP (fase atual)

- Cadastro de pacientes
- Registro de medicamentos
- Histórico cronológico
- Exportação PDF
- PWA + funcionamento offline

---

## Versão 2

- Dashboard
- Busca avançada
- Estatísticas
- Exportação Excel

---

## Versão 3

- Autenticação
- Notificações e lembretes automáticos
- Compartilhamento familiar

---

# OBSERVAÇÕES IMPORTANTES

## NÃO usar:

- Realtime Database
- `next-pwa` (pacote original descontinuado — use `@ducanh2912/next-pwa`)
- LocalStorage como banco principal

---

## USAR:

- Firestore com `persistentLocalCache`
- `serverTimestamp()`
- TypeScript
- App Router
- `@ducanh2912/next-pwa`

---

# COMANDOS IMPORTANTES

## Rodar local

```bash
npm run dev
```

---

## Build produção

```bash
npm run build
```

---

## Rodar produção

```bash
npm start
```
