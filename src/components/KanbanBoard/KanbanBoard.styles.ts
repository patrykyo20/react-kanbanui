export const kanbanBoardStyles = {
  board: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6",
  columnsGrid: "flex gap-6 overflow-x-auto pb-4",

  column:
    "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col min-w-64 flex-shrink-0",
  columnDragOver: "border-blue-400 shadow-md scale-[1.02] bg-blue-50",

  columnHeader:
    "px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200",
  columnTitle: "text-lg font-semibold text-gray-800",
  columnCount:
    "ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full",

  dropZone:
    "flex-1 p-4 bg-gradient-to-b from-gray-50 to-white relative border-1 border-white overflow-y-auto",
  dropZoneDragOver: "bg-blue-100 border-1 border-dashed border-blue-400",

  dropIndicator:
    "absolute rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none",
  dropIndicatorActive: "opacity-100",

  cardDropZone:
    "absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none",
  cardDropZoneActive: "opacity-100 bg-blue-50/50",

  emptyState: "text-center py-12 text-gray-400 text-sm",

  card: "mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-sm transition-all duration-300 cursor-move hover:border-blue-300 relative",
  cardDragOver: "transform translate-y-2 transition-transform duration-300",
  cardTitle: "font-medium text-gray-900 text-sm mb-1",
  cardDescription: "text-xs text-gray-600 mb-2 line-clamp-2",

  priorityBadge:
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",

  assignee: "flex items-center mt-2 text-xs text-gray-500",
  assigneeIcon: "w-4 h-4 mr-1 text-gray-400",
};

export const priorityColors = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

export const responsiveClasses = {
  columns: {
    sm: "grid-cols-1",
    md: "md:grid-cols-2",
    lg: "lg:grid-cols-4",
  },
  spacing: {
    sm: "gap-4",
    md: "md:gap-6",
    lg: "lg:gap-8",
  },
};

export const animationDurations = {
  fast: "duration-150",
  normal: "duration-300",
  slow: "duration-500",
};

export const shadowVariants = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

export const borderRadiusVariants = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const colorSchemes = {
  light: {
    board: "bg-gradient-to-br from-slate-50 to-blue-50",
    column: "bg-white",
    header: "bg-gradient-to-r from-gray-50 to-gray-100",
    card: "bg-white",
  },
  dark: {
    board: "bg-gradient-to-br from-slate-900 to-blue-900",
    column: "bg-slate-800",
    header: "bg-gradient-to-r from-slate-700 to-slate-800",
    card: "bg-slate-700",
  },
};

export const hoverEffects = {
  card: "hover:shadow-sm hover:border-blue-300",
  column: "hover:shadow-md",
  button: "hover:bg-blue-50 hover:border-blue-300",
};

export const transitionEffects = {
  all: "transition-all",
  colors: "transition-colors",
  transform: "transition-transform",
  opacity: "transition-opacity",
  shadow: "transition-shadow",
};
