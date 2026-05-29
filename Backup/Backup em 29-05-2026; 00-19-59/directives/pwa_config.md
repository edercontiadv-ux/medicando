# Configuração PWA

## Objetivo
Configurar Progressive Web App para instalação em smartphones.

## Inputs
- Projeto Next.js configurado
- `@ducanh2912/next-pwa` instalado

## Tools/Scripts
- `execution/setup_pwa.py` — Gera next.config.ts e manifest.json

## Outputs
- `next.config.ts` — Com withPWA configurado
- `public/manifest.json` — Manifest para PWA
- Ícones em `public/icon-192.png` e `public/icon-512.png`

## Configuração
- orientation: portrait (travado em modo retrato)
- display: standalone
- theme_color: #0f172a

## Edge Cases
- next-pwa original está descontinuado → usar @ducanh2912/next-pwa
- Ícones precisam existir em public/ → criar placeholders se necessário
