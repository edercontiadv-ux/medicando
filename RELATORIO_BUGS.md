# Relatório de Bugs e Inconsistências — Medicando

> **Data da análise:** 29/05/2026  
> **Última revisão:** 29/05/2026  
> **Versão do projeto:** 0.1.0  
> **Framework:** Next.js 16.2.6 / React 19.2.4  
> **Banco de dados:** Firebase Firestore (offline-first)

---

## Status Geral

| Categoria | Total | Corrigidos | Pendentes |
|-----------|:-----:|:----------:|:---------:|
| 🔴 Críticos | 4 | 4 | 0 |
| 🟡 Médios | 4 | 4 | 0 |
| 🔵 Leves / Inconsistências | 11 | 10 | 1 |
| **Total** | **19** | **18** | **1** |

---

## 🔴 Bugs Críticos

### ✅ C01 — Firebase Firestore: `initializeFirestore` chamado múltiplas vezes

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/lib/firebase.ts`

**Problema original:** A função `getDb()` executava `initializeFirestore` em toda chamada sem guarda, causando erro em hot-reloads.

**O que foi feito:** Instância do Firestore cacheada em variável `firestoreInstance` com singleton. Uso de `getFirestore()` para o ambiente server-side. A inicialização só ocorre uma vez.

---

### ✅ C02 — Race condition no padrão offline-first (`setDoc` sem `await`)

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/services/pacientes.ts:32,85`

**Problema original:** `setDoc` fire-and-forget causava race condition: o item não aparecia na lista após cadastro.

**O que foi feito:** `setDoc` agora tem `await`. A gravação é concluída antes do `refetch()`/`listarRegistros()`, garantindo consistência dos dados na UI.

---

### ✅ C03 — Service Worker cache-first quebra dados dinâmicos

**Status:** ✅ **Corrigido** — `controle-medicamentos/public/sw.js`

**Problema original:** Cache-first para todas as requisições, incluindo Firebase API, congelava os dados.

**O que foi feito:** Estratégias distintas:
- **Navegação:** network-first (tenta rede, fallback para cache)
- **Assets estáticos** (CSS, JS, fontes, imagens): cache-first
- **Demais requisições** (Firebase, terceiros): network-only
- Handler `activate` adicionado para limpeza de caches antigos

---

### ✅ C04 — Animação `shimmer` referenciada mas nunca definida

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/app/globals.css:44-47`

**Problema original:** Skeleton usava `@keyframes shimmer` inexistente.

**O que foi feito:** Keyframe `shimmer` adicionado ao `globals.css` com animação de gradiente deslizante.

---

## 🟡 Bugs Médios

### ✅ M01 — `manifest.json`: `theme_color` divergente do layout

**Status:** ✅ **Corrigido** — `controle-medicamentos/public/manifest.json`

**Problema original:** `theme_color` era `#0f172a` (slate) enquanto o layout usava `#0d5555` (teal).

**O que foi feito:** Ambos os valores alinhados:
- `theme_color`: `#0d5555`
- `background_color`: `#faf8f5` (coerente com o CSS)

---

### ✅ M02 — `removerPaciente` não limpa subcoleção `registros`

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/services/pacientes.ts:65-74`

**Problema original:** A exclusão de paciente deixava registros órfãos na subcoleção.

**O que foi feito:** A função agora busca todos os documentos da subcoleção `registros` e os deleta em paralelo (`Promise.all`) antes de remover o documento do paciente.

---

### ✅ M03 — Página de paciente sem Suspense boundary

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/app/layout.tsx:49-51`

**Problema original:** Uso do hook `use()` (React 19) sem `<Suspense>` no layout pai.

**O que foi feito:** Adicionado `<Suspense fallback={null}>` ao redor de `{children}` no `RootLayout`.

---

### ✅ M04 — `eslint.config.mjs`: imports de subpath

**Status:** ✅ **Válido** — `controle-medicamentos/eslint.config.mjs:2-3`

Os subpaths `core-web-vitals` e `typescript` fazem parte do sistema de flat config do `eslint-config-next` nas versões 15+. Em Next.js 16.2.6, estes imports são válidos e não requerem correção.

---

## 🔵 Inconsistências e Problemas Leves

### ✅ L01 — `@ducanh2912/next-pwa` removido do script de instalação

**Status:** ✅ **Corrigido** — `execution/install_deps.bat`

A linha `npm install @ducanh2912/next-pwa` foi removida do script de instalação. O PWA é gerenciado pelo `sw.js` manual, sem necessidade do pacote.

### ✅ L02 — `firebase-admin` removido de `dependencies`

**Status:** ✅ **Corrigido** — `controle-medicamentos/package.json`

`firebase-admin` foi removido das dependências de produção. O SDK é usado apenas pelo script de build `execution/get_firebase_config.js`, não pelo frontend.

### ✅ L03 — `@hookform/resolvers` removido (não utilizado)

**Status:** ✅ **Corrigido** — `controle-medicamentos/package.json` + `execution/install_deps.bat`

`@hookform/resolvers` foi removido das dependências e do script de instalação. `react-hook-form` e `zod` foram mantidos para implementação futura de validação de formulários.

### ✅ L04 — `tw-animate-css` removido

**Status:** ✅ **Corrigido** — `controle-medicamentos/package.json`

`tw-animate-css` foi removido das dependências. As animações são definidas manualmente em `globals.css` via `@keyframes`.

### ✅ L05 — `--webpack` vs `--turbopack` — scripts alinhados

**Status:** ✅ **Corrigido** — `controle-medicamentos/package.json`

As flags `--webpack` foram removidas dos scripts `dev` e `build`. O Next.js agora usa o motor padrão (Turbopack em dev, Rust compiler em build), consistente com o scaffold inicial.

### ✅ L06 — `formatDate` importada mas não usada em `pacientes.ts`

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/services/pacientes.ts`

O import de `formatDate` foi removido do arquivo `pacientes.ts`.

### ✅ L07 — `inputMode="numeric"` no campo de dosagem

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/app/pacientes/[id]/page.tsx:189`

`inputMode` alterado de `"numeric"` para `"text"`, permitindo que o usuário digite valores como `"500mg"`, `"1 comprimido"` sem restrição de teclado numérico.

### L08 — `background_color` do manifest alinhado ao CSS

**Status:** ✅ **Corrigido** (incluído na correção M01)

`background_color` alterado de `#ffffff` para `#faf8f5`, coincidindo com o fundo definido em `globals.css`.

### ✅ L09 — Padrão de tratamento de erros uniformizado nos services

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/services/pacientes.ts`

`removerPaciente` agora possui `try/catch` com `console.error`, consistente com as demais funções:

| Função | Comportamento em erro |
|--------|----------------------|
| `criarPaciente` | `await setDoc(...).catch()` com log |
| `listarPacientes` | `try/catch` → log + retorna `[]` |
| `getPaciente` | `try/catch` → log + retorna `null` |
| `removerPaciente` | `try/catch` → log (silencia) |
| `criarRegistro` | `await setDoc(...).catch()` com log |
| `listarRegistros` | `try/catch` → log + retorna `[]` |

Nenhuma função propaga exceções não tratadas para o frontend.

### ✅ L10 — Botão de submit sem estado de carregamento

**Status:** ✅ **Corrigido** — `controle-medicamentos/src/app/page.tsx` e `pacientes/[id]/page.tsx`

Adicionado estado `submitting` em ambas as páginas. O botão é **desabilitado** e exibe **"Salvando..."** durante a operação, prevenindo cliques duplicados.

### L11 — `components.json` com estilo `base-nova` não oficial

**Status:** ⏳ **Não corrigido**

- `"style": "base-nova"` é específico do ecossistema `@base-ui/react` / ShadCN Base
- Monitorar compatibilidade em atualizações futuras do ShadCN

---

## ✅ Implementado nesta sessão

| # | Item | Prioridade | Status |
|---|------|:----------:|:------:|
| 1 | Singleton para instância do Firestore | 🔴 Crítica | ✅ |
| 2 | `setDoc` com `await` (consistência de dados) | 🔴 Crítica | ✅ |
| 3 | Service Worker com network-first para navegação | 🔴 Crítica | ✅ |
| 4 | `@keyframes shimmer` no `globals.css` | 🔴 Crítica | ✅ |
| 5 | `theme_color` e `background_color` do manifest alinhados | 🟡 Média | ✅ |
| 6 | Deleção em cascata da subcoleção `registros` | 🟡 Média | ✅ |
| 7 | `<Suspense>` no layout para rotas com `use()` | 🟡 Média | ✅ |
| 8 | Imports do eslint-config-next *(válidos na v16)* | 🟡 Média | ✅ |
| 9 | Remover `firebase-admin` e `tw-animate-css` | 🔵 Leve | ✅ |
| 10 | Loading state nos botões de submit | 🔵 Leve | ✅ |
| 11 | Remover `@ducanh2912/next-pwa` do install_deps.bat | 🔵 Leve | ✅ |
| 12 | Remover `@hookform/resolvers` (não usado) | 🔵 Leve | ✅ |
| 13 | Alinhar scripts `dev`/`build` (remover `--webpack`) | 🔵 Leve | ✅ |
| 14 | Uniformizar tratamento de erros nos services | 🔵 Leve | ✅ |

## 📋 Pendência Única

| # | Item | Motivo |
|---|------|--------|
| L11 | `components.json` com `style: base-nova` | Estilo específico do ecossistema `@base-ui/react`. Não é um bug, mas requer monitoramento em updates futuros do ShadCN. |

---

## 📁 Arquivos Revisados / Modificados

| Arquivo | Linhas | Ação |
|---------|:------:|:----:|
| `execution/install_deps.bat` | 15 | ✏️ Pacotes não utilizados removidos |
| `controle-medicamentos/package.json` | 36 | ✏️ `--webpack` removido + deps não usadas |
| `controle-medicamentos/next.config.ts` | 7 | 🔍 Revisado |
| `controle-medicamentos/tsconfig.json` | 34 | 🔍 Revisado |
| `controle-medicamentos/eslint.config.mjs` | 18 | 🔍 Revisado |
| `controle-medicamentos/components.json` | 25 | 🔍 Revisado |
| `controle-medicamentos/src/app/layout.tsx` | 55 | ✏️ `<Suspense>` adicionado |
| `controle-medicamentos/src/app/globals.css` | 86 | ✏️ `@keyframes shimmer` adicionado |
| `controle-medicamentos/src/app/page.tsx` | 128 | ✏️ Loading state no submit |
| `controle-medicamentos/src/app/pacientes/[id]/page.tsx` | 205 | ✏️ Loading state + `inputMode="text"` |
| `controle-medicamentos/src/lib/firebase.ts` | 33 | ✏️ Singleton Firestore + `getFirestore()` server |
| `controle-medicamentos/src/lib/utils.ts` | 6 | 🔍 Revisado |
| `controle-medicamentos/src/services/pacientes.ts` | 108 | ✏️ `await setDoc`, cascade delete, try/catch, import |
| `controle-medicamentos/src/types/index.ts` | 33 | 🔍 Revisado |
| `controle-medicamentos/src/hooks/usePacientes.ts` | 26 | 🔍 Revisado |
| `controle-medicamentos/src/utils/exportPdf.ts` | 26 | 🔍 Revisado |
| `controle-medicamentos/src/components/ServiceWorkerRegister.tsx` | 13 | 🔍 Revisado |
| `controle-medicamentos/src/components/ui/*.tsx` | — | 🔍 Revisado |
| `controle-medicamentos/public/sw.js` | 64 | ✏️ Estratégias de cache diferenciadas |
| `controle-medicamentos/public/manifest.json` | 21 | ✏️ Cores alinhadas ao tema |
