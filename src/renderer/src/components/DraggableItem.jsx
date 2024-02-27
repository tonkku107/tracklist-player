import { Draggable } from 'react-beautiful-dnd';

export default function DraggableItem({ id, index, children, Component, ...rest }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Component
          {...rest}
          ref={provided.innerRef}
          {...provided.draggableProps}
          dragHandleProps={provided.dragHandleProps}
          snapshot={snapshot}
        >
          {children}
        </Component>
      )}
    </Draggable>
  );
}
