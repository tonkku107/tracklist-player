import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function TracklistTable({ tracklist }) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracklist.map(t => (
            <TableRow key={t.timestamp}>
              <TableCell>{t.timestamp}</TableCell>
              <TableCell>{t.artist}</TableCell>
              <TableCell>{t.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
