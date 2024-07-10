import {
    orderReducer,
    fetchOrderBurgerApi,
    clearOrder,
    selectOrder,
    selectOrderIsLoading
  } from '../src/services/slices/orderReducer';
  import { order as mockOrder } from '../src/mock';
  
  describe('orderSlice', () => {
    const initialState = {
      order: null,
      orderIsLoading: false,
      error: undefined
    };
  
    it('should handle initial state', () => {
      expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('should handle fetchOrderBurgerApi.pending', () => {
      const action = { type: fetchOrderBurgerApi.pending.type };
      const expectedState = {
        ...initialState,
        orderIsLoading: true
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  
    it('should handle fetchOrderBurgerApi.fulfilled', () => {
      const action = {
        type: fetchOrderBurgerApi.fulfilled.type,
        payload: mockOrder
      };
      const expectedState = {
        ...initialState,
        orderIsLoading: false,
        order: mockOrder
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  
    it('should handle fetchOrderBurgerApi.rejected', () => {
      const error = 'Test Error';
      const action = {
        type: fetchOrderBurgerApi.rejected.type,
        payload: error
      };
      const expectedState = {
        ...initialState,
        orderIsLoading: false,
        error: error
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  
    it('should handle clearOrder', () => {
      const action = clearOrder();
      const expectedState = {
        ...initialState,
        order: null,
        orderIsLoading: false,
        error: undefined
      };
      expect(orderReducer(initialState, action)).toEqual(expectedState);
    });
  
    it('selectOrder should return order', () => {
        const state = { 
          // Provide a mock of the entire Redux state
          auth: {} as any, 
          burgerConstructor: {} as any, 
          ingredients: {} as any, 
          order: { 
            order: mockOrder, // The order slice
            orderIsLoading: false, // Add missing property 
            error: undefined // Add missing property
          }, 
          feed: {} as any, 
          userOrders: {} as any,
          orderByNumber: {} as any,
        };
        expect(selectOrder(state)).toEqual(mockOrder);
      });
    
      it('selectOrderIsLoading should return orderIsLoading', () => {
        const state = {
          // Mock full Redux state again
          auth: {} as any, 
          burgerConstructor: {} as any, 
          ingredients: {} as any, 
          order: { 
            order: null, // Add missing property
            orderIsLoading: true, // The order slice
            error: undefined // Add missing property
          }, 
          feed: {} as any, 
          userOrders: {} as any,
          orderByNumber: {} as any,
        };
        expect(selectOrderIsLoading(state)).toEqual(true);
      });
    });