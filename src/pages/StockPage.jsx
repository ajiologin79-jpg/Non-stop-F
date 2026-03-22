import {
    Container,
    TextField,
    Button,
    Select,
    MenuItem,
    Paper,
    Box,
    Typography
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    fetchProducts
} from "../redux/productSlice";

import {
    fetchStock,
    addStock,
    deleteStock
} from "../redux/stockSlice";

import DataTable from "../components/DataTable";
import { updateStock } from "../redux/stockSlice";

export default function StockPage() {

    const dispatch = useDispatch();
    const products = useSelector((s) => s.products);
    const stock = useSelector((s) => s.stock);

    const [date, setDate] = useState("");
    const [productId, setProductId] = useState("");
    const [outQty, setOutQty] = useState("");

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchStock());
    }, [dispatch]);

    const handleCreate = () => {
        const product = products.find(p => p.id == productId);

        if (!product) return;

        if (outQty > product.totalQuantity) {
            alert("Limited stock! Cannot add this quantity.");
            return;
        }

        dispatch(addStock({ date, productId, outQuantity: outQty }));
    };

    const columns = [
        { field: "entryDate", header: "Date" },

        {
            header: "Product",
            render: (row) => row.product?.name
        },

        { field: "outQuantity", header: "Out" },
        { field: "leftInStock", header: "Left" },

        // ✅ EDIT BUTTON
        {
            header: "Edit",
            render: (row) => (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                        const newQty = prompt("Enter new Out Quantity", row.outQuantity);

                        if (!newQty) return;

                        if (newQty > row.product.totalQuantity) {
                            alert("Limited stock! Cannot update.");
                            return;
                        }

                        dispatch(updateStock({
                            id: row.id,
                            data: {
                                productId: row.product.id,
                                outQuantity: newQty,
                                date: row.entryDate
                            }
                        }));
                    }}
                >
                    Edit
                </Button>
            )
        },

        // DELETE
        {
            header: "Delete",
            render: (row) => (
                <Button
                    color="error"
                    size="small"
                    onClick={() => dispatch(deleteStock(row.id))}
                >
                    Delete
                </Button>
            )
        }
    ];

    return (
        <Container sx={{ mt: 4 }}>

            <Typography variant="h5" gutterBottom>
                Stock Entry
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>

                    <TextField
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <Select
                        value={productId}
                        displayEmpty
                        onChange={(e) => setProductId(e.target.value)}
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="">Select Product</MenuItem>
                        {products.map(p => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        label="Out Quantity"
                        type="number"
                        value={outQty}
                        onChange={(e) => setOutQty(e.target.value)}
                    />

                    <Button variant="contained" onClick={handleCreate}>
                        Create
                    </Button>

                    {/* ✅ RIGHT ALIGNED EXPORT */}
                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="outlined"
                        onClick={() =>
                            window.open("http://localhost:8080/stock/export")
                        }
                    >
                        Export Excel
                    </Button>

                </Box>

            </Paper>

            <DataTable columns={columns} rows={stock} />

        </Container>
    );
}