import { useState, useMemo, useEffect } from "react";
import { IKanbanCard, IKanbanColumn } from "./KanbanBoard";

export const useKanbanBoard = (
  defaultColumns: IKanbanColumn[],
  onColumnsChange?: (columns: IKanbanColumn[]) => void
) => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(defaultColumns);
  const [dragCard, setDragCard] = useState<IKanbanCard | null>(null);
  const [prevColumnId, setPrevColumnId] = useState<string | null>(null);
  const [nextColumnId, setNextColumnId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<{
    columnId: string;
    position: number;
  } | null>(null);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const cardElement = event.currentTarget;
    const cardId = cardElement.dataset.cardId;

    if (!cardId) {
      console.warn("No card ID found in dataset");
      return;
    }

    const column = columns.find((column) =>
      column.cards.some((c) => c.id === cardId)
    );

    if (!column) {
      console.warn(`Column not found for card ID: ${cardId}`);
      return;
    }

    const card = column.cards.find((c) => c.id === cardId);

    if (!card) {
      console.warn(`Card not found with ID: ${cardId}`);
      return;
    }

    setDragCard(card);
    setPrevColumnId(column.id);
    setNextColumnId(null);
    setDropPosition(null);
    setIsDragging(true);
    setDraggedCardId(card.id);
  };

  const calculateDropPosition = (
    event: React.DragEvent<HTMLDivElement>,
    columnId: string
  ): number => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return 0;

    const cards = column.cards.filter((card) => card.id !== dragCard?.id);
    if (cards.length === 0) return 0;

    const dropZone = event.currentTarget;
    const rect = dropZone.getBoundingClientRect();
    const y = event.clientY - rect.top;

    const cardElements = dropZone.querySelectorAll("[data-card-id]");
    let insertIndex = cards.length;

    console.log(
      `🔍 Calculating drop position: y=${y}, cards.length=${cards.length}, cardElements.length=${cardElements.length}`
    );

    for (let i = 0; i < cardElements.length; i++) {
      const cardElement = cardElements[i] as HTMLElement;
      const cardRect = cardElement.getBoundingClientRect();
      const cardTop = cardRect.top - rect.top;
      const cardMiddle = cardTop + cardRect.height / 2;

      console.log(
        `🔍 Card ${i}: top=${cardTop}, middle=${cardMiddle}, y=${y}, y < middle=${
          y < cardMiddle
        }`
      );

      if (y < cardMiddle) {
        insertIndex = i;
        break;
      }
    }

    console.log(`🎯 Final insertIndex: ${insertIndex}`);
    return insertIndex;
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const columnId = event.currentTarget.dataset.columnId;

    if (!columnId) {
      console.warn("No column ID found in dataset");
      return;
    }

    if (columnId !== nextColumnId) {
      const targetColumn = columns.find((col) => col.id === columnId);
      if (!targetColumn) {
        console.warn(`Target column not found with ID: ${columnId}`);
        return;
      }

      if (
        targetColumn.maxCards &&
        targetColumn.cards.length >= targetColumn.maxCards
      ) {
        console.warn(
          `Target column ${columnId} has reached maximum cards limit (${targetColumn.maxCards})`
        );
        return;
      }

      setNextColumnId(columnId);
    }

    const position = calculateDropPosition(event, columnId);
    console.log(
      `🎯 Drop position calculated: ${position} for column ${columnId}`
    );
    setDropPosition({ columnId, position });
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    // Sprawdź czy opuszczamy kolumnę (nie przechodzimy do dziecka)
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    // Jeśli kursor jest poza granicami kolumny, wyczyść drop position
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      console.log("🚪 Opuszczanie kolumny - czyszczenie drop position");
      setDropPosition(null);
      setNextColumnId(null);
    }
  };

  const onDragEnd = () => {
    if (!dragCard) {
      console.warn("No drag card found");
      return;
    }

    if (!prevColumnId) {
      return;
    }

    if (!dropPosition) {
      // Karta nie została upuszczona na żadną kolumnę - przywróć do oryginalnej pozycji
      console.log(
        "🔄 Karta nie została upuszczona na kolumnę - przywracanie do oryginalnej pozycji"
      );

      setDragCard(null);
      setPrevColumnId(null);
      setNextColumnId(null);
      setDropPosition(null);
      setIsDragging(false);
      setDraggedCardId(null);
      return;
    }

    // Sprawdź czy pozycja się rzeczywiście zmieniła w tej samej kolumnie
    if (prevColumnId === dropPosition.columnId) {
      const sourceColumn = columns.find((col) => col.id === prevColumnId);
      if (sourceColumn) {
        const currentIndex = sourceColumn.cards.findIndex(
          (card) => card.id === dragCard.id
        );

        console.log(
          `🔄 Same column reorder: currentIndex=${currentIndex}, dropPosition=${dropPosition.position}`
        );

        // Jeśli pozycja się nie zmieniła, anuluj operację
        if (currentIndex === dropPosition.position) {
          console.log("❌ Position unchanged, canceling operation");
          setDragCard(null);
          setPrevColumnId(null);
          setNextColumnId(null);
          setDropPosition(null);
          setIsDragging(false);
          setDraggedCardId(null);
          return;
        }
      }
    }

    const sourceColumn = columns.find((col) => col.id === prevColumnId);
    if (!sourceColumn) {
      return;
    }

    const targetColumn = columns.find(
      (col) => col.id === dropPosition.columnId
    );
    if (!targetColumn) {
      return;
    }

    // Sprawdź duplikaty tylko przy przenoszeniu między różnymi kolumnami
    if (prevColumnId !== dropPosition.columnId) {
      const cardExistsInTarget = targetColumn.cards.some(
        (card) => card.id === dragCard.id
      );
      if (cardExistsInTarget) {
        console.warn(
          `Card ${dragCard.id} already exists in target column ${dropPosition.columnId}`
        );
        return;
      }
    }

    if (
      targetColumn.maxCards &&
      targetColumn.cards.length >= targetColumn.maxCards
    ) {
      console.warn(
        `Target column ${dropPosition.columnId} has reached maximum cards limit (${targetColumn.maxCards})`
      );
      return;
    }

    setColumns((prevColumns) => {
      const cleanPrevColumns = cleanGhostCards(prevColumns);
      const newColumns = cleanPrevColumns.map((column) => {
        if (column.id === prevColumnId && column.id === dropPosition.columnId) {
          const cards = [...column.cards];
          const currentIndex = cards.findIndex(
            (card) => card.id === dragCard.id
          );

          if (currentIndex !== -1) {
            cards.splice(currentIndex, 1);

            let targetIndex = dropPosition.position;
            if (currentIndex < dropPosition.position) {
              targetIndex = dropPosition.position - 1;
            }

            console.log(
              `🎯 Reordering: currentIndex=${currentIndex}, dropPosition=${dropPosition.position}, targetIndex=${targetIndex}`
            );
            cards.splice(targetIndex, 0, dragCard);
          }

          return {
            ...column,
            cards,
          };
        }

        if (column.id === prevColumnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== dragCard.id),
          };
        }

        // Przenoszenie między kolumnami - dodaj do kolumny docelowej
        if (column.id === dropPosition.columnId) {
          const newCards = [...column.cards];
          newCards.splice(dropPosition.position, 0, dragCard);
          return {
            ...column,
            cards: newCards,
          };
        }

        return column;
      });

      // Powiadom komponent nadrzędny o zmianach
      onColumnsChange?.(newColumns);

      return newColumns;
    });

    setDragCard(null);
    setPrevColumnId(null);
    setNextColumnId(null);
    setDropPosition(null);
    setIsDragging(false);
    setDraggedCardId(null);
  };

  // Funkcja do czyszczenia ghost cards
  const cleanGhostCards = (cols: IKanbanColumn[]) => {
    return cols.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => !card.id.endsWith("-ghost")),
    }));
  };

  const visualColumns = useMemo(() => {
    // Zawsze zacznij od czystych danych (bez ghost cards)
    const cleanColumns = cleanGhostCards(columns);

    if (!isDragging || !dragCard || !dropPosition) {
      return cleanColumns;
    }

    const result = cleanColumns.map((column) => {
      // Jeśli przeciągamy w obrębie tej samej kolumny, pokaż preview pozycji
      if (column.id === prevColumnId && column.id === dropPosition.columnId) {
        const cards = [...column.cards];
        const currentIndex = cards.findIndex((card) => card.id === dragCard.id);

        if (currentIndex !== -1) {
          // Usuń kartę z obecnej pozycji
          const cardToMove = cards.splice(currentIndex, 1)[0];

          // Wstaw kartę w nowej pozycji
          let targetIndex = dropPosition.position;
          if (currentIndex < dropPosition.position) {
            targetIndex = dropPosition.position - 1;
          }

          cards.splice(targetIndex, 0, cardToMove);
        }

        return {
          ...column,
          cards,
        };
      }

      // Dodaj ghost card w miejscu docelowym
      if (column.id === dropPosition.columnId) {
        const newCards = [...column.cards];
        newCards.splice(dropPosition.position, 0, {
          ...dragCard,
          id: `${dragCard.id}-ghost`,
        });
        return {
          ...column,
          cards: newCards,
        };
      }

      // Usuń oryginalną kartę z kolumny źródłowej (tylko wizualnie)
      if (column.id === prevColumnId) {
        const filteredCards = column.cards.filter(
          (card) => card.id !== dragCard.id
        );
        return {
          ...column,
          cards: filteredCards,
        };
      }

      return column;
    });

    return result;
  }, [columns, isDragging, dragCard, dropPosition, prevColumnId]);

  return {
    columns: visualColumns,
    dragCard,
    isDragging,
    draggedCardId,
    nextColumnId,
    dropPosition,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDragEnd,
  };
};
