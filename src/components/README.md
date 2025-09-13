# KanbanUI Components Documentation

## 📁 Folder Structure
```
src/components/
├── KanbanBoard/
│   ├── KanbanBoard.tsx
│   ├── KanbanBoard.module.css
│   ├── KanbanBoard.test.tsx
│   └── index.ts
├── KanbanColumn/
│   ├── KanbanColumn.tsx
│   ├── KanbanColumn.module.css
│   ├── KanbanColumn.test.tsx
│   └── index.ts
├── KanbanCard/
│   ├── KanbanCard.tsx
│   ├── KanbanCard.module.css
│   ├── KanbanCard.test.tsx
│   └── index.ts
├── KanbanHeader/
│   ├── KanbanHeader.tsx
│   ├── KanbanHeader.module.css
│   ├── KanbanHeader.test.tsx
│   └── index.ts
├── KanbanToolbar/
│   ├── KanbanToolbar.tsx
│   ├── KanbanToolbar.module.css
│   ├── KanbanToolbar.test.tsx
│   └── index.ts
├── KanbanSearch/
│   ├── KanbanSearch.tsx
│   ├── KanbanSearch.module.css
│   ├── KanbanSearch.test.tsx
│   └── index.ts
├── KanbanFilters/
│   ├── KanbanFilters.tsx
│   ├── KanbanFilters.module.css
│   ├── KanbanFilters.test.tsx
│   └── index.ts
├── KanbanCardForm/
│   ├── KanbanCardForm.tsx
│   ├── KanbanCardForm.module.css
│   ├── KanbanCardForm.test.tsx
│   └── index.ts
├── KanbanColumnForm/
│   ├── KanbanColumnForm.tsx
│   ├── KanbanColumnForm.module.css
│   ├── KanbanColumnForm.test.tsx
│   └── index.ts
├── KanbanDragHandle/
│   ├── KanbanDragHandle.tsx
│   ├── KanbanDragHandle.module.css
│   ├── KanbanDragHandle.test.tsx
│   └── index.ts
├── KanbanDropZone/
│   ├── KanbanDropZone.tsx
│   ├── KanbanDropZone.module.css
│   ├── KanbanDropZone.test.tsx
│   └── index.ts
├── KanbanPriorityBadge/
│   ├── KanbanPriorityBadge.tsx
│   ├── KanbanPriorityBadge.module.css
│   ├── KanbanPriorityBadge.test.tsx
│   └── index.ts
├── KanbanStatusBadge/
│   ├── KanbanStatusBadge.tsx
│   ├── KanbanStatusBadge.module.css
│   ├── KanbanStatusBadge.test.tsx
│   └── index.ts
├── KanbanAssignee/
│   ├── KanbanAssignee.tsx
│   ├── KanbanAssignee.module.css
│   ├── KanbanAssignee.test.tsx
│   └── index.ts
├── KanbanTags/
│   ├── KanbanTags.tsx
│   ├── KanbanTags.module.css
│   ├── KanbanTags.test.tsx
│   └── index.ts
├── KanbanComments/
│   ├── KanbanComments.tsx
│   ├── KanbanComments.module.css
│   ├── KanbanComments.test.tsx
│   └── index.ts
├── KanbanAttachments/
│   ├── KanbanAttachments.tsx
│   ├── KanbanAttachments.module.css
│   ├── KanbanAttachments.test.tsx
│   └── index.ts
├── KanbanTimeTracking/
│   ├── KanbanTimeTracking.tsx
│   ├── KanbanTimeTracking.module.css
│   ├── KanbanTimeTracking.test.tsx
│   └── index.ts
├── KanbanEmptyState/
│   ├── KanbanEmptyState.tsx
│   ├── KanbanEmptyState.module.css
│   ├── KanbanEmptyState.test.tsx
│   └── index.ts
├── KanbanLoadingState/
│   ├── KanbanLoadingState.tsx
│   ├── KanbanLoadingState.module.css
│   ├── KanbanLoadingState.test.tsx
│   └── index.ts
├── KanbanErrorBoundary/
│   ├── KanbanErrorBoundary.tsx
│   ├── KanbanErrorBoundary.module.css
│   ├── KanbanErrorBoundary.test.tsx
│   └── index.ts
└── index.ts
```

## 🧩 Core Components

### 1. KanbanBoard
**Główny kontener dla całego interfejsu Kanban**

```typescript
interface IKanbanBoard {
  // Dane
  columns: IKanbanColumn[];
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Callbacki dla operacji na kartach
  onCardMove?: (cardId: string, targetColumnId: string, position: number) => void;
  onCardCreate?: (columnId: string, cardData: ICardData) => void;
  onCardDelete?: (cardId: string) => void;
  onCardEdit?: (cardId: string, cardData: Partial<ICardData>) => void;
  onCardDuplicate?: (cardId: string) => void;
  
  // Callbacki dla operacji na kolumnach
  onColumnReorder?: (columnOrder: string[]) => void;
  onColumnCreate?: (columnData: IColumnData) => void;
  onColumnEdit?: (columnId: string, columnData: Partial<IColumnData>) => void;
  onColumnDelete?: (columnId: string) => void;
  
  // Konfiguracja
  isReadOnly?: boolean;
  showColumnActions?: boolean;
  showCardActions?: boolean;
  enableColumnReordering?: boolean;
  enableCardReordering?: boolean;
  
  // Funkcjonalności
  showSearch?: boolean;
  showFilters?: boolean;
  showToolbar?: boolean;
  showHeader?: boolean;
  
  // Stylowanie zaawansowane
  theme?: 'light' | 'dark' | 'auto';
  layout?: 'horizontal' | 'vertical';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  
  // Performance
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `columns` - Dane kolumn i kart do wyświetlenia
- `useOwnStyles` - Pozwala na nadpisanie domyślnych stylów
- `onCardMove` - Obsługa przenoszenia kart między kolumnami
- `enableColumnReordering` - Włącza/wyłącza możliwość zmiany kolejności kolumn
- `enableVirtualization` - Optymalizacja dla dużych list (100+ kart)

---

### 2. KanbanColumn
**Pojedyncza kolumna reprezentująca etap workflow**

```typescript
interface IKanbanColumn {
  // Dane
  id: string;
  title: string;
  description?: string;
  cards: IKanbanCard[];
  
  // Wygląd
  color?: string;
  icon?: React.ReactNode;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  maxCards?: number;
  
  // Funkcjonalności
  allowCardCreation?: boolean;
  allowCardDeletion?: boolean;
  allowCardEditing?: boolean;
  allowCardDuplication?: boolean;
  
  // Callbacki
  onCardDrop?: (cardId: string, position: number) => void;
  onCardAdd?: (cardData: ICardData) => void;
  onColumnEdit?: (columnData: Partial<IKanbanColumn>) => void;
  onColumnDelete?: () => void;
  onColumnCollapse?: (isCollapsed: boolean) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Konfiguracja
  isDragDisabled?: boolean;
  isDropDisabled?: boolean;
  showCardCount?: boolean;
  showProgressBar?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `maxCards` - Limit kart w kolumnie (przydatne dla WIP limits)
- `isCollapsible` - Pozwala na zwijanie kolumn dla oszczędności miejsca
- `allowCardCreation` - Kontroluje czy można tworzyć karty w tej kolumnie
- `showProgressBar` - Pokazuje postęp kolumny (ile kart vs limit)

---

### 3. KanbanCard
**Pojedyncza karta zadania/tasku**

```typescript
interface IKanbanCard {
  // Dane podstawowe
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  
  // Metadane
  assignee?: IUser;
  dueDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  tags?: string[];
  
  // Zawartość
  attachments?: IAttachment[];
  comments?: IComment[];
  checklists?: IChecklist[];
  
  // Time tracking
  timeEstimate?: number; // w minutach
  timeSpent?: number; // w minutach
  
  // Callbacki
  onCardClick?: (cardId: string) => void;
  onCardEdit?: (cardData: Partial<IKanbanCard>) => void;
  onCardDelete?: (cardId: string) => void;
  onCardDuplicate?: (cardId: string) => void;
  onAssigneeChange?: (assigneeId: string) => void;
  onPriorityChange?: (priority: Priority) => void;
  onStatusChange?: (status: Status) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Funkcjonalności
  isSelected?: boolean;
  isDragging?: boolean;
  showActions?: boolean;
  showAssignee?: boolean;
  showPriority?: boolean;
  showStatus?: boolean;
  showTags?: boolean;
  showTimeTracking?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `priority` - Priorytet zadania (wpływa na kolor i kolejność)
- `timeEstimate/timeSpent` - Śledzenie czasu pracy
- `checklists` - Listy zadań w ramach karty
- `isSelected` - Stan zaznaczenia (dla operacji masowych)

---

### 4. KanbanHeader
**Nagłówek z kontrolkami i nawigacją**

```typescript
interface IKanbanHeader {
  // Dane
  title: string;
  subtitle?: string;
  breadcrumbs?: IBreadcrumb[];
  
  // Wyszukiwanie
  searchQuery?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onSearchClear?: () => void;
  
  // Filtry
  filters?: IFilters;
  onFilterChange?: (filters: IFilters) => void;
  onFilterReset?: () => void;
  
  // Widoki
  currentView?: 'board' | 'list' | 'timeline' | 'calendar';
  availableViews?: ViewType[];
  onViewChange?: (view: ViewType) => void;
  
  // Akcje
  actions?: React.ReactNode;
  showSearch?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  showBreadcrumbs?: boolean;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Konfiguracja
  isSticky?: boolean;
  showDivider?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `breadcrumbs` - Nawigacja po hierarchii (np. Projekt > Sprint > Board)
- `currentView` - Przełączanie między różnymi widokami danych
- `isSticky` - Nagłówek pozostaje widoczny podczas scrollowania

---

### 5. KanbanToolbar
**Toolbar dla operacji masowych i akcji**

```typescript
interface IKanbanToolbar {
  // Stan
  selectedCards: string[];
  selectedColumns?: string[];
  
  // Operacje masowe na kartach
  onBulkMove?: (cardIds: string[], targetColumnId: string) => void;
  onBulkDelete?: (cardIds: string[]) => void;
  onBulkAssign?: (cardIds: string[], assigneeId: string) => void;
  onBulkTag?: (cardIds: string[], tags: string[]) => void;
  onBulkPriority?: (cardIds: string[], priority: Priority) => void;
  onBulkStatus?: (cardIds: string[], status: Status) => void;
  
  // Zarządzanie selekcją
  onSelectionClear?: () => void;
  onSelectAll?: () => void;
  onSelectInverse?: () => void;
  
  // Konfiguracja
  showBulkActions?: boolean;
  showSelectionInfo?: boolean;
  showQuickActions?: boolean;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `selectedCards` - Lista zaznaczonych kart do operacji masowych
- `onBulkMove` - Przeniesienie wielu kart jednocześnie
- `onSelectAll` - Zaznaczenie wszystkich kart w widoku

---

## 🔧 Utility Components

### 6. KanbanSearch
**Komponent wyszukiwania z autouzupełnianiem**

```typescript
interface IKanbanSearch {
  // Dane
  query: string;
  suggestions?: string[];
  recentSearches?: string[];
  
  // Callbacki
  onSearch: (query: string) => void;
  onQueryChange: (query: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  onRecentSearchSelect?: (search: string) => void;
  
  // Konfiguracja
  placeholder?: string;
  debounceMs?: number;
  minQueryLength?: number;
  maxSuggestions?: number;
  
  // Funkcjonalności
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
  showSearchHistory?: boolean;
  enableAdvancedSearch?: boolean;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Po co te propsy:**
- `debounceMs` - Opóźnienie wyszukiwania (300ms dla performance)
- `suggestions` - Autouzupełnianie na podstawie historii
- `enableAdvancedSearch` - Wyszukiwanie zaawansowane (filtry, operatory)

---

### 7. KanbanFilters
**Panel filtrów i sortowania**

```typescript
interface IKanbanFilters {
  // Filtry
  filters: IFilters;
  availableFilters: IAvailableFilter[];
  
  // Callbacki
  onFilterChange: (filters: IFilters) => void;
  onFilterReset: () => void;
  onFilterPresetSave?: (name: string, filters: IFilters) => void;
  onFilterPresetLoad?: (presetName: string) => void;
  
  // Sortowanie
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, direction: 'asc' | 'desc') => void;
  
  // Konfiguracja
  showQuickFilters?: boolean;
  showAdvancedFilters?: boolean;
  showFilterPresets?: boolean;
  showSortOptions?: boolean;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `availableFilters` - Lista dostępnych filtrów (status, priorytet, assignee)
- `filterPresets` - Zapisane zestawy filtrów dla szybkiego dostępu
- `sortBy/sortDirection` - Sortowanie wyników wyszukiwania

---

### 8. KanbanCardForm
**Formularz tworzenia/edycji karty**

```typescript
interface IKanbanCardForm {
  // Dane
  card?: Partial<IKanbanCard>;
  columnId: string;
  
  // Callbacki
  onSubmit: (cardData: ICardData) => void;
  onCancel: () => void;
  onDelete?: (cardId: string) => void;
  
  // Konfiguracja
  mode: 'create' | 'edit';
  showDeleteButton?: boolean;
  showAssigneeField?: boolean;
  showPriorityField?: boolean;
  showStatusField?: boolean;
  showTagsField?: boolean;
  showTimeTrackingFields?: boolean;
  
  // Walidacja
  validationRules?: IValidationRules;
  onValidationError?: (errors: IValidationErrors) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `mode` - Różne zachowanie dla tworzenia vs edycji
- `validationRules` - Reguły walidacji pól formularza
- `showXXXField` - Kontrola widoczności pól (można ukryć niepotrzebne)

---

### 9. KanbanColumnForm
**Formularz tworzenia/edycji kolumny**

```typescript
interface IKanbanColumnForm {
  // Dane
  column?: Partial<IKanbanColumn>;
  
  // Callbacki
  onSubmit: (columnData: IColumnData) => void;
  onCancel: () => void;
  onDelete?: (columnId: string) => void;
  
  // Konfiguracja
  mode: 'create' | 'edit';
  showDeleteButton?: boolean;
  showColorPicker?: boolean;
  showIconSelector?: boolean;
  showAdvancedOptions?: boolean;
  
  // Walidacja
  validationRules?: IValidationRules;
  onValidationError?: (errors: IValidationErrors) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `showColorPicker` - Wybór koloru kolumny
- `showIconSelector` - Wybór ikony dla kolumny
- `showAdvancedOptions` - Dodatkowe opcje (WIP limits, automatyzacja)

---

### 10. KanbanDragHandle
**Uchwyt do przeciągania elementów**

```typescript
interface IKanbanDragHandle {
  // Dane
  itemId: string;
  itemType: 'card' | 'column';
  
  // Callbacki
  onDragStart?: (itemId: string, itemType: string) => void;
  onDragEnd?: (itemId: string, itemType: string) => void;
  
  // Konfiguracja
  isDisabled?: boolean;
  showDragIndicator?: boolean;
  dragPreview?: React.ReactNode;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `itemType` - Określa czy przeciągamy kartę czy kolumnę
- `dragPreview` - Custom preview podczas przeciągania
- `showDragIndicator` - Wizualny wskaźnik możliwości przeciągania

---

### 11. KanbanDropZone
**Strefa upuszczania elementów**

```typescript
interface IKanbanDropZone {
  // Dane
  zoneId: string;
  zoneType: 'column' | 'card' | 'board';
  
  // Callbacki
  onDrop?: (itemId: string, itemType: string, position: number) => void;
  onDragOver?: (itemId: string, itemType: string) => void;
  onDragLeave?: () => void;
  
  // Konfiguracja
  isActive?: boolean;
  isHighlighted?: boolean;
  showDropIndicator?: boolean;
  acceptTypes?: string[];
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Po co te propsy:**
- `acceptTypes` - Określa jakie typy elementów można upuścić
- `isHighlighted` - Wizualne podświetlenie podczas przeciągania nad strefą
- `showDropIndicator` - Pokazuje gdzie element zostanie upuszczony

---

## 🎨 Visual Components

### 12. KanbanPriorityBadge
**Badge priorytetu karty**

```typescript
interface IKanbanPriorityBadge {
  // Dane
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Konfiguracja
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `showIcon/showText` - Kontrola co ma być wyświetlane
- `size` - Różne rozmiary dla różnych kontekstów

---

### 13. KanbanStatusBadge
**Badge statusu karty**

```typescript
interface IKanbanStatusBadge {
  // Dane
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  
  // Konfiguracja
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- Podobnie jak PriorityBadge, ale dla statusów
- Różne kolory i ikony dla różnych statusów

---

### 14. KanbanAssignee
**Komponent wyświetlający przypisanego użytkownika**

```typescript
interface IKanbanAssignee {
  // Dane
  assignee?: IUser;
  
  // Konfiguracja
  showAvatar?: boolean;
  showName?: boolean;
  showEmail?: boolean;
  showRole?: boolean;
  size?: 'sm' | 'md' | 'lg';
  
  // Callbacki
  onClick?: (userId: string) => void;
  onRemove?: (userId: string) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `showAvatar/showName/showEmail` - Kontrola wyświetlanych informacji
- `onClick` - Przejście do profilu użytkownika
- `onRemove` - Usunięcie przypisania

---

### 15. KanbanTags
**Komponent wyświetlający tagi karty**

```typescript
interface IKanbanTags {
  // Dane
  tags: string[];
  
  // Konfiguracja
  maxVisible?: number;
  showAllOnHover?: boolean;
  allowEditing?: boolean;
  
  // Callbacki
  onTagClick?: (tag: string) => void;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `maxVisible` - Limit widocznych tagów (reszta w tooltip)
- `allowEditing` - Możliwość dodawania/usuwania tagów
- `onTagClick` - Filtrowanie po tagu

---

## 📊 Data Components

### 16. KanbanComments
**System komentarzy dla karty**

```typescript
interface IKanbanComments {
  // Dane
  comments: IComment[];
  cardId: string;
  
  // Konfiguracja
  showCommentForm?: boolean;
  showTimestamps?: boolean;
  showUserAvatars?: boolean;
  maxComments?: number;
  
  // Callbacki
  onCommentAdd?: (comment: ICommentData) => void;
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
  onCommentReply?: (commentId: string, reply: ICommentData) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `maxComments` - Limit wyświetlanych komentarzy
- `onCommentReply` - Odpowiadanie na komentarze
- `showTimestamps` - Wyświetlanie czasu dodania komentarza

---

### 17. KanbanAttachments
**System załączników dla karty**

```typescript
interface IKanbanAttachments {
  // Dane
  attachments: IAttachment[];
  cardId: string;
  
  // Konfiguracja
  showUploadButton?: boolean;
  showFileSize?: boolean;
  showUploadDate?: boolean;
  maxFileSize?: number;
  allowedTypes?: string[];
  
  // Callbacki
  onFileUpload?: (file: File) => void;
  onFileDownload?: (attachmentId: string) => void;
  onFileDelete?: (attachmentId: string) => void;
  onFilePreview?: (attachmentId: string) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `maxFileSize` - Limit rozmiaru pliku
- `allowedTypes` - Dozwolone typy plików
- `onFilePreview` - Podgląd pliku bez pobierania

---

### 18. KanbanTimeTracking
**Śledzenie czasu pracy na karcie**

```typescript
interface IKanbanTimeTracking {
  // Dane
  timeEstimate?: number;
  timeSpent?: number;
  timeEntries?: ITimeEntry[];
  
  // Konfiguracja
  showTimer?: boolean;
  showHistory?: boolean;
  showEstimate?: boolean;
  allowManualEntry?: boolean;
  
  // Callbacki
  onTimerStart?: () => void;
  onTimerStop?: () => void;
  onTimerPause?: () => void;
  onTimeEntryAdd?: (entry: ITimeEntryData) => void;
  onEstimateUpdate?: (estimate: number) => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `showTimer` - Timer do śledzenia czasu w czasie rzeczywistym
- `allowManualEntry` - Możliwość ręcznego dodawania wpisów czasowych
- `onTimerStart/Stop/Pause` - Kontrola timera

---

## 🚨 State Components

### 19. KanbanEmptyState
**Stan pustej kolumny/karty**

```typescript
interface IKanbanEmptyState {
  // Dane
  type: 'column' | 'board' | 'search';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  
  // Akcje
  actions?: React.ReactNode;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `type` - Różne komunikaty dla różnych pustych stanów
- `showCreateButton` - Przycisk do tworzenia nowych elementów
- `actions` - Dodatkowe akcje (np. import danych)

---

### 20. KanbanLoadingState
**Stan ładowania**

```typescript
interface IKanbanLoadingState {
  // Dane
  type: 'skeleton' | 'spinner' | 'progress';
  message?: string;
  progress?: number;
  
  // Konfiguracja
  showMessage?: boolean;
  showProgress?: boolean;
  indeterminate?: boolean;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `type` - Różne typy loaderów
- `progress` - Procent ukończenia ładowania
- `indeterminate` - Nieokreślony czas ładowania

---

### 21. KanbanErrorBoundary
**Boundary dla obsługi błędów**

```typescript
interface IKanbanErrorBoundary {
  // Dane
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  
  // Callbacki
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  
  // Konfiguracja
  showErrorDetails?: boolean;
  enableRetry?: boolean;
  
  // Stylowanie
  useOwnStyles?: boolean;
  className?: string;
  
  // Accessibility
  ariaLabel?: string;
}
```

**Po co te propsy:**
- `fallback` - Custom komponent do wyświetlania błędów
- `onError` - Logowanie błędów
- `enableRetry` - Przycisk ponownej próby

---

## 📝 Index Files

### 22. Component Index Files
Każdy komponent ma swój `index.ts`:

```typescript
// src/components/KanbanBoard/index.ts
export { KanbanBoard } from './KanbanBoard';
export type { IKanbanBoard } from './KanbanBoard';
export { default as styles } from './KanbanBoard.module.css';
```

### 23. Main Index File
```typescript
// src/components/index.ts
export * from './KanbanBoard';
export * from './KanbanColumn';
export * from './KanbanCard';
export * from './KanbanHeader';
export * from './KanbanToolbar';
export * from './KanbanSearch';
export * from './KanbanFilters';
export * from './KanbanCardForm';
export * from './KanbanColumnForm';
export * from './KanbanDragHandle';
export * from './KanbanDropZone';
export * from './KanbanPriorityBadge';
export * from './KanbanStatusBadge';
export * from './KanbanAssignee';
export * from './KanbanTags';
export * from './KanbanComments';
export * from './KanbanAttachments';
export * from './KanbanTimeTracking';
export * from './KanbanEmptyState';
export * from './KanbanLoadingState';
export * from './KanbanErrorBoundary';
```

## 🎯 Implementacja

### Kolejność implementacji:
1. **Core Components** (KanbanBoard, KanbanColumn, KanbanCard)
2. **Utility Components** (Search