import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { forwardRef, useRef } from 'react';
import AsyncLoadingIconButton from './AsyncLoadingIconButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ListTrack = forwardRef(function ListTrack(
  { track, selected, exists, onDelete, onClick, onAdd, dragHandleProps, snapshot, ...rest },
  ref
) {
  const buttonRef = useRef(null);

  return (
    <ListItemButton
      sx={
        snapshot?.isDragging
          ? {
              backgroundColor: theme => theme.palette.background.default,
              '&.Mui-selected': { backgroundColor: theme => theme.palette.background.default },
            }
          : {}
      }
      ref={ref}
      selected={selected}
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
        {dragHandleProps ? (
          <IconButton sx={{ ml: -4, cursor: 'grab' }} disableRipple {...dragHandleProps}>
            <DragIndicatorIcon />
          </IconButton>
        ) : undefined}
        {track.pictureUrl && (
          <ListItemAvatar>
            <Avatar variant="square" src={track.pictureUrl} />
          </ListItemAvatar>
        )}
        <ListItemText primary={track.title ?? track.filename} secondary={track.artist} />
      </ListItem>
    </ListItemButton>
  );
});

export default ListTrack;
