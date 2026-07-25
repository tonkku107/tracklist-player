import { CircularProgress, Stack } from '@mui/material';

export default function Loading() {
  return (
    <Stack sx={{ minWidth: '100%', minHeight: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Stack>
  );
}
