import { kanbanBoardStyles } from "./KanbanBoard.styles";
import { KanbanColumn } from "../KanbanColumn/KanbanColumn";
import "./KanbanBoard.css";
import { useKanbanBoard } from "./useKanbanBoard";

// ✅ Interfejsy zgodne z regułami
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
  onColumnsChange?: (columns: IKanbanColumn[]) => void;
}

export const KanbanBoard: React.FC<IKanbanBoard> = ({
  columns,
  className = "",
  useOwnStyles = false,
  columnHeight = "600px",
  onColumnsChange,
}) => {
  const {
    columns: updatedColumns,
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

  return (
    <div className={`${styles.board || ""} ${className}`}>
      <div className={styles.boardContainer || ""}>
        <div className={styles.columnsGrid || ""}>
          {updatedColumns?.map((column) => (
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
              isDragging={isDragging}
              draggedCardId={draggedCardId}
              isDropTarget={isDragging && nextColumnId === column.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
