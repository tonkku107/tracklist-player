import { CircularProgress, Stack } from '@mui/material';

export default function Loading() {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ minWidth: '100%', minHeight: '100%' }}>
      <CircularProgress />
    </Stack>
  );
}
