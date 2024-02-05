import { Stack, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const routeError = useRouteError();
  console.error(routeError);

  const error = isRouteErrorResponse(routeError) ? routeError.error : routeError;
  const data = typeof routeError.data == 'object' ? JSON.stringify(routeError.data) : routeError.data?.toString();

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={3} sx={{ height: '100%', p: 2 }}>
      <Typography variant="h4">Something went wrong!</Typography>
      <Typography variant="h6">
        {routeError.status} {routeError.statusText}
      </Typography>
      <Typography variant="body">{data ?? error?.message}</Typography>
      <code>{error?.stack}</code>
    </Stack>
  );
}
