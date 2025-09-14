import { DragEvent } from "react";
import {
  IKanbanCard,
  IKanbanColumn,
} from "../components/KanbanBoard/KanbanBoard";

/**
 * Calculates the optimal drop position for a dragged card based on mouse position
 * @param event - The drag event containing mouse coordinates
 * @param targetColumn - The column where the card is being dropped
 * @param draggedCard - The card being dragged
 * @returns The calculated insertion index
 */
export const calculateDropPosition = (
  event: DragEvent<HTMLDivElement>,
  targetColumn: IKanbanColumn,
  draggedCard: IKanbanCard | null
): number => {
  if (!targetColumn || !draggedCard) return 0;

  const availableCards = targetColumn.cards.filter(
    (card) => card.id !== draggedCard.id
  );

  if (availableCards.length === 0) return 0;

  const dropZone = event.currentTarget;
  const dropZoneRect = dropZone.getBoundingClientRect();
  const mouseY = event.clientY - dropZoneRect.top;

  const cardElements = Array.from(
    dropZone.querySelectorAll("[data-card-id]")
  ).filter((element) => {
    const cardId = (element as HTMLElement).dataset.cardId;
    return cardId && cardId !== draggedCard.id && !cardId.endsWith("-ghost");
  });

  if (cardElements.length === 0) return 0;

  let insertIndex = availableCards.length;

  for (let i = 0; i < cardElements.length; i++) {
    const cardElement = cardElements[i] as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();
    const cardTop = cardRect.top - dropZoneRect.top;
    const cardMiddle = cardTop + cardRect.height / 2;

    if (mouseY < cardMiddle) {
      insertIndex = i;
      break;
    }

    if (i === cardElements.length - 1 && mouseY >= cardMiddle) {
      insertIndex = i + 1;
      break;
    }

    if (i < cardElements.length - 1) {
      const nextCardElement = cardElements[i + 1] as HTMLElement;
      const nextCardRect = nextCardElement.getBoundingClientRect();
      const nextCardTop = nextCardRect.top - dropZoneRect.top;
      const nextCardMiddle = nextCardTop + nextCardRect.height / 2;

      if (mouseY >= cardMiddle && mouseY < nextCardMiddle) {
        insertIndex = i + 1;
        break;
      }
    }
  }

  return insertIndex;
};

/**
 * Calculates the target index for reordering within the same column
 * @param currentIndex - Current position of the card
 * @param dropPosition - Desired drop position
 * @param totalCards - Total number of cards after removal
 * @returns Adjusted target index
 */
export const calculateTargetIndex = (
  currentIndex: number,
  dropPosition: number,
  totalCards: number
): number => {
  let targetIndex: number;

  if (dropPosition >= totalCards) {
    targetIndex = totalCards;
  } else if (currentIndex < dropPosition) {
    targetIndex = dropPosition - 1;
  } else {
    targetIndex = dropPosition;
  }

  return Math.max(0, Math.min(targetIndex, totalCards));
};

/**
 * Validates if a card can be dropped in the target column
 * @param targetColumn - The target column
 * @param draggedCard - The card being dragged
 * @param isSameColumn - Whether this is a reorder within the same column
 * @returns Validation result with error message if any
 */
export const validateCardDrop = (
  targetColumn: IKanbanColumn,
  draggedCard: IKanbanCard,
  isSameColumn = false
): { isValid: boolean; error?: string } => {
  if (!targetColumn || !draggedCard) {
    return { isValid: false, error: "Invalid target column or card" };
  }

  if (isSameColumn) {
    return { isValid: true };
  }

  if (
    targetColumn.maxCards &&
    targetColumn.cards.length >= targetColumn.maxCards
  ) {
    return {
      isValid: false,
      error: `Column has reached maximum capacity (${targetColumn.maxCards} cards)`,
    };
  }

  const cardExists = targetColumn.cards.some(
    (card) => card.id === draggedCard.id
  );
  if (cardExists) {
    return {
      isValid: false,
      error: "Card already exists in target column",
    };
  }

  return { isValid: true };
};

/**
 * Checks if the mouse is outside the element boundaries
 * @param event - The drag event
 * @param element - The HTML element to check against
 * @returns True if mouse is outside bounds
 */
export const isMouseOutsideBounds = (
  event: DragEvent<HTMLDivElement>,
  element: HTMLElement
): boolean => {
  const rect = element.getBoundingClientRect();
  const { clientX: x, clientY: y } = event;

  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
};
