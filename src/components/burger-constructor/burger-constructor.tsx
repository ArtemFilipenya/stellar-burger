import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorBurger,
  clearConstructor
} from '../../services/slices/constructorReducer';
import {
  fetchOrderBurgerApi,
  clearOrder,
  selectOrder,
  selectOrderIsLoading
} from '../../services/slices/orderReducer';
import { selectUser } from '../../services/slices/userReducer';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(
    selectConstructorBurger
  ).constructorItems;
  const orderIsLoading = useSelector(selectOrderIsLoading);
  const orderModalData = useSelector(selectOrder);
  const user = useSelector(selectUser).name;

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bun) {
      alert('Сначала соберите свой вкуснейший бургер!');
      return;
    }

    const order = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    dispatch(fetchOrderBurgerApi(order));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
    navigate('/', { replace: true });
  };

  const totalPrice = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderIsLoading}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
