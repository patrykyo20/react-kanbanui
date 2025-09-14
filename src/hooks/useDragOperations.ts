import { useCallback, Dispatch, SetStateAction } from "react";
import { IKanbanCard, IKanbanColumn } from "../components/KanbanBoard/KanbanBoard";
import { validateCardDrop } from "../utils/dragCalculations";
import {
  removeGhostCards,
  reorderCardsInColumn,
} from "../utils/columnOperations";

interface DragOperationsProps {
  columns: IKanbanColumn[];
  setColumns: Dispatch<SetStateAction<IKanbanColumn[]>>;
  onColumnsChange?: (columns: IKanbanColumn[]) => void;
  resetDragState: () => void;
}

export const useDragOperations = ({
  columns,
  setColumns,
  onColumnsChange,
  resetDragState,
}: DragOperationsProps) => {
  const executeCardMove = useCallback(
    (
      draggedCard: IKanbanCard,
      sourceColumnId: string,
      dropPosition: { columnId: string; position: number }
    ) => {
      try {
        if (sourceColumnId === dropPosition.columnId) {
          const sourceColumn = columns.find((col) => col.id === sourceColumnId);
          if (sourceColumn) {
            const currentIndex = sourceColumn.cards.findIndex(
              (card) => card.id === draggedCard.id
            );

            if (currentIndex === dropPosition.position) {
              resetDragState();
              return;
            }
          }
        }

        const sourceColumn = columns.find((col) => col.id === sourceColumnId);
        const targetColumn = columns.find((col) => col.id === dropPosition.columnId);

        if (!sourceColumn || !targetColumn) {
          resetDragState();
          return;
        }

        if (sourceColumnId !== dropPosition.columnId) {
          const { isValid } = validateCardDrop(targetColumn, draggedCard, false);
          if (!isValid) {
            resetDragState();
            return;
          }
        }

        setColumns((prevColumns) => {
          const cleanColumns = removeGhostCards(prevColumns);

          const newColumns = cleanColumns.map((column) => {
            if (column.id === sourceColumnId && column.id === dropPosition.columnId) {
              const currentIndex = column.cards.findIndex(
                (card) => card.id === draggedCard.id
              );

              return reorderCardsInColumn(
                column,
                draggedCard,
                currentIndex,
                dropPosition.position
              );
            }

            if (column.id === sourceColumnId) {
              return {
                ...column,
                cards: column.cards.filter((card) => card.id !== draggedCard.id),
              };
            }

            if (column.id === dropPosition.columnId) {
              const cards = [...column.cards];
              cards.splice(dropPosition.position, 0, draggedCard);
              return { ...column, cards };
            }

            return column;
          });

          onColumnsChange?.(newColumns);
          return newColumns;
        });

        resetDragState();
      } catch (error) {
        console.error("Error during card move operation:", error);
        resetDragState();
      }
    },
    [columns, setColumns, onColumnsChange, resetDragState]
  );

  return {
    executeCardMove,
  };
};
