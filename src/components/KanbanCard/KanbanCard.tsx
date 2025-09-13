import { FC } from "react";
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
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const KanbanCard: FC<KanbanCardProps> = ({
  card,
  index,
  onDragStart,
  onDragEnd,
  className,
  testId,
  useOwnStyles = false,
}) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", card.id);
    onDragStart?.(event);
  };
  const styles = useOwnStyles
    ? ({} as typeof kanbanBoardStyles)
    : kanbanBoardStyles;

  const isGhostCard = card.id.endsWith("-ghost");

  return (
    <div
      key={card.id}
      data-card-id={card.id}
      data-card-status={card.status}
      data-card-index={index}
      className={cn(
        styles.card, 
        "kanban-card",
        isGhostCard && "opacity-50 border-2 border-dashed border-blue-400 bg-blue-50",
        className
      )}
      draggable={!isGhostCard}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      data-testid={testId}
    >
      {/* Drop zone indicators - tylko gdy potrzebne */}
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
    </div>
  );
};
