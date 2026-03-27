CIT-Sync | Interactive Institutional Platform / Plataforma Institucional Interactiva

(Spanish version below)

English

CIT-Sync is a real-time resource management and educational software development platform, developed exclusively to transform the technological infrastructure at the Berta Von Glumer School (EBVG).

This application was built following Clean Architecture principles by Marcus Escalona, Front-End Engineer.

Architecture and Development

The project was designed from the ground up as a professional, scalable modular structure using Vite:

- Separation of Concerns (SoC): The user interface (UI), business logic, and backend services are strictly separated.
- Custom Hooks: All complex Firebase logic (Authentication, real-time database listeners) and application state management were extracted into reusable hooks (useAuth, useFirestoreCollection, useI18n).
- Modular Components: The UI was broken down into clean presentational components organized by domain (dashboard, map, reservations, admin, factory, catalog).
- State Optimization: Implementation of Context API for global notification and translation (i18n) management, paired with Tailwind CSS for high-performance utility-first styling.

Tech Stack

- Frontend: React.js, Tailwind CSS, Lucide React (Icons).
- Backend as a Service (BaaS): Firebase (Google Workspace Auth, Anonymous Auth, Real-time Firestore Database).
- Build Tool: Vite.

Local Installation

1. Clone the repository.
2. Run npm install to install dependencies.
3. Set up your Firebase environment variables in a .env file (e.g., VITE_FIREBASE_API_KEY).
4. Run npm run dev to start the local development server.

---

Español

CIT-Sync es una plataforma de gestión de recursos y desarrollo de software educativo en tiempo real, desarrollada exclusivamente para transformar la infraestructura tecnológica de la Escuela Berta Von Glümer (EBVG).

Esta aplicación fue construida bajo principios de Clean Architecture por Marcus Escalona, Front-End Engineer.

Arquitectura y Desarrollo

El proyecto fue diseñado desde cero como una estructura modular profesional orientada a la escalabilidad, utilizando Vite:

- Separación de Responsabilidades (SoC): La interfaz de usuario (UI), la lógica de negocio y los servicios de backend están estrictamente separados.
- Custom Hooks: Toda la lógica compleja de Firebase (Autenticación, listeners de base de datos en tiempo real) y el estado de la aplicación se extrajeron en hooks reutilizables (useAuth, useFirestoreCollection, useI18n).
- Componentes Modulares: La UI fue dividida en componentes presentacionales limpios organizados por dominio (dashboard, map, reservations, admin, factory, catalog).
- Optimización de Estado: Implementación de Context API para el manejo global de notificaciones y traducciones (i18n), junto con Tailwind CSS para un estilizado utility-first de alto rendimiento.

Tecnologías

- Frontend: React.js, Tailwind CSS, Lucide React (Íconos).
- Backend as a Service (BaaS): Firebase (Autenticación de Google Workspace, Auth Anónimo, Firestore Database en tiempo real).
- Build Tool: Vite.

Instalación Local

1. Clona el repositorio.
2. Ejecuta npm install para instalar las dependencias.
3. Configura tus variables de entorno de Firebase en un archivo .env (ej. VITE_FIREBASE_API_KEY).
4. Ejecuta npm run dev para levantar el servidor local.

Desarrollado para la educación / Developed for education