import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    const res = await api.get("/products");
    return res.data;
});

export const addProduct = createAsyncThunk("products/add", async (data) => {
    const res = await api.post("/products", data);
    return res.data;
});

export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id) => {
        await api.delete(`/products/${id}`);
        return id;
    }
);

export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, data }) => {
        const res = await api.put(`/products/${id}`, data);
        return res.data;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: [],
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (_, action) => action.payload);
        builder.addCase(addProduct.fulfilled, (state, action) => {
            state.push(action.payload);
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) =>
            state.filter(p => p.id !== action.payload)
        );

        builder.addCase(updateProduct.fulfilled, (state, action) => {
            return state.map(p => p.id === action.payload.id ? action.payload : p);
        });
    }
});

export default productSlice.reducer;