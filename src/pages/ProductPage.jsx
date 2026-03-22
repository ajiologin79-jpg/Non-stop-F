import {
  Container,
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Grid
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
          fullWidth
          onClick={() => {
            const newQty = prompt("New Quantity", row.totalQuantity);
            if (newQty) {
              dispatch(updateProduct({
                id: row.id,
                data: { ...row, totalQuantity: newQty }
              }));
            }
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
          fullWidth
          onClick={() => dispatch(deleteProduct(row.id))}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>

      <Typography variant="h5" gutterBottom>
        Product Management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Grid container spacing={2}>

          <Grid item xs={12} md={4}>
            <TextField
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: "100%" }}
              onClick={handleAdd}
            >
              Add Product
            </Button>
          </Grid>

        </Grid>
      </Paper>

      <Box sx={{ overflowX: "auto" }}>
        <DataTable columns={columns} rows={products} />
      </Box>

    </Container>
  );
}