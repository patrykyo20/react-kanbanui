# 🏗️ KanbanUI - Architektura i Flow Komponentów

## 📋 Przegląd Architektury

KanbanUI został zbudowany z myślą o wydajności, modularności i łatwości w utrzymaniu. Architektura opiera się na wzorcu **separation of concerns** z wyraźnym podziałem odpowiedzialności.

## 🔄 Flow Komponentów

### Główny Flow Aplikacji

```
App.tsx
  └── ErrorBoundary
      └── KanbanBoard
          ├── useKanbanBoard (główny hook)
          └── KanbanColumn[] (dla każdej kolumny)
              └── KanbanCard[] (dla każdej karty)
```

### Szczegółowy Flow Drag & Drop

```
1. Użytkownik rozpoczyna przeciąganie
   ↓
2. KanbanCard.onDragStart → useKanbanBoard.handleDragStart
   ↓
3. useDragHandlers.handleDragStart → useDragState.startDrag
   ↓
4. Użytkownik przeciąga nad kolumną
   ↓
5. KanbanColumn.onDragOver → useKanbanBoard.handleDragOver
   ↓
6. dragCalculations.calculateDropPosition → useDragState.updateDropPosition
   ↓
7. visualColumns (useMemo) tworzy preview z ghost cards
   ↓
8. Użytkownik kończy przeciąganie
   ↓
9. KanbanColumn.onDrop → useKanbanBoard.handleDragEnd
   ↓
10. useDragOperations.executeCardMove → columnOperations.reorderCardsInColumn
    ↓
11. setColumns aktualizuje stan → onColumnsChange callback
```

## 🧩 Struktura Komponentów

### 1. **KanbanBoard** (główny komponent)
```typescript
// Odpowiedzialność:
- Orkiestracja całego systemu
- Zarządzanie stanem kolumn
- Koordynacja drag & drop
- Renderowanie układu kolumn

// Kluczowe hooki:
- useKanbanBoard() // główna logika
- React.memo() // optymalizacja re-renderów
```

### 2. **KanbanColumn** (kolumna z kartami)
```typescript
// Odpowiedzialność:
- Renderowanie pojedynczej kolumny
- Obsługa drop zone
- Wyświetlanie stanu pustej kolumny
- Przekazywanie event handlerów

// Optymalizacje:
- useMemo() dla classes
- React.memo() z dependency check
```

### 3. **KanbanCard** (pojedyncza karta)
```typescript
// Odpowiedzialność:
- Renderowanie karty z danymi
- Obsługa drag start/end
- Wyświetlanie priority, assignee, tags
- Ghost card visualization

// Optymalizacje:
- useCallback() dla handlerów
- React.memo() dla stabilności
```

## 🔗 Hooki i Stan

### **useDragState** - Zarządzanie stanem drag & drop
```typescript
interface DragState {
  draggedCard: IKanbanCard | null;      // Przeciągana karta
  sourceColumnId: string | null;        // Kolumna źródłowa  
  targetColumnId: string | null;        // Kolumna docelowa
  isDragging: boolean;                  // Czy trwa przeciąganie
  draggedCardId: string | null;         // ID przeciąganej karty
  dropPosition: DropPosition | null;    // Pozycja drop
}

// Akcje:
- startDrag()        // Rozpocznij przeciąganie
- updateDropTarget() // Zaktualizuj cel
- updateDropPosition() // Zaktualizuj pozycję
- clearDropTarget()  // Wyczyść cel
- resetDragState()   // Reset całego stanu
```

### **useDragHandlers** - Event handlery
```typescript
// Główne handlery:
- handleDragStart()  // Inicjalizacja drag
- handleDragOver()   // Kalkulacja pozycji podczas drag
- handleDragLeave()  // Czyszczenie gdy opuszczamy obszar

// Dependencies:
- dragCalculations.calculateDropPosition()
- dragCalculations.validateCardDrop()
- columnOperations.findColumnByCardId()
```

### **useDragOperations** - Wykonywanie operacji
```typescript
// Główna funkcja:
- executeCardMove() // Wykonuje faktyczne przeniesienie

// Obsługuje:
- Reorderowanie w tej samej kolumnie
- Przenoszenie między kolumnami  
- Walidację operacji
- Aktualizację stanu kolumn
```

## 🛠️ Utility Functions

### **dragCalculations.ts** - Obliczenia pozycji
```typescript
// Kluczowe funkcje:
- calculateDropPosition()  // Oblicza gdzie upuścić kartę
- calculateTargetIndex()   // Oblicza docelowy indeks po przeniesieniu
- validateCardDrop()       // Waliduje czy można upuścić
- isMouseOutsideBounds()   // Sprawdza czy mysz jest poza obszarem
```

### **columnOperations.ts** - Operacje na kolumnach
```typescript
// Operacje:
- removeGhostCards()       // Usuwa karty preview
- reorderCardsInColumn()   // Zmienia kolejność w kolumnie
- moveCardBetweenColumns() // Przenosi między kolumnami
- createDragPreview()      // Tworzy podgląd podczas drag
- findColumnByCardId()     // Znajduje kolumnę po ID karty
```

## 🎯 Wzorce Wydajności

### **1. Memoization Strategy**
```typescript
// React.memo z custom comparison
const KanbanCard = React.memo(({ card, ...props }) => {
  // Komponenty re-renderują się tylko gdy rzeczywiście się zmieniają
});

// useMemo dla drogich obliczeń
const visualColumns = useMemo(() => {
  return createDragPreview(columns, draggedCard, sourceColumnId, dropPosition);
}, [columns, isDragging, draggedCard, dropPosition, sourceColumnId]);
```

### **2. Callback Optimization**
```typescript
// Stabilne referencje funkcji
const handleDragStart = useCallback((event) => {
  // Handler z zależnościami
}, [columns, startDrag]);

// Zapobiega niepotrzebnym re-renderom dzieci
```

### **3. State Batching**
```typescript
// Jeden useState z całym drag state zamiast wielu
const [dragState, setDragState] = useState<DragState>({
  draggedCard: null,
  sourceColumnId: null,
  // ... pozostałe pola
});
```

## 🔄 Cykl Życia Operacji Drag & Drop

### **Faza 1: Inicjalizacja**
1. Użytkownik klika i zaczyna przeciągać kartę
2. `onDragStart` → `handleDragStart` → `startDrag`
3. Stan zostaje zaktualizowany: `isDragging: true`, `draggedCard: card`

### **Faza 2: Przeciąganie**
1. Mysz porusza się nad kolumnami
2. `onDragOver` → `handleDragOver` → `calculateDropPosition`
3. Stan zostaje aktualizowany: `dropPosition: { columnId, position }`
4. `visualColumns` tworzy preview z ghost cards

### **Faza 3: Finalizacja**
1. Użytkownik puszcza kartę
2. `onDragEnd` → `handleDragEnd` → `executeCardMove`
3. Walidacja ruchu + aktualizacja stanu kolumn
4. Reset drag state + wywołanie `onColumnsChange`

## 🛡️ Error Handling

### **Strategie Obsługi Błędów**
```typescript
// 1. Try-catch w każdym handlerze
try {
  const position = calculateDropPosition(event, targetColumn, draggedCard);
  updateDropPosition({ columnId, position });
} catch (error) {
  console.error("Error during drag over:", error);
}

// 2. Walidacja na każdym kroku
const { isValid, error } = validateCardDrop(targetColumn, draggedCard, isSameColumn);
if (!isValid) {
  resetDragState();
  return;
}

// 3. ErrorBoundary na poziomie aplikacji
<ErrorBoundary>
  <KanbanBoard columns={columns} />
</ErrorBoundary>
```

## 📊 Data Flow

### **Jednokierunkowy przepływ danych**
```
Props (columns) 
  ↓
Local State (useState)
  ↓  
Drag State (useDragState)
  ↓
Visual Columns (useMemo) 
  ↓
Rendered UI
  ↓
User Interactions
  ↓
Event Handlers
  ↓
State Updates
  ↓
onColumnsChange Callback
  ↓
Parent Component State Update
```

## 🎨 Customization Points

### **Style Overrides**
```typescript
// useOwnStyles prop pozwala na pełne nadpisanie stylów
<KanbanBoard useOwnStyles={true} className="custom-board" />
```

### **Event Callbacks**
```typescript
// onColumnsChange dla obsługi zmian w rodzicu
const handleChange = (newColumns) => {
  setColumns(newColumns);
  // Dodatkowa logika (np. zapis do API)
};
```

### **Column Limits**
```typescript
// maxCards na poziomie kolumny
const column = {
  id: "in-progress", 
  maxCards: 3,
  // ...
};
```


