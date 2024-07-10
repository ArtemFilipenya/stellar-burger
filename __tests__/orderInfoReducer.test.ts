import {
    orderByNumberReducer,
    TOrderByNumberSliceState,
    fetchOrderByNumber
  } from '../src/services/slices/orderInfoReducer';
  
  const initialState: TOrderByNumberSliceState = {
    orders: [],
    orderIsLoading: false,
    error: undefined
  };
  describe('order info reducer', () => {
    it('должен обрабатывать начальное состояние', () => {
      expect(orderByNumberReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  
    it('должен обрабатывать fetchOrderByNumber.pending', () => {
      expect(
        orderByNumberReducer(initialState, fetchOrderByNumber.pending('', 1))
      ).toEqual({
        ...initialState,
        orderIsLoading: true
      });
    });
  
    it('должен обрабатывать fetchOrderByNumber.fulfilled', () => {
      const order = {
        _id: 'testOrderIdNew',
        status: 'new',
        name: 'test order',
        createdAt: '2024-04-27T07:59:55.703Z',
        updatedAt: '2024-04-27T07:59:56.203Z',
        number: 1,
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ]
      };
      expect(
        orderByNumberReducer(
          { ...initialState, orderIsLoading: true },
          fetchOrderByNumber.fulfilled([order], '', 1)
        )
      ).toEqual({
        ...initialState,
        orderIsLoading: false,
        orders: [order]
      });
    });
  
    it('должен обрабатывать fetchOrderByNumber.rejected', () => {
        const error = new Error('error');
        expect(
          orderByNumberReducer(
            { ...initialState, orderIsLoading: true },
            fetchOrderByNumber.rejected(error, '', 1) 
          )
        ).toEqual({
          ...initialState,
          orderIsLoading: false,
          error: undefined 
        });
      });
    });