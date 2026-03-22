import {
  Container,
  TextField,
  Button,
  Paper,
  Box,
  Typography
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct
} from "../redux/productSlice";

import DataTable from "../components/DataTable";

export default function ProductPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = () => {
    if (!name || !qty) return;
    dispatch(addProduct({ name, totalQuantity: qty }));
    setName("");
    setQty("");
  };

  const columns = [
    { field: "name", header: "Product" },
    { field: "totalQuantity", header: "Stock" },

    {
      header: "Edit",
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            const newQty = prompt("New Quantity", row.totalQuantity);
            if (newQty)
              dispatch(updateProduct({
                id: row.id,
                data: { ...row, totalQuantity: newQty }
              }));
          }}
        >
          Edit
        </Button>
      )
    },

    {
      header: "Delete",
      render: (row) => (
        <Button
          size="small"
          color="error"
          onClick={() => dispatch(deleteProduct(row.id))}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Container sx={{ mt: 4 }}>

      <Typography variant="h5" gutterBottom>
        Product Management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>

          <TextField
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Quantity"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <Button variant="contained" onClick={handleAdd}>
            Add Product
          </Button>

        </Box>
      </Paper>

      <DataTable columns={columns} rows={products} />

    </Container>
  );
}