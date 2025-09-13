# KanbanUI - React Kanban Components Library

A modern, performant, and accessible React component library for building professional Kanban boards and task management interfaces.

## 🎯 Project Vision

KanbanUI is designed to be the go-to solution for developers building task management applications. The library provides a complete set of components, hooks, and utilities that follow React 19 best practices, ensuring excellent performance, accessibility, and developer experience.

## 🏗️ Architecture Overview

### Core Design Principles
- **Performance First**: All components are optimized with React.memo, useMemo, and useCallback
- **Accessibility Built-in**: ARIA labels, keyboard navigation, and screen reader support
- **TypeScript Strict**: Full type safety with strict TypeScript configuration
- **Customizable Styling**: Support for both internal CSS modules and external styling systems
- **Clean Code**: Maximum 150 lines per component, 20 lines per function

## 📦 Core Components

### 1. KanbanBoard (`<KanbanBoard />`)
**Main container component for the entire Kanban interface**

```typescript
interface IKanbanBoard {
  columns: IKanbanColumn[];
  useOwnStyles?: boolean;
  className?: string;
  onCardMove?: (cardId: string, targetColumnId: string) => void;
  onColumnReorder?: (columnOrder: string[]) => void;
  onCardCreate?: (columnId: string, cardData: ICardData) => void;
  onCardDelete?: (cardId: string) => void;
  onCardEdit?: (cardId: string, cardData: Partial<ICardData>) => void;
  isReadOnly?: boolean;
  showColumnActions?: boolean;
  showCardActions?: boolean;
}
```

**Features:**
- Drag & drop card movement between columns
- Column reordering with drag & drop
- Keyboard navigation support
- Responsive grid layout
- Virtual scrolling for large datasets

### 2. KanbanColumn (`<KanbanColumn />`)
**Individual column component representing a workflow stage**

```typescript
interface IKanbanColumn {
  id: string;
  title: string;
  cards: IKanbanCard[];
  color?: string;
  maxCards?: number;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onCardDrop?: (cardId: string, position: number) => void;
  onCardAdd?: (cardData: ICardData) => void;
  onColumnEdit?: (columnData: Partial<IKanbanColumn>) => void;
  onColumnDelete?: () => void;
}
```

**Features:**
- Card limit management
- Collapsible/expandable columns
- Column actions (edit, delete, add cards)
- Visual indicators for card count and limits

### 3. KanbanCard (`<KanbanCard />`)
**Individual task/ticket component**

```typescript
interface IKanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee?: IUser;
  dueDate?: Date;
  tags?: string[];
  attachments?: IAttachment[];
  comments?: IComment[];
  timeEstimate?: number;
  timeSpent?: number;
  onCardClick?: (cardId: string) => void;
  onCardEdit?: (cardData: Partial<IKanbanCard>) => void;
  onCardDelete?: (cardId: string) => void;
}
```

**Features:**
- Rich content display (text, images, attachments)
- Priority and status indicators
- Assignee and due date management
- Time tracking
- Tag system
- Comment system

### 4. KanbanHeader (`<KanbanHeader />`)
**Top navigation and controls component**

```typescript
interface IKanbanHeader {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: IFilters) => void;
  onViewChange?: (view: 'board' | 'list' | 'timeline') => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  actions?: React.ReactNode;
}
```

**Features:**
- Global search functionality
- Filter controls (status, priority, assignee, tags)
- View switching (board, list, timeline)
- Custom action buttons
- Breadcrumb navigation

### 5. KanbanToolbar (`<KanbanToolbar />`)
**Action toolbar for bulk operations**

```typescript
interface IKanbanToolbar {
  selectedCards: string[];
  onBulkMove?: (cardIds: string[], targetColumnId: string) => void;
  onBulkDelete?: (cardIds: string[]) => void;
  onBulkAssign?: (cardIds: string[], assigneeId: string) => void;
  onBulkTag?: (cardIds: string[], tags: string[]) => void;
  onSelectionClear?: () => void;
  showBulkActions?: boolean;
}
```

**Features:**
- Multi-select card selection
- Bulk operations (move, delete, assign, tag)
- Selection management
- Keyboard shortcuts for selection

## 🪝 Custom Hooks

### 1. `useDragDrop`
**Core drag and drop functionality**

```typescript
interface IUseDragDropOptions {
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (result: DropResult) => void;
  onDragOver?: (item: DragItem, target: DropTarget) => void;
  dragType?: 'card' | 'column';
  enableKeyboard?: boolean;
}

interface IUseDragDropReturn {
  dragState: IDragState;
  handleDragStart: (item: DragItem) => void;
  handleDragEnd: (result: DropResult) => void;
  handleDragOver: (item: DragItem, target: DropTarget) => void;
  resetDrag: () => void;
  isDragging: boolean;
  draggedItem: DragItem | null;
}
```

### 2. `useKanbanState`
**State management for Kanban board**

```typescript
interface IUseKanbanStateOptions {
  initialColumns: IKanbanColumn[];
  onStateChange?: (state: IKanbanState) => void;
  enableOptimisticUpdates?: boolean;
  enableUndoRedo?: boolean;
}

interface IUseKanbanStateReturn {
  columns: IKanbanColumn[];
  addColumn: (column: IKanbanColumn) => void;
  updateColumn: (columnId: string, updates: Partial<IKanbanColumn>) => void;
  deleteColumn: (columnId: string) => void;
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, position: number) => void;
  addCard: (columnId: string, card: IKanbanCard) => void;
  updateCard: (cardId: string, updates: Partial<IKanbanCard>) => void;
  deleteCard: (cardId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

### 3. `useKeyboardNavigation`
**Keyboard navigation and shortcuts**

```typescript
interface IUseKeyboardNavigationOptions {
  onCardSelect?: (cardId: string) => void;
  onColumnSelect?: (columnId: string) => void;
  onCardMove?: (cardId: string, direction: 'left' | 'right' | 'up' | 'down') => void;
  enableShortcuts?: boolean;
}

interface IUseKeyboardNavigationReturn {
  focusedCardId: string | null;
  focusedColumnId: string | null;
  handleKeyDown: (event: KeyboardEvent) => void;
  focusCard: (cardId: string) => void;
  focusColumn: (columnId: string) => void;
  clearFocus: () => void;
}
```

### 4. `useKanbanFilters`
**Filtering and search functionality**

```typescript
interface IUseKanbanFiltersOptions {
  columns: IKanbanColumn[];
  onFiltersChange?: (filters: IFilters) => void;
  debounceMs?: number;
}

interface IUseKanbanFiltersReturn {
  filters: IFilters;
  filteredColumns: IKanbanColumn[];
  setSearchQuery: (query: string) => void;
  setStatusFilter: (statuses: string[]) => void;
  setPriorityFilter: (priorities: string[]) => void;
  setAssigneeFilter: (assigneeIds: string[]) => void;
  setTagFilter: (tags: string[]) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
}
```

### 5. `useVirtualization`
**Performance optimization for large datasets**

```typescript
interface IUseVirtualizationOptions {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface IUseVirtualizationReturn {
  virtualItems: IVirtualItem[];
  totalSize: number;
  virtualizer: Virtualizer;
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
}
```

## 🎨 Styling System

### CSS Modules Integration
Each component includes its own CSS module with:
- Component-specific styles
- CSS custom properties for theming
- Responsive breakpoints
- Dark/light mode support
- Animation and transition classes

### External Styling Support
Components support external styling through:
- `useOwnStyles` prop for style override
- `className` prop for custom classes
- CSS custom properties for theming
- Styled-components compatibility

### Design Tokens
```css
:root {
  /* Colors */
  --kanban-primary: #3b82f6;
  --kanban-secondary: #64748b;
  --kanban-success: #10b981;
  --kanban-warning: #f59e0b;
  --kanban-error: #ef4444;
  
  /* Spacing */
  --kanban-spacing-xs: 0.25rem;
  --kanban-spacing-sm: 0.5rem;
  --kanban-spacing-md: 1rem;
  --kanban-spacing-lg: 1.5rem;
  --kanban-spacing-xl: 2rem;
  
  /* Typography */
  --kanban-font-family: system-ui, -apple-system, sans-serif;
  --kanban-font-size-sm: 0.875rem;
  --kanban-font-size-base: 1rem;
  --kanban-font-size-lg: 1.125rem;
  
  /* Shadows */
  --kanban-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --kanban-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --kanban-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## 🚀 Performance Features

### Optimization Strategies
- **React.memo** for all components
- **useMemo** for expensive calculations
- **useCallback** for event handlers
- **Virtual scrolling** for large lists
- **Lazy loading** for heavy components
- **Debounced search** (300ms minimum)
- **Optimistic updates** with rollback

### Bundle Optimization
- Tree shaking support
- Code splitting with React.lazy
- CSS extraction and minification
- Source maps for debugging
- Multiple output formats (CJS, ESM)

## ♿ Accessibility Features

### ARIA Support
- Proper ARIA labels and descriptions
- Role attributes for drag and drop
- Live regions for dynamic content
- Focus management and trapping

### Keyboard Navigation
- Arrow key navigation between cards
- Enter key for selection
- Escape key for canceling actions
- Tab order management
- Keyboard shortcuts for power users

### Screen Reader Support
- Semantic HTML structure
- Descriptive text for all interactions
- Status announcements for drag operations
- Error message announcements

## 🧪 Testing Strategy

### Testing Requirements
- **Unit tests** for all components (80% coverage minimum)
- **Integration tests** for drag and drop
- **Accessibility tests** with jest-axe
- **User interaction tests** with @testing-library/user-event
- **Visual regression tests** for UI consistency

### Test Utilities
- Custom render functions with providers
- Mock data factories
- Drag and drop test helpers
- Accessibility test helpers

## 📱 Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile Optimizations
- Touch-friendly drag and drop
- Swipe gestures for mobile
- Responsive card layouts
- Mobile-first navigation

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- React 19+
- TypeScript 5.8+

### Installation
```bash
npm install kanbanui
# or
yarn add kanbanui
# or
pnpm add kanbanui
```

### Basic Usage
```tsx
import { KanbanBoard, KanbanColumn, KanbanCard } from 'kanbanui';

const MyKanban = () => {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        {
          id: 'card-1',
          title: 'Implement drag and drop',
          priority: 'high',
          status: 'todo'
        }
      ]
    }
  ];

  return (
    <KanbanBoard 
      columns={columns}
      onCardMove={(cardId, targetColumnId) => {
        console.log(`Moving card ${cardId} to column ${targetColumnId}`);
      }}
    />
  );
};
```

## 🎯 Roadmap

### Phase 1: Core Components
- [x] Basic KanbanBoard structure
- [x] Drag and drop functionality
- [x] Column and card components
- [ ] Header and toolbar components

### Phase 2: Advanced Features
- [ ] Virtual scrolling
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Keyboard shortcuts

### Phase 3: Enterprise Features
- [ ] Multi-board support
- [ ] User management
- [ ] Analytics dashboard
- [ ] API integration

### Phase 4: Ecosystem
- [ ] React Native support
- [ ] Vue.js port
- [ ] Design system tokens
- [ ] Component playground

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code style and standards
- Testing requirements
- Pull request process
- Development setup

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.kanbanui.dev](https://docs.kanbanui.dev)
- **Issues**: [GitHub Issues](https://github.com/kanbanui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kanbanui/discussions)
- **Discord**: [Join our community](https://discord.gg/kanbanui)

---

Built with ❤️ by the KanbanUI team
