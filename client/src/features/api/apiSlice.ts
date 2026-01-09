import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../auth/authSlice";

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['Assets', "Categories"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include'
    }),
    endpoints: builder => ({
        checkAuth: builder.query<{ user: User }, void>({
            query: () => '/auth/me',
        }),
        loginWithGoogle: builder.mutation({
            query: (token) => ({
                url: '/auth/google',
                method: 'POST',
                body: { token }
            })
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // Opcional: Esto limpia el caché de RTK Query automáticamente
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut()); // Tu acción de authSlice que pone user: null
                    dispatch(apiSlice.util.resetApiState()); // Limpia TODO el caché (assets, categories, etc.)
                } catch {
                    console.error('Logout failed');
                }
            }
        })
    })
});

export const {
    useLoginWithGoogleMutation,
    useCheckAuthQuery,
    useLogoutMutation,
} = apiSlice;