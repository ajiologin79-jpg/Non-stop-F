import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer
} from "@mui/material";

export default function DataTable({ columns, rows }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}
    >
      <Table>

        <TableHead sx={{ background: "#f1f5f9" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field} sx={{ fontWeight: "bold" }}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:hover": { background: "#f9fafb" } }}
            >
              {columns.map((col) => (
                <TableCell key={col.field}>
                  {col.render ? col.render(row) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}