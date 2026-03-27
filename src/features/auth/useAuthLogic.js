import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useI18n } from '../../contexts/I18nContext';

export function useAuthLogic(onLoginSuccess) {
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [authError, setAuthError] = useState('');
  const { t } = useI18n();

  const handleGuestLogin = () => {
    if (accessCode === '1234') {
      setCodeError('');
      onLoginSuccess('alumno');
    } else {
      setCodeError(t('login_err_code'));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: 'ebvg.edu.mx' });
      const res = await signInWithPopup(auth, provider);
      
      if (res.user && res.user.email && res.user.email.endsWith('@ebvg.edu.mx')) {
        onLoginSuccess('alumno');
      } else {
        await signOut(auth);
        setAuthError(t('login_err_google_domain'));
      }
    } catch (error) {
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-supported-in-this-environment') {
        setAuthError(t('login_err_google_block'));
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(t('login_err_auth') + error.message);
      }
    }
  };

  return {
    accessCode,
    setAccessCode,
    codeError,
    authError,
    handleGuestLogin,
    handleGoogleLogin
  };
}