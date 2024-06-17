import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Типизация состояния заказа по номеру
type TOrderByNumberSliceState = {
  orders: TOrder[];
  orderIsLoading: boolean;
  error: string | undefined;
};

// Начальное состояние
const initialState: TOrderByNumberSliceState = {
  orders: [],
  orderIsLoading: false,
  error: undefined
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder[],
  number,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'getOrderByNumber/fetchOrderByNumber',
  async (number, { getState, rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (response.orders) {
        return response.orders;
      } else {
        throw new Error('Заказ не найден');
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Произошла ошибка при получении заказа'
      );
    }
  }
);

// Создание слайса для заказов по номеру
const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderIsLoading = true;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderIsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderIsLoading = false;
        state.orders = action.payload;
      });
  }
});

// Селекторы
export const selectOrdersIsLoading = createSelector(
  (state: RootState) => state.orderByNumber,
  (orderByNumber) => orderByNumber.orderIsLoading
);

export const selectOrders = createSelector(
  (state: RootState) => state.orderByNumber,
  (orderByNumber) => orderByNumber.orders
);

export const orderByNumberReducer = orderByNumberSlice.reducer;
