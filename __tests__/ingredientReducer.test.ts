import { configureStore, EnhancedStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { ingredientsReducer, fetchIngredients } from '../src/services/slices/ingredientReducer';
import { ingredients } from '../src/mock';
import { getIngredientsApi } from '@api';

// Define RootState if not already defined
type RootState = ReturnType<typeof ingredientsReducer>;

// Create a type for the AppDispatch
type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  let store: EnhancedStore<{ ingredients: RootState }, AnyAction, []>;

  beforeEach(() => {
    // Возвращаем данные напрямую, без структуры { data: ... }
    (getIngredientsApi as jest.Mock).mockResolvedValue(ingredients);
    store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    });
  });

  it('should load ingredients', async () => {
    await store.dispatch(fetchIngredients() as any);

    const state = store.getState();
    // Проверяем, что ingredients в состоянии совпадают с ожидаемыми данными
    expect(state.ingredients.ingredients).toEqual(ingredients);
    expect(state.ingredients.isIngredientsLoading).toBe(false);
    expect(state.ingredients.error).toBeUndefined();
  });

  it('should handle loading state during the fetching of ingredients', async () => {
    const promise = store.dispatch(fetchIngredients() as any);
    expect(store.getState().ingredients.isIngredientsLoading).toBe(true);
    await promise;
    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);
  });

  it('should handle error when fetching ingredients fails', async () => {
    const error = new Error('error');
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(error);

    await store.dispatch(fetchIngredients() as any);

    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);
    expect(store.getState().ingredients.error).toBe(error.message);
  });

  it('should select ingredients correctly after fetch', async () => {
    await store.dispatch(fetchIngredients() as any);

    const selectedIngredients = store.getState().ingredients.ingredients;
    // Проверяем, что выбранные ингредиенты совпадают с ожидаемыми данными
    expect(selectedIngredients).toEqual(ingredients);
  });

  it('should select the loading state correctly', async () => {
    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);

    const promise = store.dispatch(fetchIngredients() as any);
    expect(store.getState().ingredients.isIngredientsLoading).toBe(true);

    await promise;
    expect(store.getState().ingredients.isIngredientsLoading).toBe(false);
  });
});