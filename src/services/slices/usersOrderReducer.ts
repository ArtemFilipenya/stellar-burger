import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface FeedSliceState {
  userOrders: TOrder[];
  userOrdersIsLoading: boolean;
  error: string | null;
}

const initialState: FeedSliceState = {
  userOrders: [],
  userOrdersIsLoading: false,
  error: null
};

export const fetchUserOrdersApi = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetchUserOrdersApi', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err: any) {
    return rejectWithValue(err.message || 'Error fetching orders');
  }
});

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrdersApi.pending, (state) => {
        state.userOrdersIsLoading = true;
      })
      .addCase(
        fetchUserOrdersApi.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.userOrdersIsLoading = false;
          state.error = action.payload || 'Unknown error';
        }
      )
      .addCase(
        fetchUserOrdersApi.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersIsLoading = false;
          state.userOrders = action.payload;
        }
      );
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;

// Selectors
export const selectUserOrdersIsLoading = (state: FeedSliceState) =>
  state.userOrdersIsLoading;
export const selectUserOrders = (state: RootState) =>
  state.userOrders.userOrders;
