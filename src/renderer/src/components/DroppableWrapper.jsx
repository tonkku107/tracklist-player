import { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

// https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1167427762
export default function DroppableWrapper({ children, ...props }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) return null;

  return <Droppable {...props}>{children}</Droppable>;
}
