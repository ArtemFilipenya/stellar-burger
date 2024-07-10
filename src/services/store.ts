import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { burgerConstructorReducer } from './slices/constructorReducer';
import { ingredientsReducer } from './slices/ingredientReducer';
import { orderReducer } from './slices/orderReducer';
import { feedReducer } from './slices/feedReducer';
import { orderByNumberReducer } from './slices/orderInfoReducer';
import { userReducer } from './slices/userReducer';
import { userOrdersReducer } from './slices/usersOrderReducer';

// Определение редьюсеров для каждого модуля
const rootReducer = combineReducers({
  auth: userReducer,
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
  orderByNumber: orderByNumberReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
