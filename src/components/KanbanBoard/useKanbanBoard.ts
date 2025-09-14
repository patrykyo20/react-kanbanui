import { useState, useMemo, useEffect, useCallback } from "react";
import { IKanbanColumn } from "./KanbanBoard";
import { useDragState } from "../../hooks/useDragState";
import { useDragHandlers } from "../../hooks/useDragHandlers";
import { useDragOperations } from "../../hooks/useDragOperations";
import {
  removeGhostCards,
  createDragPreview,
} from "../../utils/columnOperations";

export const useKanbanBoard = (
  defaultColumns: IKanbanColumn[],
  onColumnsChange?: (columns: IKanbanColumn[]) => void
) => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(defaultColumns);
  
  const {
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
  } = useDragState();

  const { executeCardMove } = useDragOperations({
    columns,
    setColumns,
    onColumnsChange,
    resetDragState,
  });

  const { handleDragStart, handleDragOver, handleDragLeave } = useDragHandlers({
    columns,
    draggedCard,
    sourceColumnId,
    targetColumnId,
    startDrag,
    updateDropTarget,
    updateDropPosition,
    clearDropTarget,
  });

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const handleDragEnd = useCallback(() => {
    if (!draggedCard || !sourceColumnId || !dropPosition) {
      resetDragState();
      return;
    }

    executeCardMove(draggedCard, sourceColumnId, dropPosition);
  }, [draggedCard, sourceColumnId, dropPosition, executeCardMove, resetDragState]);

  const visualColumns = useMemo(() => {
    const cleanColumns = removeGhostCards(columns);

    if (!isDragging || !draggedCard || !dropPosition || !sourceColumnId) {
      return cleanColumns;
    }

    try {
      return createDragPreview(cleanColumns, draggedCard, sourceColumnId, dropPosition);
    } catch (error) {
      console.error("Error creating drag preview:", error);
      return cleanColumns;
    }
  }, [columns, isDragging, draggedCard, dropPosition, sourceColumnId]);

  return {
    columns: visualColumns,
    dragCard: draggedCard,
    isDragging,
    draggedCardId,
    nextColumnId: targetColumnId,
    dropPosition,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };
};