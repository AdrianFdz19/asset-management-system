import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['Assets', "Categories"],
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: builder => ({
        loginWithGoogle: builder.mutation({
            query: (token) => ({
                url: '/auth/google',
                method: 'POST',
                body: { token }
            })
        })
    })
});

export const {
    useLoginWithGoogleMutation,
} = apiSlice;