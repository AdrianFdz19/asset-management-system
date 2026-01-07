import { createEntityAdapter, createSelector, type EntityState } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

export type Asset = {
    id: number;
    name: string;
    serial_number: string;
    status: string;
    value: string;
    purchase_date: string;
    category_id: number;
    user_id: number;
    created_at: string;
};

// 1. Dile al adaptador que manejará objetos de tipo 'Asset'
const assetsAdapter = createEntityAdapter<Asset>({
    sortComparer: (a, b) => String(b.created_at).localeCompare(String(a.created_at)),
});

const initialState = assetsAdapter.getInitialState();

const assetsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAssets: builder.query<EntityState<Asset, number>, void>({ // Tipamos el retorno
            query: () => '/assets',
            transformResponse: (res: { data: Asset[] }) => {
                // Pasamos solo el array res.data al adaptador
                return assetsAdapter.setAll(initialState, res.data);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Assets', id: 'LIST' },
                        ...result.ids.map((id: number) => ({ type: 'Assets' as const, id }))
                    ];
                } else return [{ type: 'Assets', id: 'LIST' }];
            }
        }),
        addAsset: builder.mutation({
            query: (newAsset) => ({
                url: '/assets',
                method: 'POST',
                body: newAsset
            }),
            // Invalidamos exactamente ese tipo e ID
            invalidatesTags: (result, err, arg) => [
                { type: 'Assets', id: 'LIST' },
                { type: 'Assets', id: arg.id }
            ]
        }),
    }),
});

export const selectAssetsResult = assetsSlice.endpoints.getAssets.select();
export const selectAssetsData = createSelector(
    selectAssetsResult,
    assetsResult => assetsResult.data
);

export const {
    selectAll: selectAllAssets,
    selectIds: selectAssetsIds,
    selectById: selectAssetById,
} = assetsAdapter.getSelectors((state: RootState) => selectAssetsData(state) ?? initialState);

export const {
    useGetAssetsQuery,
    useAddAssetMutation,
} = assetsSlice;