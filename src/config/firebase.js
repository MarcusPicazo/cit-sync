import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

// ¡Tus llaves reales de Firebase!
const firebaseConfig = {
  apiKey: "AIzaSyD514881mXxuhbvJ2vAyAq9te-5mHl_VNU",
  authDomain: "cit-sync-bd9a6.firebaseapp.com",
  projectId: "cit-sync-bd9a6",
  storageBucket: "cit-sync-bd9a6.firebasestorage.app",
  messagingSenderId: "798800023741",
  appId: "1:798800023741:web:6245b3310a2dbb25a767d4",
  measurementId: "G-PB9HMBBCPX"
};

// Inicializamos la aplicación
const app = initializeApp(firebaseConfig);

// Exportamos los servicios que usa nuestra app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Mantenemos tu ruta original para que todo coincida
export const publicPath = (col) => collection(db, 'artifacts', 'cit-sync-demo-app', 'public', 'data', col);