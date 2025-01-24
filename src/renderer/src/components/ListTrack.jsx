import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { forwardRef, useRef } from 'react';
import AsyncLoadingIconButton from './AsyncLoadingIconButton';

const ListTrack = forwardRef(function ListTrack(
  { track, exists, onDelete, onClick, onAdd, dragHandleRef, dragHandleProps, dragState, ...rest },
  ref
) {
  const buttonRef = useRef(null);

  return (
    <ListItemButton
      sx={[
        dragState?.isDragging
          ? {
              visibility: 'hidden',
            }
          : {},
        dragState?.isOverlay
          ? theme => ({
              backgroundColor: theme.palette.background.default,
              '&.Mui-selected': { backgroundColor: theme.palette.background.default },
              '&:hover': { backgroundColor: theme.palette.background.default },
              '&.Mui-selected:hover': { backgroundColor: theme.palette.background.default },
            })
          : {},
      ]}
      ref={ref}
      onClick={() => (onClick ? onClick() : buttonRef.current?.click())}
      {...rest}
    >
      <ListItem
        secondaryAction={
          onDelete ? (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : onAdd ? (
            <AsyncLoadingIconButton ref={buttonRef} edge="end" aria-label="add" onClick={!exists ? onAdd : undefined}>
              {exists ? <DoneIcon color="success" /> : <AddIcon />}
            </AsyncLoadingIconButton>
          ) : undefined
        }
      >
        {dragHandleProps || dragState?.isOverlay ? (
          <IconButton ref={dragHandleRef} sx={{ ml: -4, cursor: 'grab' }} disableRipple {...dragHandleProps}>
            <DragIndicatorIcon />
          </IconButton>
        ) : undefined}
        {(track.pictureUrl || track.thumbnailUrl) && (
          <ListItemAvatar>
            <Avatar variant="square" src={track.thumbnailUrl ?? track.pictureUrl} />
          </ListItemAvatar>
        )}
        <ListItemText primary={track.title ?? track.filename} secondary={track.artist} />
      </ListItem>
    </ListItemButton>
  );
});

export default ListTrack;
