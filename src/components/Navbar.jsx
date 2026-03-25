import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)"
      }}
    >
      <Toolbar>

        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
          🏪 Kalyan Enterprises
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/">
            Products
          </Button>

          <Button color="inherit" component={Link} to="/stock">
            Stock
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}