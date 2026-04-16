# 🏫 CIT-Sync | Interactive Institutional Platform / Plataforma Institucional Interactiva

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-teal?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=for-the-badge&logo=firebase)
![Lucide](https://img.shields.io/badge/Lucide_React-Icons-pink?style=for-the-badge&logo=lucide)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=githubpages)](https://marcuspicazo.github.io/cit-sync/)

(Spanish version below)

---

## 🇺🇸 English

**CIT-Sync** is a real-time resource management and educational software development platform, developed exclusively to transform the technological infrastructure at the Berta Von Glümer School (EBVG).

This application was built following **Clean Architecture** principles by **Marco Antonio Escalona García**, Systems Engineer & AI Product Engineer.

### 🔗 Live Link & Access
Access the live application here: [https://marcuspicazo.github.io/cit-sync/](https://marcuspicazo.github.io/cit-sync/)

> **⚠️ Demo Access:** Use password `1234` for all users. Please sign in with password only (do not use Google Sign-In). This is a public demo version for portfolio viewing.

> **👨‍💻 Developer Note:** All interactive web apps, the digital whiteboard, and other tools integrated into this platform were developed entirely by me (Marco Antonio Escalona García) as part of my role creating academic solutions for the institution's classes.

### Architecture and Development
The project was designed from the ground up as a professional, scalable modular structure using **Vite**:
* **Separation of Concerns (SoC):** The user interface (UI), business logic, and backend services are strictly separated.
* **Custom Hooks:** All complex Firebase logic (Authentication, real-time database listeners) and application state management were extracted into reusable hooks (`useAuth`, `useFirestoreCollection`, `useI18n`).
* **Modular Components:** The UI was broken down into clean presentational components organized by domain (`dashboard`, `map`, `reservations`, `admin`, `factory`, `catalog`).
* **State Optimization:** Implementation of Context API for global notification and translation (`i18n`) management, paired with Tailwind CSS for high-performance utility-first styling.

### Tech Stack
* **Frontend:** React.js, Tailwind CSS, Lucide React (Icons).
* **Backend as a Service (BaaS):** Firebase (Google Workspace Auth, Anonymous Auth, Real-time Firestore Database).
* **Build Tool:** Vite.

### Local Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your Firebase environment variables in a `.env` file (e.g., `VITE_FIREBASE_API_KEY`).
4. Run `npm run dev` to start the local development server.

---

## 🇪🇸 Español

**CIT-Sync** es una plataforma de gestión de recursos y desarrollo de software educativo en tiempo real, desarrollada exclusivamente para transformar la infraestructura tecnológica de la Escuela Berta Von Glümer (EBVG).

Esta aplicación fue construida bajo principios de **Clean Architecture** por **Marco Antonio Escalona García**, Systems Engineer & AI Product Engineer.

### 🔗 Enlace a la plataforma y Acceso
Puedes probar la aplicación en vivo aquí: [https://marcuspicazo.github.io/cit-sync/](https://marcuspicazo.github.io/cit-sync/)

> **⚠️ Acceso a la Demo:** Usa la contraseña `1234` para todos los usuarios. Por favor, inicia sesión solo con contraseña (no utilices el inicio de sesión de Google). Esta es una versión demo pública para visualización de portafolio.

> **👨‍💻 Nota del Desarrollador:** Todas las aplicaciones web interactivas, la pizarra digital y otras herramientas integradas en esta plataforma fueron desarrolladas íntegramente por mí (Marco Antonio Escalona García) como parte de mi rol creando soluciones académicas para las clases de la institución.

### Arquitectura y Desarrollo
El proyecto fue diseñado desde cero como una estructura modular profesional orientada a la escalabilidad, utilizando **Vite**:
* **Separación de Responsabilidades (SoC):** La interfaz de usuario (UI), la lógica de negocio y los servicios de backend están estrictamente separados.
* **Custom Hooks:** Toda la lógica compleja de Firebase (Autenticación, listeners de base de datos en tiempo real) y el estado de la aplicación se extrajeron en hooks reutilizables (`useAuth`, `useFirestoreCollection`, `useI18n`).
* **Componentes Modulares:** La UI fue dividida en componentes presentacionales limpios organizados por dominio (`dashboard`, `map`, `reservations`, `admin`, `factory`, `catalog`).
* **Optimización de Estado:** Implementación de Context API para el manejo global de notificaciones y traducciones (`i18n`), junto con Tailwind CSS para un estilizado utility-first de alto rendimiento.

### Tecnologías
* **Frontend:** React.js, Tailwind CSS, Lucide React (Íconos).
* **Backend as a Service (BaaS):** Firebase (Autenticación de Google Workspace, Auth Anónimo, Firestore Database en tiempo real).
* **Build Tool:** Vite.

### Instalación Local
1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Configura tus variables de entorno de Firebase en un archivo `.env` (ej. `VITE_FIREBASE_API_KEY`).
4. Ejecuta `npm run dev` para levantar el servidor local.

---
Desarrollado para la educación / Developed for education
