# Configuração do Firebase

## Objetivo
Configurar Firebase Firestore com cache persistente para funcionamento offline.

## Inputs
- Variáveis de ambiente no `.env` (API key, project ID, etc.)
- Credenciais: `medicando-f232d-firebase-adminsdk-fbsvc-4345d3a3da.json`

## Tools/Scripts
- `execution/setup_firebase.py` — Gera arquivo lib/firebase.ts

## Outputs
- `src/lib/firebase.ts` — Instância do Firebase inicializada com cache persistente

## Configuração
- Usar `initializeFirestore` com `persistentLocalCache()`
- Ler config de `process.env.NEXT_PUBLIC_FIREBASE_*`
- Não usar Realtime Database

## Edge Cases
- Variáveis de ambiente vazias → avisar para preencher .env.local
- Cache persistente pode falhar em alguns browsers → fallback para cache padrão
