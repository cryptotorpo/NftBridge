import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit';
//@ts-ignore
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import walletReducer from './walletSlice';

const persistConfig = {
  key: 'root',
  storage,
  //whitelist: ['addresses'], // Specify which slices to persist
};

export interface RootState {
  wallet: ReturnType<typeof walletReducer>;
}

const rootReducer = combineReducers({
    wallet: walletReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
