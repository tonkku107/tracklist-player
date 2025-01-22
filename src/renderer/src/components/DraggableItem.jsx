import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableItem({ id, children, Component, ...rest }) {
  const { setNodeRef, setActivatorNodeRef, transform, transition, listeners, attributes, isDragging } = useSortable({ id });

  return (
    <Component
      {...rest}
      ref={setNodeRef}
      dragHandleRef={setActivatorNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      dragHandleProps={{ ...listeners, ...attributes }}
      dragState={{ isDragging }}
    >
      {children}
    </Component>
  );
}
