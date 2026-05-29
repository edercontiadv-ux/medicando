# Setup do Projeto Medicando (PWA)

## Objetivo
Criar e configurar o projeto Next.js PWA para controle de medicamentos.

## Inputs
- README_Medicando.md (especificação completa)
- Credenciais Firebase em `medicando-f232d-firebase-adminsdk-fbsvc-4345d3a3da.json`
- `.env` com variáveis de ambiente

## Tools/Scripts
- `execution/scaffold_nextjs.py` — Scaffold do Next.js
- `execution/install_deps.py` — Instala dependências
- `execution/setup_shadcn.py` — Configura ShadCN UI

## Outputs
- Projeto Next.js funcional em `./`
- Firebase configurado com cache persistente
- PWA configurado com service worker

## Passos
1. Scaffold Next.js com TypeScript, Tailwind, App Router, Turbopack e src/
2. Instalar Firebase, PWA, PDF, ícones, forms
3. Inicializar ShadCN e adicionar componentes
4. Configurar Firebase (src/lib/firebase.ts)
5. Criar .env.local com variáveis do Firebase
6. Criar estrutura de pastas (components/, services/, types/, hooks/, utils/)
7. Implementar layout mobile-first
8. Modelar Firestore (coleção pacientes, subcoleção registros)
9. Criar telas (listagem + paciente)
10. Configurar PWA (manifest, next.config)
11. Implementar exportação PDF
12. Verificar build

## Edge Cases
- Porta 3000 ocupada → usar --port ou -p
- ShadCN perguntar por estilo → responder Default, Base Color Slate
- Firebase projeto não existe → pedir ao usuário criar no console
