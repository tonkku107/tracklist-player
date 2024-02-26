import { List } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import DroppableWrapper from './DroppableWrapper';

export default function DroppableList({ onDragEnd, children, ...rest }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DroppableWrapper droppableId="droppable">
        {provided => (
          <List ref={provided.innerRef} {...provided.droppableProps} {...rest}>
            {children}
            {provided.placeholder}
          </List>
        )}
      </DroppableWrapper>
    </DragDropContext>
  );
}
