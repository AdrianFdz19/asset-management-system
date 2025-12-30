import {configureStore} from '@reduxjs/toolkit'
import assetsReducer from '../features/assets/assetsSlice';

export const store = configureStore({
    reducer: {
        assets: assetsReducer,
    }
});

// Tipos cruciales para usar Redux con TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

