@echo off
REM Install project dependencies for Medicando PWA
echo Installing Firebase...
npm install firebase

echo Installing PDF...
npm install jspdf jspdf-autotable

echo Installing icons...
npm install lucide-react

echo Installing forms...
npm install react-hook-form zod

echo OK: All dependencies installed
