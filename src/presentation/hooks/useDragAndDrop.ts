import { useState, DragEvent } from "react";

export interface DragAndDropHandlers {
  onDragStart: (e: DragEvent<HTMLElement>, index: number) => void;
  onDragOver: (e: DragEvent<HTMLElement>, index: number) => void;
  onDrop: (e: DragEvent<HTMLElement>, index: number) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
}

export function useDragAndDrop<T>(
  items: T[],
  onReorder: (newItems: T[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, movedItem);

    onReorder(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handlers: DragAndDropHandlers = {
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onDragEnd: handleDragEnd,
  };

  return { handlers, draggedIndex };
}
