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
    image_url: string | null;
    image_public_id: string | null;
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
        updateAsset: builder.mutation({
            query: (asset) => ({
                url: `/assets/${asset.id}`, 
                method: 'PUT', 
                body: asset
            }), 
            invalidatesTags: (result, err, arg) => {
                return [
                    { type: 'Assets', id: 'List' }, 
                    { type: 'Assets', id: arg.id }
                ]
            }
        }),
        updateAssetStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/assets/${id}`,
                method: 'PATCH',
                body: { status }
            }),
            async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    assetsSlice.util.updateQueryData('getAssets', undefined, (draft) => {
                        const asset = draft.entities[id];
                        if (asset) {
                            asset.status = status;
                        }
                    })
                );
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        deleteAsset: builder.mutation({
            query: ({ id }) => ({
                url: `/assets/${id}`, 
                method: 'DELETE'
            }),
            invalidatesTags: (res, err, arg) => {
                return [
                    { type: 'Assets', id: 'List' },
                    { type: 'Assets', id: arg.id }
                ]
            }
        }),
        uploadImage: builder.mutation<{ url: string; public_id: string }, FormData>({
            query: (formData) => ({
                url: '/assets/upload',
                method: 'POST',
                body: formData,
                // RTK Query detecta automáticamente el FormData y pone el Content-Type correcto
            }),
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
    useUpdateAssetMutation,
    useDeleteAssetMutation,
    useUpdateAssetStatusMutation,
    useUploadImageMutation
} = assetsSlice;