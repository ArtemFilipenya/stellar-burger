import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearErrorMessage,
  fetchRegisterUser,
  selectError
} from '../../services/slices/userReducer';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const Register: FC = () => {
  const [name, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const data: RegisterFormData = { name, email, password };
      dispatch(fetchRegisterUser(data));
    },
    [name, email, password, dispatch]
  );

  useEffect(() => {
    dispatch(clearErrorMessage());
  }, [dispatch]);

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
