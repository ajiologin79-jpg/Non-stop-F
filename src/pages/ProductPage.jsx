import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper
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

const premiumCard = {
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  padding: 3
};

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
          color="error"
          size="small"
          onClick={() => dispatch(deleteProduct(row.id))}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      <Typography variant="h5" gutterBottom>
        📦 Product Management
      </Typography>

      <Box
        sx={{
          transform: "perspective(1000px) rotateX(2deg)",
          transition: "0.3s",
          "&:hover": {
            transform: "perspective(1000px) rotateX(0deg) scale(1.01)"
          }
        }}
      >
        <Paper sx={premiumCard}>

          <Grid container spacing={2}>

            <Grid item xs={12} md={4}>
              <TextField
                label="Product Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  height: "100%",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)"
                }}
                onClick={handleAdd}
              >
                Add Product
              </Button>
            </Grid>

          </Grid>

        </Paper>
      </Box>

      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <DataTable columns={columns} rows={products} />
      </Box>

    </Container>
  );
}