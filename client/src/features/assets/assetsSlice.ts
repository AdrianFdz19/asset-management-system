import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

interface AssetsState {
    items: Asset[];
    status: 'idle' | 'loading' | 'fulfilled' | 'error';
    error: string | null;
};

const initialState: AssetsState = {
    items: [],
    status: 'idle',
    error: null,
};

// Acción asíncrona para traer activos
export const fetchAssets = createAsyncThunk(
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
                state.items = action.payload;
            })
            .addCase(fetchAssets.rejected, (state, action) => {
                state.status = 'error';
                state.error = (action.payload as string) || action.error.message || 'Error desconocido';
            })
    }
});

export const selectAllAssets = (state: any) => state.assets.items;
export const assetsStatus = (state: any) => state.assets.status;
export const assetsError = (state: any) => state.assets.error;

export default assetsSlice.reducer;