import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, fetchFeedsApi } from '../src/services/slices/feedReducer';
import { getFeedsApi } from '@api'; 

jest.mock('@api');

describe('Слайс Feed', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedReducer,
      },
    });
  });

  it('должен обрабатывать fetchFeedsApi.pending', () => {
    store.dispatch(fetchFeedsApi());
    expect(store.getState().feed.feedIsLoading).toBe(true);
  });

  it('должен обрабатывать fetchFeedsApi.fulfilled с валидными данными', async () => {
    const mockApiResponse = {
      orders: [{ id: 1, title: 'Заказ 1' }],
      total: 10,
      totalToday: 5,
    };
    (getFeedsApi as jest.Mock).mockResolvedValue(mockApiResponse);

    await store.dispatch(fetchFeedsApi());

    expect(store.getState().feed.feedIsLoading).toBe(false);
    expect(store.getState().feed.feeds).toEqual(mockApiResponse.orders);
    expect(store.getState().feed.total).toBe(mockApiResponse.total);
    expect(store.getState().feed.totalToday).toBe(mockApiResponse.totalToday);
    expect(store.getState().feed.error).toBeUndefined();
  });

  it('должен обрабатывать fetchFeedsApi.fulfilled с ошибкой в ответе', async () => {
    const mockApiResponse = {
      error: 'Что-то пошло не так',
    };
    (getFeedsApi as jest.Mock).mockResolvedValue(mockApiResponse);

    await store.dispatch(fetchFeedsApi());

    expect(store.getState().feed.feedIsLoading).toBe(false);
    expect(store.getState().feed.feeds).toEqual([]);
    expect(store.getState().feed.total).toBe(0);
    expect(store.getState().feed.totalToday).toBe(0);
    expect(store.getState().feed.error).toBe(mockApiResponse.error);
  });

  it('должен обрабатывать fetchFeedsApi.rejected с сетевой ошибкой', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(new Error('Сетевая ошибка'));

    await store.dispatch(fetchFeedsApi());

    expect(store.getState().feed.feedIsLoading).toBe(false);
    expect(store.getState().feed.error).toBe('Сетевая ошибка');
  });

  it('должен обрабатывать fetchFeedsApi.rejected с невалидным ответом API', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue({
      invalid: 'data',
    });

    await store.dispatch(fetchFeedsApi());

    expect(store.getState().feed.feedIsLoading).toBe(false);
    expect(store.getState().feed.error).toBe('Invalid API response'); // Ошибка на английском, так как в коде не переведено
  });
});