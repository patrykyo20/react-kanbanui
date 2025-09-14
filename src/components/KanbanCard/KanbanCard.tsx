import { FC, memo, useCallback, DragEvent } from "react";
import { IKanbanCard } from "../KanbanBoard/KanbanBoard";
import {
  kanbanBoardStyles,
  priorityColors,
} from "../KanbanBoard/KanbanBoard.styles";
import { cn } from "../../utils/cn";

interface KanbanCardProps {
  card: IKanbanCard;
  index: number;
  columnId: string;
  className?: string;
  testId?: string;
  useOwnStyles?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
}

export const KanbanCard: FC<KanbanCardProps> = memo(({
  card,
  index,
  onDragStart,
  onDragEnd,
  className,
  testId,
  useOwnStyles = false,
}) => {
  const styles = useOwnStyles
    ? ({} as typeof kanbanBoardStyles)
    : kanbanBoardStyles;

  const isGhostCard = card.id.endsWith("-ghost");

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("text/plain", card.id);
      event.dataTransfer.effectAllowed = "move";
      onDragStart?.(event);
    },
    [card.id, onDragStart]
  );

  const handleDragEnd = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.clearData();
      onDragEnd?.(event);
    },
    [onDragEnd]
  );

  return (
    <div
      data-card-id={card.id}
      data-card-status={card.status}
      data-card-index={index}
      className={cn(
        styles.card,
        "kanban-card",
        isGhostCard &&
          "opacity-50 border-2 border-dashed border-blue-400 bg-blue-50",
        className
      )}
      draggable={!isGhostCard}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-testid={testId}
    >
      <div className={styles.cardDropZone} />

      <div className={styles.cardTitle}>{card.title}</div>
      
      {card.description && (
        <div className={styles.cardDescription}>{card.description}</div>
      )}

      <div className={cn(styles.priorityBadge, priorityColors[card.priority])}>
        {card.priority}
      </div>

      {card.assignee && (
        <div className={styles.assignee}>
          <svg
            className={styles.assigneeIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          {card.assignee}
        </div>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

KanbanCard.displayName = "KanbanCard";