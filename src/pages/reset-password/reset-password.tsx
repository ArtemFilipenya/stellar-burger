import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePasswordReset = (event: FormEvent) => {
    event.preventDefault();
    if (error) setError('');

    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err: Error) => setError(err.message));
  };

  useEffect(() => {
    const token = localStorage.getItem('resetPassword');
    if (!token) {
      navigate('/forgot-password', { replace: true });
    } else {
      setToken(token);
    }
  }, []);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handlePasswordReset}
    />
  );
};
