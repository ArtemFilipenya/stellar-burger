import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

// Определение типа пропсов для защищенного маршрута
type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

// Компонент защищенного маршрута
export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): ReactElement => {
  // Получаем статус аутентификации из хранилища
  const isAuthChecked = useSelector((state) => state.auth.isAuthenticated);
  const loginRequested = useSelector((state) => state.auth.loginUserRequest);
  const user = useSelector((state) => state.auth.data.name);
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  // Если аутентификация еще не завершена и происходит запрос на вход, показываем прелоадер
  if (!isAuthChecked && loginRequested) {
    return <Preloader />;
  }

  // Если маршрут доступен только для неаутентифицированных пользователей и пользователь аутентифицирован,
  // перенаправляем его на предыдущую страницу, либо на главную страницу
  if (onlyUnAuth && user) {
    return <Navigate replace to={from} state={location} />;
  }

  // Если маршрут доступен только для аутентифицированных пользователей и пользователь не аутентифицирован,
  // перенаправляем его на страницу входа, передавая предыдущую страницу в стейте
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Возвращаем дочерние компоненты, если ни одно из условий не сработало
  return children;
};
