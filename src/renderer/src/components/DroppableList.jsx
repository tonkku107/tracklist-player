import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { List } from '@mui/material';
import { useCallback, useState } from 'react';

export default function DroppableList({ onDragEnd, children, ids, renderOverlay, ...rest }) {
  const [activeId, setActiveId] = useState(null);

  const onDragStart = useCallback(e => {
    const { active } = e;
    setActiveId(active.id);
  }, []);
  const _onDragEnd = useCallback(e => {
    setActiveId(null);
    onDragEnd?.(e);
  }, []);

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={_onDragEnd} collisionDetection={closestCenter}>
      <List {...rest}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
        <DragOverlay>{activeId ? renderOverlay(activeId) : null}</DragOverlay>
      </List>
    </DndContext>
  );
}
