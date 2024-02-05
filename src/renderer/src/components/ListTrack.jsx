import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useRef } from 'react';
import AsyncLoadingIconButton from './AsyncLoadingIconButton';

export default function ListTrack({ track, selected, exists, style, onDelete, onClick, onAdd }) {
  const ref = useRef(null);

  return (
    <ListItemButton style={style} selected={selected} onClick={() => (onClick ? onClick() : ref.current?.click())}>
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
            <AsyncLoadingIconButton ref={ref} edge="end" aria-label="add" onClick={!exists ? onAdd : undefined}>
              {exists ? <DoneIcon color="success" /> : <AddIcon />}
            </AsyncLoadingIconButton>
          ) : undefined
        }
      >
        {track.pictureUrl && (
          <ListItemAvatar>
            <Avatar variant="square" src={track.pictureUrl} />
          </ListItemAvatar>
        )}
        <ListItemText primary={track.title ?? track.filename} secondary={track.artist} />
      </ListItem>
    </ListItemButton>
  );
}
