import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="sticky" sx={{ background: "#1e293b" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Stock Manager
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