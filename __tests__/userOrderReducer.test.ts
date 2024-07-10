import { configureStore } from '@reduxjs/toolkit';
import { 
  userOrdersReducer, 
  fetchUserOrdersApi, 
  selectUserOrders, 
  selectUserOrdersIsLoading,
  FeedSliceState 
} from '../src/services/slices/usersOrderReducer';
import { getOrdersApi } from '@api'; 
import { RootState } from '../src/services/store'; 
import { burgerConstructorReducer } from '../src/services/slices/constructorReducer';
import { ingredientsReducer } from '../src/services/slices/ingredientReducer'; 
import { orderReducer } from '../src/services/slices/orderReducer'; 
import { feedReducer } from '../src/services/slices/feedReducer'; 
import { orderByNumberReducer } from '../src/services/slices/orderInfoReducer'; 
import { userReducer } from '../src/services/slices/userReducer';

// Mocking the API call
jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
}));

describe('userOrdersSlice', () => {
  let store: ReturnType<typeof configureStore<
    RootState, 
    any,
    any
  >>; 

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: userReducer,
        burgerConstructor: burgerConstructorReducer,
        ingredients: ingredientsReducer,
        order: orderReducer,
        feed: feedReducer,
        userOrders: userOrdersReducer,
        orderByNumber: orderByNumberReducer
      },
    });
  });

  test('initial state is correct', () => {
    const state = store.getState().userOrders;
    expect(state.userOrders).toEqual([]);
    expect(state.userOrdersIsLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('fetchUserOrdersApi pending', async () => {
    (getOrdersApi as jest.Mock).mockReturnValue(new Promise(() => {})); 
    store.dispatch(fetchUserOrdersApi());
    const state = store.getState().userOrders;
    expect(state.userOrdersIsLoading).toBe(true);
  });

  test('fetchUserOrdersApi fulfilled', async () => {
    const mockOrders = [{ id: 1, title: 'Order 1' }];
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders); 
    await store.dispatch(fetchUserOrdersApi());
    const state = store.getState().userOrders;
    expect(state.userOrdersIsLoading).toBe(false);
    expect(state.userOrders).toEqual(mockOrders); 
  });

  test('fetchUserOrdersApi rejected', async () => {
    const errorMessage = 'Error fetching orders';
    (getOrdersApi as jest.Mock).mockRejectedValue(new Error(errorMessage));
    await store.dispatch(fetchUserOrdersApi());
    const state = store.getState().userOrders;
    expect(state.userOrdersIsLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectUserOrders', () => {
    const selectedOrders = selectUserOrders(store.getState());
    expect(selectedOrders).toEqual(store.getState().userOrders.userOrders);
  });

  test('selectUserOrdersIsLoading', () => {
    const isLoading = selectUserOrdersIsLoading(store.getState().userOrders);
    expect(isLoading).toBe(store.getState().userOrders.userOrdersIsLoading);
  });
});