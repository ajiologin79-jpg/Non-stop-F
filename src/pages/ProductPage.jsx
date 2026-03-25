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
  backdropFilter: "blur(20px)",
  background: "linear-gradient(145deg, #1e293b, #0f172a)",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
  padding: 3,
  color: "#fff"
};

export default function ProductPage() {

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!name || !qty) return;

    await dispatch(addProduct({ name, totalQuantity: qty }));

    dispatch(fetchProducts());

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
          variant="contained"
          sx={{ background: "#3b82f6" }}
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
          variant="contained"
          color="error"
          onClick={() => dispatch(deleteProduct(row.id))}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
          color: "#1e293b"
        }}
      >
        🏪 Kalyan Enterprises Product Panel
      </Typography>

      <Box
        sx={{
          transform: "perspective(1200px) rotateX(4deg)",
          "&:hover": {
            transform: "perspective(1200px) rotateX(0deg) scale(1.02)"
          },
          transition: "0.4s"
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
                  fontWeight: "bold",
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  boxShadow: "0 10px 30px rgba(34,197,94,0.5)"
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