import {
  burgerConstructorReducer,
  addIngredients,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearConstructor,
} from '../src/services/slices/constructorReducer';
import { ingredients } from '../src/mock';
import { TConstructorIngredient } from '../src/utils/types';

const testIngredient: TConstructorIngredient = {
  id: 'testId',
  _id: 'testId', 
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 50,
  image: 'testImage',
  image_mobile: 'testImageMobile',
  image_large: 'testImageLarge',
};

describe('Тесты для burgerConstructorReducer', () => {
  it('Должен вернуть начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      isIngredientsLoading: false,
      error: null
    });
  });

  it('Должен добавить ингредиент в конструктор', () => {
    // Добавляем булку
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[0]));
    expect(state.constructorItems.bun).toEqual({
      ...ingredients[0],
      id: expect.any(String)
    });

    // Добавляем основной ингредиент
    state = burgerConstructorReducer(state, addIngredients(ingredients[2]));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...ingredients[2],
      id: expect.any(String)
    });
  });

  it('Должен переместить ингредиент вверх', () => {
    // Добавляем несколько ингредиентов
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[2]));
    state = burgerConstructorReducer(state, addIngredients(ingredients[3]));
    state = burgerConstructorReducer(state, addIngredients(testIngredient));
  
    // Сохраняем id ингредиентов после добавления
    const ingredient1Id = state.constructorItems.ingredients[0].id;
    const ingredient2Id = state.constructorItems.ingredients[1].id;
    const ingredient3Id = state.constructorItems.ingredients[2].id;
  
    // Перемещаем ингредиент с индексом 2 вверх
    state = burgerConstructorReducer(state, moveIngredientUp(2));
  
    // Correct expected order after moving ingredient at index 2 up
    expect(state.constructorItems.ingredients.map(item => item.id)).toEqual([
      ingredient1Id, 
      ingredient3Id, // Moved from index 2 to index 1
      ingredient2Id, 
    ]);
  });

  it('Должен переместить ингредиент вниз', () => {
    // Добавляем несколько ингредиентов
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[2]));
    state = burgerConstructorReducer(state, addIngredients(ingredients[3]));
    state = burgerConstructorReducer(state, addIngredients(testIngredient));

    // Сохраняем id ингредиентов после добавления
    const ingredient1Id = state.constructorItems.ingredients[0].id;
    const ingredient2Id = state.constructorItems.ingredients[1].id;
    const ingredient3Id = state.constructorItems.ingredients[2].id;

    // Перемещаем ингредиент с индексом 1 вниз
    state = burgerConstructorReducer(state, moveIngredientDown(1));

    // Проверяем порядок ингредиентов, используя сохраненные id
    expect(state.constructorItems.ingredients.map(item => item.id)).toEqual([
      ingredient1Id,
      ingredient3Id,
      ingredient2Id,
    ]);
  });

  it('Должен удалить ингредиент', () => {
    // Добавляем ингредиент
    let state = burgerConstructorReducer(undefined, addIngredients(testIngredient));

    // Сохраняем id добавленного ингредиента
    const addedIngredientId = state.constructorItems.ingredients[0].id;

    // Удаляем ингредиент, используя сохраненный id
    state = burgerConstructorReducer(state, removeIngredient(addedIngredientId));

    // Проверяем, что ингредиент удален
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('Должен очистить конструктор', () => {
    // Добавляем ингредиенты
    let state = burgerConstructorReducer(undefined, addIngredients(ingredients[0]));
    state = burgerConstructorReducer(state, addIngredients(ingredients[2]));

    // Очищаем конструктор
    state = burgerConstructorReducer(state, clearConstructor());

    // Проверяем, что конструктор очищен
    expect(state.constructorItems.bun).toEqual(null);
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });
});