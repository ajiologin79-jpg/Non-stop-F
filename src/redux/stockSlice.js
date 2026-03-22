import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchStock = createAsyncThunk("stock/fetch", async () => {
    const res = await api.get("/stock");
    return res.data;
});

export const addStock = createAsyncThunk("stock/add", async (data) => {
    const res = await api.post("/stock", data);
    return res.data;
});

export const deleteStock = createAsyncThunk(
    "stock/delete",
    async (id) => {
        await api.delete(`/stock/${id}`);
        return id;
    }
);

export const updateStock = createAsyncThunk(
    "stock/update",
    async ({ id, data }) => {
        const res = await api.put(`/stock/${id}`, data);
        return res.data;
    }
);

const stockSlice = createSlice({
    name: "stock",
    initialState: [],
    extraReducers: (builder) => {
        builder.addCase(fetchStock.fulfilled, (_, action) => action.payload);
        builder.addCase(addStock.fulfilled, (state, action) => {
            state.push(action.payload);
        });
        builder.addCase(deleteStock.fulfilled, (state, action) =>
            state.filter(s => s.id !== action.payload)
        );
        builder.addCase(updateStock.fulfilled, (state, action) => {
            return state.map(s => s.id === action.payload.id ? action.payload : s);
        });
    }
});

export default stockSlice.reducer;