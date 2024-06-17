import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUpdateUser, selectUser } from '../../services/slices/userReducer';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Инициализация формы текущими значениями пользователя
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  // Проверка, изменилось ли состояние формы по сравнению с данными пользователя
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    formValue.password.length > 0;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      dispatch(fetchUpdateUser(formValue));
    }
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
