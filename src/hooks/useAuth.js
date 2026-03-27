import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { auth } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof _initial_auth_token !== 'undefined' && _initial_auth_token) {
          await signInWithCustomToken(auth, _initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Token Error:", error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthenticating(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAuthenticating };
}