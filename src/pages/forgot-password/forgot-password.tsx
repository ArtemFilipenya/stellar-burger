import React, { FC, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке данных');
    }
  };

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
