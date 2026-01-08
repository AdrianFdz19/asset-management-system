import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            // Opcional: Guardar en localStorage para persistencia
            localStorage.setItem('token', action.payload.token);
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: any) => state.auth.user;