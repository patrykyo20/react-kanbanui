import { IKanbanCard, IKanbanColumn } from "../components/KanbanBoard/KanbanBoard";
import { calculateTargetIndex } from "./dragCalculations";

/**
 * Removes ghost cards from all columns
 * @param columns - Array of kanban columns
 * @returns Cleaned columns without ghost cards
 */
export const removeGhostCards = (columns: IKanbanColumn[]): IKanbanColumn[] => {
  return columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => !card.id.endsWith("-ghost")),
  }));
};

/**
 * Finds the column containing a specific card
 * @param columns - Array of columns to search
 * @param cardId - ID of the card to find
 * @returns The column containing the card, or undefined if not found
 */
export const findColumnByCardId = (
  columns: IKanbanColumn[],
  cardId: string
): IKanbanColumn | undefined => {
  return columns.find((column) =>
    column.cards.some((card) => card.id === cardId)
  );
};

/**
 * Finds a card by its ID across all columns
 * @param columns - Array of columns to search
 * @param cardId - ID of the card to find
 * @returns The card object, or undefined if not found
 */
export const findCardById = (
  columns: IKanbanColumn[],
  cardId: string
): IKanbanCard | undefined => {
  for (const column of columns) {
    const card = column.cards.find((c) => c.id === cardId);
    if (card) return card;
  }
  return undefined;
};

/**
 * Reorders cards within the same column
 * @param column - The column to reorder
 * @param draggedCard - The card being moved
 * @param currentIndex - Current position of the card
 * @param dropPosition - Target position
 * @returns Updated column with reordered cards
 */
export const reorderCardsInColumn = (
  column: IKanbanColumn,
  draggedCard: IKanbanCard,
  currentIndex: number,
  dropPosition: number
): IKanbanColumn => {
  const cards = [...column.cards];
  
  if (currentIndex === -1) return column;

  cards.splice(currentIndex, 1);

  const targetIndex = calculateTargetIndex(currentIndex, dropPosition, cards.length);
  cards.splice(targetIndex, 0, draggedCard);

  return {
    ...column,
    cards,
  };
};

/**
 * Creates visual preview for drag operations
 * @param columns - Current columns state
 * @param draggedCard - Card being dragged
 * @param sourceColumnId - ID of source column
 * @param dropPosition - Current drop position
 * @returns Columns with visual preview applied
 */
export const createDragPreview = (
  columns: IKanbanColumn[],
  draggedCard: IKanbanCard,
  sourceColumnId: string,
  dropPosition: { columnId: string; position: number }
): IKanbanColumn[] => {
  const cleanColumns = removeGhostCards(columns);

  return cleanColumns.map((column) => {
    if (column.id === sourceColumnId && column.id === dropPosition.columnId) {
      const currentIndex = column.cards.findIndex(
        (card) => card.id === draggedCard.id
      );

      if (currentIndex !== -1) {
        return reorderCardsInColumn(
          column,
          draggedCard,
          currentIndex,
          dropPosition.position
        );
      }

      return column;
    }

    if (column.id === dropPosition.columnId) {
      const cards = [...column.cards];
      cards.splice(dropPosition.position, 0, {
        ...draggedCard,
        id: `${draggedCard.id}-ghost`,
      });

      return { ...column, cards };
    }

    if (column.id === sourceColumnId) {
      return {
        ...column,
        cards: column.cards.filter((card) => card.id !== draggedCard.id),
      };
    }

    return column;
  });
};
