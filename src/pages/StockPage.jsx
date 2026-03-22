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
import {
  fetchProducts
} from "../redux/productSlice";

import {
  fetchStock,
  addStock,
  deleteStock,
  updateStock
} from "../redux/stockSlice";

import DataTable from "../components/DataTable";

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
          fullWidth
          onClick={() => {
            const newQty = prompt("New Out Quantity", row.outQuantity);

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
          fullWidth
          onClick={() => dispatch(deleteStock(row.id))}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>

      <Typography variant="h5" gutterBottom>
        Stock Entry
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>

        <Grid container spacing={2}>

          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              fullWidth
              displayEmpty
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
              value={outQty}
              onChange={(e) => setOutQty(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreate}
            >
              Create
            </Button>
          </Grid>

          {/* Export Button */}
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

      <Box sx={{ overflowX: "auto" }}>
        <DataTable columns={columns} rows={stock} />
      </Box>

    </Container>
  );
}