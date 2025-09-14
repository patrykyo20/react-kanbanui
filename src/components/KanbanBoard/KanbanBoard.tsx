import { FC, memo, useMemo, useCallback } from "react";
import { kanbanBoardStyles } from "./KanbanBoard.styles";
import { KanbanColumn } from "../KanbanColumn/KanbanColumn";
import { useKanbanBoard } from "./useKanbanBoard";
import { cn } from "../../utils/cn";

export interface IKanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "review" | "done";
  assignee?: string;
  dueDate?: Date;
  order?: number;
  tags?: string[];
}

export interface IKanbanColumn {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "review" | "done";
  cards: IKanbanCard[];
  color?: string;
  maxCards?: number;
}

export interface IKanbanBoard {
  columns: IKanbanColumn[];
  className?: string;
  useOwnStyles?: boolean;
  columnHeight?: string;
  theme?: "light" | "dark";
  onColumnsChange?: (columns: IKanbanColumn[]) => void;
}

export const KanbanBoard: FC<IKanbanBoard> = memo(
  ({
    columns,
    className = "",
    useOwnStyles = false,
    columnHeight = "600px",
    theme = "light",
    onColumnsChange,
  }) => {
    const {
      columns: processedColumns,
      isDragging,
      draggedCardId,
      nextColumnId,
      onDragStart,
      onDragOver,
      onDragLeave,
      onDragEnd,
    } = useKanbanBoard(columns, onColumnsChange);

    const styles = useOwnStyles
      ? ({} as typeof kanbanBoardStyles)
      : kanbanBoardStyles;

  const boardClasses = useMemo(
    () => {
      if (useOwnStyles) return className;
      const themeClass = theme === "dark" ? "kanbanui-board-dark" : styles.board;
      return cn(themeClass, className);
    },
    [styles.board, className, useOwnStyles, theme]
  );

    const renderColumn = useCallback(
      (column: IKanbanColumn) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnd={onDragEnd}
          testId={`column-${column.id}`}
          useOwnStyles={useOwnStyles}
          columnHeight={columnHeight}
          theme={theme}
          isDragging={isDragging}
          draggedCardId={draggedCardId}
          isDropTarget={isDragging && nextColumnId === column.id}
        />
      ),
      [
        onDragStart,
        onDragOver,
        onDragLeave,
        onDragEnd,
        useOwnStyles,
        columnHeight,
        theme,
        isDragging,
        draggedCardId,
        nextColumnId,
      ]
    );

    const renderedColumns = useMemo(
      () => processedColumns?.map(renderColumn) ?? [],
      [processedColumns, renderColumn]
    );

    return (
      <div className={boardClasses}>
        <div>
          <div className={styles.columnsGrid}>{renderedColumns}</div>
        </div>
      </div>
    );
  }
);

KanbanBoard.displayName = "KanbanBoard";
