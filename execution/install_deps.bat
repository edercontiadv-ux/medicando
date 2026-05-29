@echo off
REM Install project dependencies for Medicando PWA
echo Installing Firebase...
npm install firebase

echo Installing PWA...
npm install @ducanh2912/next-pwa

echo Installing PDF...
npm install jspdf jspdf-autotable

echo Installing icons...
npm install lucide-react

echo Installing forms...
npm install react-hook-form zod @hookform/resolvers

echo OK: All dependencies installed
