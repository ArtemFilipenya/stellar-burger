import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Функция для генерации уникального идентификатора
const generateId = () => self.crypto.randomUUID();

type TBurgerConstructorSlice = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: TBurgerConstructorSlice = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isIngredientsLoading: false,
  error: null
};

// Создание слайса для конструктора бургера
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredients: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.constructorItems.bun = payload;
        } else if (payload.type === 'main' || payload.type === 'sauce') {
          state.constructorItems.ingredients.push(payload);
        }
      },
      // Подготовка данных перед добавлением ингредиента
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: generateId() }
      })
    },
    // Перемещение ингредиента вверх
    moveIngredientUp: (state, { payload }: PayloadAction<number>) => {
      if (payload > 0) {
        // Check to ensure index is within valid range
        const ingredients = state.constructorItems.ingredients;
        [ingredients[payload - 1], ingredients[payload]] = [
          ingredients[payload],
          ingredients[payload - 1]
        ];
      }
    },
    // Перемещение ингредиента вниз
    moveIngredientDown: (state, { payload }: PayloadAction<number>) => {
      const ingredients = state.constructorItems.ingredients;
      if (payload < ingredients.length - 1) {
        // Check to ensure index is within valid range
        [ingredients[payload], ingredients[payload + 1]] = [
          ingredients[payload + 1],
          ingredients[payload]
        ];
      }
    },
    // Удаление ингредиента из конструктора
    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== payload
        );
    },

    // Очистка конструктора бургера
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
      state.isIngredientsLoading = false;
    }
  },
  // Селектор для получения данных конструктора бургера
  selectors: {
    selectConstructorBurger: (state) => state
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const {
  addIngredients,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export const { selectConstructorBurger } = burgerConstructorSlice.selectors;
