import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearErrorMessage,
  fetchLoginUser,
  selectError
} from '../../services/slices/userReducer';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearErrorMessage());
    return () => {
      dispatch(clearErrorMessage());
    };
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(fetchLoginUser({ email, password }))
      .unwrap()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
