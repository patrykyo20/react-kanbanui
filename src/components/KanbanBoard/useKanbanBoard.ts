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

    const cardElements = Array.from(dropZone.querySelectorAll("[data-card-id]"))
      .filter((element) => {
        const cardId = (element as HTMLElement).dataset.cardId;
        return cardId && cardId !== dragCard?.id && !cardId.endsWith("-ghost");
      });

    let insertIndex = cards.length;

    console.log(
      `🔍 Calculating drop position: y=${y}, cards.length=${cards.length}, cardElements.length=${cardElements.length}`
    );

    if (cardElements.length === 0) {
      console.log(`🎯 No cards in column, inserting at position 0`);
      return 0;
    }

    for (let i = 0; i < cardElements.length; i++) {
      const cardElement = cardElements[i] as HTMLElement;
      const cardRect = cardElement.getBoundingClientRect();
      const cardTop = cardRect.top - rect.top;
      const cardBottom = cardTop + cardRect.height;
      const cardMiddle = cardTop + (cardRect.height / 2);
      
      console.log(
        `🔍 Card ${i}: top=${cardTop}, middle=${cardMiddle}, bottom=${cardBottom}, y=${y}`
      );

      // Logika drop zones:
      // 1. Jeśli mysz jest w górnej części karty (przed środkiem) -> wstaw PRZED kartą
      if (y < cardMiddle) {
        console.log(`🎯 Dropping BEFORE card ${i} (y=${y} < middle=${cardMiddle})`);
        insertIndex = i;
        break;
      }
      // 2. Jeśli to ostatnia karta i mysz jest poniżej środka -> wstaw PO ostatniej karcie
      else if (i === cardElements.length - 1) {
        console.log(`🎯 Dropping AFTER last card ${i} (y=${y} >= middle=${cardMiddle})`);
        insertIndex = i + 1;
        break;
      }
      // 3. Dla kart środkowych, sprawdź czy mysz jest między środkiem tej karty a środkiem następnej
      else if (i < cardElements.length - 1) {
        const nextCardElement = cardElements[i + 1] as HTMLElement;
        const nextCardRect = nextCardElement.getBoundingClientRect();
        const nextCardTop = nextCardRect.top - rect.top;
        const nextCardMiddle = nextCardTop + (nextCardRect.height / 2);
        
        // Jeśli mysz jest między środkiem obecnej karty a środkiem następnej karty
        if (y >= cardMiddle && y < nextCardMiddle) {
          console.log(`🎯 Dropping BETWEEN card ${i} and ${i + 1} (${cardMiddle} <= y=${y} < ${nextCardMiddle})`);
          insertIndex = i + 1;
          break;
        }
      }
    }

    // Dla ostatniej pozycji, pozwól na wstawienie na końcu
    // NIE ograniczaj do cards.length
    console.log(`🎯 Final insertIndex: ${insertIndex} (cards.length: ${cards.length})`);
    console.log(`🎯 Returning position for ${dragCard?.id}: ${insertIndex}`);
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
      `🎯 Drop position calculated: ${position} for column ${columnId}, dragging card: ${dragCard?.id}`
    );
    setDropPosition({ columnId, position });
    console.log(
      `🎯 Drop position set: columnId=${columnId}, position=${position}`
    );
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
    console.log(`🏁 onDragEnd called - dragCard: ${dragCard?.id}, prevColumnId: ${prevColumnId}, dropPosition:`, dropPosition);
    
    if (!dragCard) {
      console.warn("No drag card found");
      return;
    }

    if (!prevColumnId) {
      console.warn("No previous column ID found");
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
          `🔄 Same column reorder: currentIndex=${currentIndex}, dropPosition=${dropPosition.position}, totalCards=${sourceColumn.cards.length}`
        );

        // Sprawdź czy to rzeczywiście jest zmiana pozycji
        // Prosta logika: jeśli dropPosition jest różne od currentIndex, to jest zmiana
        console.log(
          `🔄 Checking position change: currentIndex=${currentIndex}, dropPosition=${dropPosition.position}`
        );

        // Anuluj tylko jeśli próbujemy upuścić kartę dokładnie w tym samym miejscu
        if (currentIndex === dropPosition.position) {
          console.log("❌ Dropping card in the same position, canceling operation");
          setDragCard(null);
          setPrevColumnId(null);
          setNextColumnId(null);
          setDropPosition(null);
          setIsDragging(false);
          setDraggedCardId(null);
          return;
        }

        console.log("✅ Position changed, proceeding with reorder");
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

            // Oblicz prawidłową pozycję docelową
            let targetIndex;
            
            if (dropPosition.position >= cards.length) {
              // Chcemy wstawić na koniec (po wszystkich kartach)
              targetIndex = cards.length;
            } else if (currentIndex < dropPosition.position) {
              // Przesuwamy w dół - pozycja się przesuwa o 1 w lewo po usunięciu
              targetIndex = dropPosition.position - 1;
            } else {
              // Przesuwamy w górę - pozycja pozostaje ta sama
              targetIndex = dropPosition.position;
            }
            
            // Zabezpieczenie przed przekroczeniem granic
            targetIndex = Math.max(0, Math.min(targetIndex, cards.length));

            console.log(
              `🎯 Reordering: currentIndex=${currentIndex}, dropPosition=${dropPosition.position}, targetIndex=${targetIndex}, cards.length after removal=${cards.length}`
            );
            cards.splice(targetIndex, 0, dragCard);
            console.log(
              `🎯 After insertion: cards.length=${cards.length}, card at targetIndex=${targetIndex}:`, cards[targetIndex]?.id
            );
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

          // Wstaw kartę w nowej pozycji - użyj tej samej logiki co w onDragEnd
          let targetIndex;
          
          if (dropPosition.position >= cards.length) {
            // Chcemy wstawić na koniec (po wszystkich kartach)
            targetIndex = cards.length;
          } else if (currentIndex < dropPosition.position) {
            // Przesuwamy w dół - pozycja się przesuwa o 1 w lewo po usunięciu
            targetIndex = dropPosition.position - 1;
          } else {
            // Przesuwamy w górę - pozycja pozostaje ta sama
            targetIndex = dropPosition.position;
          }
          
          // Zabezpieczenie przed przekroczeniem granic
          targetIndex = Math.max(0, Math.min(targetIndex, cards.length));

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
