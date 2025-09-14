export const kanbanCardStyles = {
  card: "group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden",
  cardHover: "hover:border-blue-300 hover:scale-[1.02]",
  
  cardContent: "p-4",
  cardHeader: "flex items-start justify-between mb-3",
  cardTitle: "text-sm font-semibold text-gray-900 leading-tight",
  cardDescription: "text-xs text-gray-600 mt-2 line-clamp-2",
  
  priorityBadge: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium font-semibold",
  statusBadge: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
  
  tagsContainer: "flex flex-wrap gap-1 mt-3",
  tag: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md",
  
  footer: "flex items-center justify-between mt-3 pt-3 border-t border-gray-100",
  assignee: "flex items-center text-xs text-gray-500",
  assigneeIcon: "w-4 h-4 mr-1 text-gray-400",
  dueDate: "text-xs text-gray-500",
  dueDateIcon: "w-3 h-3 mr-1 text-gray-400",
  
  dragHandle: "absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move",
};

export const priorityColors = {
  urgent: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

export const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
};

export const cardVariants = {
  default: {
    shadow: "shadow-sm",
    border: "border-gray-200",
    hover: "hover:shadow-sm hover:border-blue-300",
  },
  elevated: {
    shadow: "shadow-md",
    border: "border-gray-300",
    hover: "hover:shadow-md hover:border-blue-400",
  },
  minimal: {
    shadow: "shadow-none",
    border: "border-gray-100",
    hover: "hover:shadow-sm hover:border-gray-300",
  },
};

export const cardSizeVariants = {
  sm: {
    padding: "p-3",
    title: "text-xs",
    description: "text-xs",
    badge: "text-xs px-1.5 py-0.5",
  },
  md: {
    padding: "p-4",
    title: "text-sm",
    description: "text-xs",
    badge: "text-xs px-2 py-1",
  },
  lg: {
    padding: "p-6",
    title: "text-base",
    description: "text-sm",
    badge: "text-sm px-3 py-1.5",
  },
};

export const cardColorSchemes = {
  light: {
    card: "bg-white",
    title: "text-gray-900",
    description: "text-gray-600",
    border: "border-gray-200",
    footer: "border-gray-100",
  },
  dark: {
    card: "bg-slate-800",
    title: "text-slate-100",
    description: "text-slate-400",
    border: "border-slate-600",
    footer: "border-slate-600",
  },
  colorful: {
    card: "bg-gradient-to-br from-white to-blue-50",
    title: "text-gray-900",
    description: "text-gray-600",
    border: "border-blue-200",
    footer: "border-blue-100",
  },
};

export const animationPresets = {
  hover: {
    scale: "hover:scale-[1.02]",
    shadow: "hover:shadow-md",
    border: "hover:border-blue-300",
    transition: "transition-all duration-200",
  },
  focus: {
    scale: "focus:scale-[1.01]",
    shadow: "focus:shadow-sm",
    border: "focus:border-blue-400",
    ring: "focus:ring-2 focus:ring-blue-200",
  },
  active: {
    scale: "active:scale-[0.98]",
    shadow: "active:shadow-sm",
    transition: "transition-all duration-100",
  },
};

export const interactiveStates = {
  default: "cursor-pointer",
  disabled: "cursor-not-allowed opacity-50",
  loading: "cursor-wait opacity-75",
  selected: "ring-2 ring-blue-400 ring-offset-2",
  dragging: "opacity-50 scale-95 cursor-grabbing",
};

export const layoutUtilities = {
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-start justify-start",
  flexEnd: "flex items-end justify-end",
  grid: "grid grid-cols-1 gap-2",
  stack: "flex flex-col space-y-2",
};
