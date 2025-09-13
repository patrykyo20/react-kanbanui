// ✅ Style variables dla KanbanColumn - łatwe do nadpisania
export const kanbanColumnStyles = {
  // Column container
  column: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300",
  columnHover: "hover:shadow-xl transition-shadow duration-200",
  columnDragOver: "border-blue-400 shadow-xl scale-[1.02] bg-blue-50",
  columnDropTarget: "border-green-400 shadow-2xl scale-[1.03] bg-green-50",
  
  // Header
  header: "px-4 py-3 border-b border-gray-200",
  headerGradient: "bg-gradient-to-r from-gray-50 to-gray-100",
  headerInteractive: "cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200",
  
  // Title
  title: "text-lg font-semibold text-gray-800 flex items-center justify-between",
  titleText: "flex items-center",
  titleIcon: "w-5 h-5 mr-2 text-gray-600",
  
  // Count badges
  countBadge: "px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full",
  countWarning: "px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full",
  countDanger: "px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full",
  
  // Content
  content: "p-4 min-h-32 relative",
  contentGradient: "bg-gradient-to-b from-gray-50 to-white",
  contentDragOver: "bg-blue-100 border-2 border-dashed border-blue-400",
  contentDropTarget: "bg-green-100 border-2 border-dashed border-green-400",
  
  // Drop indicators
  dropIndicator: "absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none",
  dropIndicatorActive: "opacity-100",
  dropIndicatorTarget: "border-green-400 opacity-100",
  
  // Empty state
  emptyState: "text-center py-12 text-gray-400",
  emptyIcon: "mx-auto h-8 w-8 text-gray-300 mb-2",
  emptyText: "text-sm",
  
  // Progress bar
  progressBar: "w-full bg-gray-200 rounded-full h-1 mt-2",
  progressFill: "bg-blue-500 h-1 rounded-full transition-all duration-300",
  
  // Drop zone highlight
  dropZoneHighlight: "absolute inset-0 bg-gradient-to-b from-blue-100/50 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
  dropZoneHighlightActive: "opacity-100",
};

// ✅ Status icons
export const statusIcons = {
  todo: "📋",
  "in-progress": "⚡",
  review: "👀",
  done: "✅",
};

// ✅ Count badge color logic
export const getCountBadgeClass = (cardCount: number, maxCards?: number) => {
  if (!maxCards) return kanbanColumnStyles.countBadge;
  
  const percentage = (cardCount / maxCards) * 100;
  if (percentage >= 90) return kanbanColumnStyles.countDanger;
  if (percentage >= 75) return kanbanColumnStyles.countWarning;
  return kanbanColumnStyles.countBadge;
};

// ✅ Progress calculation
export const calculateProgress = (cardCount: number, maxCards?: number) => {
  if (!maxCards) return 0;
  return Math.min((cardCount / maxCards) * 100, 100);
};

// ✅ Animation variants
export const animationVariants = {
  scale: {
    hover: "hover:scale-105",
    active: "active:scale-95",
    dragOver: "scale-105",
    dropTarget: "scale-110",
  },
  shadow: {
    default: "shadow-lg",
    hover: "hover:shadow-xl",
    dragOver: "shadow-xl",
    dropTarget: "shadow-2xl",
  },
  border: {
    default: "border-gray-200",
    hover: "hover:border-gray-300",
    dragOver: "border-blue-400",
    dropTarget: "border-green-400",
  },
};

// ✅ Color schemes
export const columnColorSchemes = {
  light: {
    column: "bg-white",
    header: "bg-gradient-to-r from-gray-50 to-gray-100",
    content: "bg-gradient-to-b from-gray-50 to-white",
    border: "border-gray-200",
  },
  dark: {
    column: "bg-slate-800",
    header: "bg-gradient-to-r from-slate-700 to-slate-800",
    content: "bg-gradient-to-b from-slate-700 to-slate-800",
    border: "border-slate-600",
  },
};

// ✅ Size variants
export const columnSizeVariants = {
  sm: {
    padding: "p-3",
    minHeight: "min-h-24",
    title: "text-base",
    count: "text-xs",
  },
  md: {
    padding: "p-4",
    minHeight: "min-h-32",
    title: "text-lg",
    count: "text-xs",
  },
  lg: {
    padding: "p-6",
    minHeight: "min-h-40",
    title: "text-xl",
    count: "text-sm",
  },
};

// ✅ Transition presets
export const transitionPresets = {
  smooth: "transition-all duration-300 ease-in-out",
  fast: "transition-all duration-150 ease-out",
  slow: "transition-all duration-500 ease-in-out",
  bounce: "transition-all duration-300 ease-bounce",
};




