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
  backdropFilter: "blur(20px)",
  background: "linear-gradient(145deg, #1e293b, #0f172a)",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
  padding: 3,
  color: "#fff"
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

  // ✅ CREATE STOCK
  const handleCreate = async () => {
    const product = products.find(
      (p) => String(p.id) === String(productId)
    );

    if (!product) return;

    if (outQty > product.totalQuantity) {
      alert("Limited stock!");
      return;
    }

    await dispatch(addStock({
      date,
      productId,
      outQuantity: outQty
    }));

    dispatch(fetchStock());
    dispatch(fetchProducts());

    setDate("");
    setProductId("");
    setOutQty("");
  };

  // ✅ TABLE COLUMNS (🔥 UPDATED LEFT COLUMN)
  const columns = [
    { field: "entryDate", header: "Date" },

    {
      header: "Product",
      render: (row) => row.product?.name
    },

    { field: "outQuantity", header: "Out" },

    // 🔥 PREMIUM LOW STOCK UI
    {
      header: "Left",
      render: (row) => {
        const isLow = row.leftInStock < 10;

        return (
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#fff",
              background: isLow
                ? "linear-gradient(135deg, #ef4444, #b91c1c)"
                : "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: isLow
                ? "0 4px 15px rgba(239,68,68,0.6)"
                : "0 4px 15px rgba(34,197,94,0.6)"
            }}
          >
            {row.leftInStock}
          </Box>
        );
      }
    },

    {
      header: "Edit",
      render: (row) => (
        <Button
          size="small"
          variant="contained"
          sx={{ background: "#3b82f6" }}
          onClick={() => {
            const newQty = prompt("New Quantity", row.outQuantity);
            if (!newQty) return;

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
          size="small"
          variant="contained"
          color="error"
          onClick={() => dispatch(deleteStock(row.id))}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      {/* HEADER */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
          color: "#1e293b"
        }}
      >
        📊 Kalyan Enterprises Stock Panel
      </Typography>

      {/* 3D CARD */}
      <Box
        sx={{
          transform: "perspective(1200px) rotateX(4deg)",
          transition: "0.4s",
          "&:hover": {
            transform: "perspective(1200px) rotateX(0deg) scale(1.02)"
          }
        }}
      >
        <Paper sx={premiumCard}>

          <Grid container spacing={2}>

            {/* DATE */}
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </Grid>

            {/* DROPDOWN */}
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={productId || ""}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: "#9ca3af" }}>
                        Select Product
                      </span>
                    );
                  }

                  const product = products.find(
                    (p) => String(p.id) === String(selected)
                  );

                  return product ? product.name : "";
                }}
                onChange={(e) => setProductId(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Select Product</em>
                </MenuItem>

                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* OUT QTY */}
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

            {/* BUTTON */}
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  height: "100%",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  boxShadow: "0 10px 30px rgba(34,197,94,0.5)"
                }}
                onClick={handleCreate}
              >
                Create Entry
              </Button>
            </Grid>

            {/* EXPORT */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "#fff" }}
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

      {/* TABLE */}
      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <DataTable columns={columns} rows={stock} />
      </Box>

    </Container>
  );
}