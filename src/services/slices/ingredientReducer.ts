import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type IIngredientSliceState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | undefined;
};

const initialState: IIngredientSliceState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: undefined
};

// Обновлённая типизация и обработка ответа от API
export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response: TIngredient[] = await getIngredientsApi(); // Предполагаем, что API возвращает массив напрямую
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'An unknown error occurred');
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;
export const selectIngredientsByType = (type: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.filter((item) => item.type === type)
  );

export const ingredientsReducer = ingredientsSlice.reducer;
