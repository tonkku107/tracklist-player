import { useTheme } from '@emotion/react';
import { CircularProgress, IconButton } from '@mui/material';
import { forwardRef, useCallback, useState } from 'react';

const sizePx = {
  small: 18,
  medium: 24,
  large: 28,
};

export default forwardRef(function AsyncLoadingIconButton({ onClick, children, size = 'medium', ...props }, ref) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const asyncLoadingWrapper = useCallback(
    async (e, ...rest) => {
      if (loading || typeof onClick !== 'function') return;
      setLoading(true);
      try {
        e.stopPropagation();
        await onClick(e, rest);
      } finally {
        setLoading(false);
      }
    },
    [loading, onClick]
  );

  return (
    <IconButton onClick={asyncLoadingWrapper} size={size} ref={ref} {...props}>
      {loading ? <CircularProgress size={theme.typography.pxToRem(sizePx[size])} /> : children}
    </IconButton>
  );
});
