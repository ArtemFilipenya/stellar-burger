import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder, TOrderResponse } from '@utils-types';
import { RootState } from '../store';

interface AsyncThunkConfig {
  rejectValue: string;
}

type TOrderSliceState = {
  order: TOrder | null;
  orderIsLoading: boolean;
  error: string | undefined;
};

const initialState: TOrderSliceState = {
  order: null,
  orderIsLoading: false,
  error: undefined
};

export const fetchOrderBurgerApi = createAsyncThunk<
  TOrder,
  string[],
  AsyncThunkConfig
>('order/postOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    if (response && response.order) {
      return response.order;
    } else {
      return rejectWithValue('Invalid server response');
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'An unknown error occurred');
  }
});
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.orderIsLoading = false;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderBurgerApi.pending, (state) => {
        state.orderIsLoading = true;
      })
      .addCase(fetchOrderBurgerApi.rejected, (state, action) => {
        state.orderIsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderBurgerApi.fulfilled, (state, action) => {
        state.orderIsLoading = false;
        state.order = action.payload;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderIsLoading = (state: RootState) =>
  state.order.orderIsLoading;
