@echo off
REM Scaffold Next.js project with TypeScript, Tailwind, App Router, src/
echo Scaffolding Next.js project...
npx create-next-app@latest controle-medicamentos --typescript --tailwind --eslint --src-dir --app --turbopack --import-alias "@/*" --use-npm
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to scaffold Next.js project
    exit /b %ERRORLEVEL%
)
echo OK: Next.js project scaffolded
