import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router';
import UpdateBar from '../components/UpdateBar';

export default function Layout() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Box>
        <UpdateBar />
      </Box>
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Stack>
  );
}
