import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1
          }}
        >
          🏪 Kalyan Enterprises
        </Typography>
      </Toolbar>
    </AppBar>
  );
}