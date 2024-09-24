import React, { useState } from 'react';
import Login from './Login';
import Admin from './Admin';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebaseの認証状態を監視
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true); // ログイン成功
    } else {
      setIsLoggedIn(false); // ログアウト
    }
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {isLoggedIn ? <Admin /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default Auth;