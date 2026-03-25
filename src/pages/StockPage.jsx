import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Paper,
  Box,
  Typography,
  Grid
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchProducts } from "../redux/productSlice";
import {
  fetchStock,
  addStock,
  deleteStock,
  updateStock
} from "../redux/stockSlice";

import DataTable from "../components/DataTable";

const premiumCard = {
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  padding: 3
};

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
    const product = products.find(p => p.id === productId);

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

    {
      header: "Edit",
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            const newQty = prompt("New Quantity", row.outQuantity);

            if (!newQty) return;

            if (newQty > row.product.totalQuantity) {
              alert("Limited stock!");
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      <Typography variant="h5" gutterBottom>
        📊 Stock Entry
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

            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              >
                <MenuItem value="">Select Product</MenuItem>
                {products.map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Out Quantity"
                type="number"
                fullWidth
                value={outQty}
                onChange={(e) => setOutQty(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  height: "100%",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)"
                }}
                onClick={handleCreate}
              >
                Create Entry
              </Button>
            </Grid>

            {/* EXPORT BUTTON */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    window.open("https://non-stop-b-production.up.railway.app/stock/export")
                  }
                >
                  Export Excel
                </Button>
              </Box>
            </Grid>

          </Grid>

        </Paper>
      </Box>

      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <DataTable columns={columns} rows={stock} />
      </Box>

    </Container>
  );
}