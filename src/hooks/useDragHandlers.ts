import { useCallback, DragEvent } from "react";
import { IKanbanColumn, IKanbanCard } from "../components/KanbanBoard/KanbanBoard";
import {
  calculateDropPosition,
  validateCardDrop,
  isMouseOutsideBounds,
} from "../utils/dragCalculations";
import {
  findColumnByCardId,
  findCardById,
} from "../utils/columnOperations";

interface DragHandlersProps {
  columns: IKanbanColumn[];
  draggedCard: IKanbanCard | null;
  sourceColumnId: string | null;
  targetColumnId: string | null;
  startDrag: (card: IKanbanCard, columnId: string) => void;
  updateDropTarget: (columnId: string) => void;
  updateDropPosition: (position: { columnId: string; position: number }) => void;
  clearDropTarget: () => void;
}

export const useDragHandlers = ({
  columns,
  draggedCard,
  sourceColumnId,
  targetColumnId,
  startDrag,
  updateDropTarget,
  updateDropPosition,
  clearDropTarget,
}: DragHandlersProps) => {
  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      try {
        const cardElement = event.currentTarget;
        const cardId = cardElement.dataset.cardId;

        if (!cardId) return;

        const sourceColumn = findColumnByCardId(columns, cardId);
        const card = findCardById(columns, cardId);

        if (!sourceColumn || !card) return;

        startDrag(card, sourceColumn.id);
      } catch (error) {
        console.error("Error during drag start:", error);
      }
    },
    [columns, startDrag]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      try {
        const columnId = event.currentTarget.dataset.columnId;
        if (!columnId || !draggedCard) return;

        const targetColumn = columns.find((col) => col.id === columnId);
        if (!targetColumn) return;

        const isSameColumn = sourceColumnId === columnId;
        const { isValid } = validateCardDrop(targetColumn, draggedCard, isSameColumn);
        if (!isValid) return;

        if (columnId !== targetColumnId) {
          updateDropTarget(columnId);
        }

        const position = calculateDropPosition(event, targetColumn, draggedCard);
        updateDropPosition({ columnId, position });
      } catch (error) {
        console.error("Error during drag over:", error);
      }
    },
    [columns, draggedCard, sourceColumnId, targetColumnId, updateDropTarget, updateDropPosition]
  );

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      try {
        if (isMouseOutsideBounds(event, event.currentTarget)) {
          clearDropTarget();
        }
      } catch (error) {
        console.error("Error during drag leave:", error);
      }
    },
    [clearDropTarget]
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
  };
};
