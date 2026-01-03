import { createAsyncThunk, createEntityAdapter, createSlice, type EntityState } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

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
const assetsAdapter = createEntityAdapter<Asset>();

// 2. Tu interfaz debe extender EntityState para incluir 'ids' y 'entities' automáticamente
interface AssetsState extends EntityState<Asset, number> {
    status: 'idle' | 'loading' | 'fulfilled' | 'error';
    error: string | null;
};

const initialState: AssetsState = assetsAdapter.getInitialState({
    status: 'idle',
    error: null,
});

// Acción asíncrona para traer activos
export const fetchAssets = createAsyncThunk<Asset[], void, { rejectValue: string }>(
    'assets/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/assets`);
            console.log(response.data.data);
            return response.data.data; 
        } catch (error: any) {
            // Si el error viene de Axios, tiene un objeto response
            const message = error.response?.data?.message || 'Error al conectar con el servidor';
            
            // Usamos rejectWithValue para que el mensaje llegue al "rejected" del slice
            return rejectWithValue(message);
        }
    }
);

const assetsSlice = createSlice({
    name: 'assets', 
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAssets.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAssets.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                assetsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchAssets.rejected, (state, action) => {
                state.status = 'error';
                state.error = (action.payload as string) || action.error.message || 'Error desconocido';
            })
    }
});

export const {
    selectAll: selectAllAssets,
    selectIds: selectAssetsIds,
    selectById: selectAssetById,
} = assetsAdapter.getSelectors((state: RootState) => state.assets);

export const assetsStatus = (state: RootState) => state.assets.status;
export const assetsError = (state: RootState) => state.assets.error;

export default assetsSlice.reducer;