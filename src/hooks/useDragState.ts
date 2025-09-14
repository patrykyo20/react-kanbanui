import { useState, useCallback } from "react";
import { IKanbanCard } from "../components/KanbanBoard/KanbanBoard";

interface DropPosition {
  columnId: string;
  position: number;
}

export const useDragState = () => {
  const [draggedCard, setDraggedCard] = useState<IKanbanCard | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

  const startDrag = useCallback((card: IKanbanCard, columnId: string) => {
    setDraggedCard(card);
    setSourceColumnId(columnId);
    setTargetColumnId(null);
    setIsDragging(true);
    setDraggedCardId(card.id);
    setDropPosition(null);
  }, []);

  const updateDropTarget = useCallback((columnId: string) => {
    setTargetColumnId(columnId);
  }, []);

  const updateDropPosition = useCallback((position: DropPosition) => {
    setDropPosition(position);
  }, []);

  const clearDropTarget = useCallback(() => {
    setTargetColumnId(null);
    setDropPosition(null);
  }, []);

  const resetDragState = useCallback(() => {
    setDraggedCard(null);
    setSourceColumnId(null);
    setTargetColumnId(null);
    setIsDragging(false);
    setDraggedCardId(null);
    setDropPosition(null);
  }, []);

  return {
    draggedCard,
    sourceColumnId,
    targetColumnId,
    isDragging,
    draggedCardId,
    dropPosition,
    startDrag,
    updateDropTarget,
    updateDropPosition,
    clearDropTarget,
    resetDragState,
  };
};
