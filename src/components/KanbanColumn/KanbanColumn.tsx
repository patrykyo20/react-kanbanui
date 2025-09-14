import { FC, memo, useMemo, DragEvent } from "react";
import { IKanbanColumn } from "../KanbanBoard/KanbanBoard";
import { KanbanCard } from "../KanbanCard/KanbanCard";
import { kanbanBoardStyles } from "../KanbanBoard/KanbanBoard.styles";
import { cn } from "../../utils/cn";

interface KanbanColumnProps {
  column: IKanbanColumn;
  className?: string;
  testId?: string;
  useOwnStyles?: boolean;
  columnHeight?: string;
  theme?: "light" | "dark";
  isDragging?: boolean;
  draggedCardId?: string | null;
  isDropTarget?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
}

export const KanbanColumn: FC<KanbanColumnProps> = memo(({
  column,
  className,
  testId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  useOwnStyles = false,
  columnHeight = "600px",
  theme = "light",
  isDragging = false,
  draggedCardId = null,
  isDropTarget = false,
}) => {
  const styles = useOwnStyles
    ? ({} as typeof kanbanBoardStyles)
    : kanbanBoardStyles;

  const columnClasses = useMemo(
    () => {
      if (useOwnStyles) return className;
      const themeClass = theme === "dark" ? "kanbanui-column-dark" : styles.column;
      return cn(
        themeClass,
        isDragging && "transition-all duration-200",
        isDropTarget && "border-blue-400 shadow-md scale-[1.02] bg-blue-50",
        className
      );
    },
    [styles.column, useOwnStyles, theme, isDragging, isDropTarget, className]
  );

  const dropZoneClasses = useMemo(
    () =>
      cn(
        styles.dropZone,
        "relative",
        isDropTarget && "bg-blue-100 border-2 border-dashed border-blue-400"
      ),
    [styles.dropZone, isDropTarget]
  );

  const renderedCards = useMemo(
    () =>
      column.cards.map((card, index) => {
        const isGhostCard = card.id.endsWith("-ghost");
        const isBeingDragged = draggedCardId === card.id;

        return (
          <KanbanCard
            key={card.id}
            card={card}
            index={index}
            columnId={column.id}
            testId={`card-${card.id}`}
            useOwnStyles={useOwnStyles}
            theme={theme}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={cn(
              isGhostCard &&
                "opacity-50 border-2 border-dashed border-blue-400 bg-blue-50",
              isBeingDragged && "card-dragging"
            )}
          />
        );
      }),
    [column.cards, column.id, draggedCardId, useOwnStyles, theme, onDragStart, onDragEnd]
  );

  const emptyState = useMemo(
    () => (
      <div className={styles.emptyState}>
        <svg
          className="mx-auto h-8 w-8 text-gray-300 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <span>No cards yet</span>
      </div>
    ),
    [styles.emptyState]
  );

  return (
    <div
      className={columnClasses}
      style={{ height: columnHeight }}
      data-column-status={column.status}
      data-testid={testId}
      data-column-id={column.id}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDragEnd}
    >
      <div className={useOwnStyles ? "" : (theme === "dark" ? "kanbanui-column-header-dark" : styles.columnHeader)}>
        <h3 className={useOwnStyles ? "" : (theme === "dark" ? "kanbanui-column-title-dark" : styles.columnTitle)}>
          {column.title}
          <span className={styles.columnCount}>{column.cards.length}</span>
        </h3>
      </div>

      <div
        className={dropZoneClasses}
        data-column-status={column.status}
      >
        {renderedCards}

        {column.cards.length === 0 && !isDropTarget && emptyState}
      </div>
    </div>
  );
});

KanbanColumn.displayName = "KanbanColumn";