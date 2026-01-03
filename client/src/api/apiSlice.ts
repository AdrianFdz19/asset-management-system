import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Asset } from "../features/assets/assetsSlice";

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['Assets'],
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        getAssets: builder.query({
            query: () => '/assets',
            transformResponse: (res: { data: Asset[] }) => {
                // Accedemos a res.data para ordenar
                return [...res.data].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
            },
            // Usamos el objeto con type
            providesTags: [{ type: 'Assets', id: 'LIST' }]
        }),
        addAsset: builder.mutation({
            query: (newAsset) => ({
                url: '/assets',
                method: 'POST',
                body: newAsset
            }),
            // Invalidamos exactamente ese tipo e ID
            invalidatesTags: [{ type: 'Assets', id: 'LIST' }]
        }),
    }),
});

export const {
    useGetAssetsQuery,
    useAddAssetMutation,
} = apiSlice;