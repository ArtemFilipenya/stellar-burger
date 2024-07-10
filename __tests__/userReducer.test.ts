import { AnyAction } from '@reduxjs/toolkit';
import * as cookieUtils from '../src/utils/cookie';
import {
  fetchGetUser,
  fetchLoginUser,
  fetchLogout,
  fetchRegisterUser,
  fetchUpdateUser,
  userReducer
} from '../src/services/slices/userReducer';
import { TUser } from '../src/utils/types';

// Моковые данные пользователя
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

// Создаем мок для cookieUtils перед каждым тестом
jest.mock('../src/utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

describe('userSlice', () => {
  beforeEach(() => {
    // Очистка всех моков перед каждым тестом
    jest.clearAllMocks();
  });

  it('должен обрабатывать fetchRegisterUser.pending', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const action = { type: fetchRegisterUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен обрабатывать fetchRegisterUser.rejected', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const error = new Error('Регистрация не удалась');
    const action = {
      type: fetchRegisterUser.rejected.type,
      error: error
    } as AnyAction;
    const state = userReducer(initialState, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(error.message);
  });

  it('должен обрабатывать fetchRegisterUser.fulfilled', async () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
  
    const mockResponse = {
      success: true,
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
      user: mockUser
    };
  
    const action = {
      type: fetchRegisterUser.fulfilled.type,
      payload: mockResponse
    } as AnyAction;
  
    const state = userReducer(initialState, action);
    expect(state.isAuthenticated).toBe(true);
    expect(state.data).toEqual(mockResponse.user);
  });

  // Тесты для fetchLoginUser
  it('должен обрабатывать fetchLoginUser.pending', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const action = { type: fetchLoginUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен обрабатывать fetchLoginUser.rejected', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const error = new Error('Вход в систему не удался');
    const action = {
      type: fetchLoginUser.rejected.type,
      error: error
    } as AnyAction;
    const state = userReducer(initialState, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(error.message);
  });

  it('должен обрабатывать fetchLoginUser.fulfilled', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
  
    const mockResponse = {
      success: true,
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
      user: mockUser
    };
  
    const action = {
      type: fetchLoginUser.fulfilled.type,
      payload: mockResponse
    } as AnyAction;
  
    const state = userReducer(initialState, action);
    expect(state.isAuthenticated).toBe(true);
    expect(state.data).toEqual(mockUser);
  });

  // Тесты для fetchGetUser
  it('должен обрабатывать fetchGetUser.pending', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const action = { type: fetchGetUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
  });

  it('должен обрабатывать fetchGetUser.rejected', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const error = new Error('Получение данных пользователя не удалось');
    const action = {
      type: fetchGetUser.rejected.type,
      error: error
    } as AnyAction;
    const state = userReducer(initialState, action);
    expect(state.error).toBe(error.message);
    expect(state.loginUserRequest).toBe(false);
  });

  it('должен обрабатывать fetchGetUser.fulfilled', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: true
    };
    const mockResponse = {
      success: true,
      user: mockUser
    };
    const action = {
      type: fetchGetUser.fulfilled.type,
      payload: mockResponse
    } as AnyAction;
    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockResponse.user);
    expect(state.loginUserRequest).toBe(false);
  });

  // Тесты для fetchUpdateUser
  it('должен обрабатывать fetchUpdateUser.pending', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const action = { type: fetchUpdateUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
});

  it('должен обрабатывать fetchUpdateUser.rejected', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: true
    };
    const error = new Error('Обновление данных пользователя не удалось');
    const action = {
      type: fetchUpdateUser.rejected.type,
      error: error
    } as AnyAction;
    const state = userReducer(initialState, action);
    expect(state.error).toBe(error.message);
    expect(state.loginUserRequest).toBe(true);
  });

  it('должен обрабатывать fetchUpdateUser.fulfilled', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: true
    };
    const mockResponse = {
      success: true,
      user: mockUser
    };
    const action = {
      type: fetchUpdateUser.fulfilled.type,
      payload: mockResponse
    } as AnyAction;
    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockResponse.user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loginUserRequest).toBe(false);
  });

  // Тесты для fetchLogout
  it('должен обрабатывать fetchLogout.pending', () => {
    const initialState = {
      isAuthenticated: false,
      data: { name: '', email: '' },
      error: undefined,
      loginUserRequest: false
    };
    const action = { type: fetchLogout.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
  });

  it('должен обрабатывать fetchLogout.fulfilled', () => {
  const initialState = {
    isAuthenticated: true,
    data: mockUser,
    error: undefined,
    loginUserRequest: true
  };

  const action = { type: fetchLogout.fulfilled.type } as AnyAction;
  const state = userReducer(initialState, action);

  expect(state.isAuthenticated).toBe(false);
  expect(state.data).toEqual({ name: '', email: '' });
});
});