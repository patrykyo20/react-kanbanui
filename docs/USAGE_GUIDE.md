# 📚 KanbanUI - Przewodnik Użytkowania

## 🚀 Szybki Start

### Podstawowa Implementacja

```tsx
import React, { useState } from 'react';
import { KanbanBoard, IKanbanColumn, IKanbanCard } from 'kanbanui';

const MyKanbanApp = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>([
    {
      id: "todo",
      title: "Do zrobienia", 
      status: "todo",
      cards: [
        {
          id: "card-1",
          title: "Zaprojektuj UI",
          description: "Stwórz mockupy dla nowej funkcji",
          priority: "high",
          status: "todo",
          assignee: "Jan Kowalski",
          tags: ["design", "ui"]
        }
      ]
    },
    {
      id: "in-progress",
      title: "W trakcie",
      status: "in-progress", 
      cards: []
    },
    {
      id: "done",
      title: "Gotowe",
      status: "done",
      cards: []
    }
  ]);

  const handleColumnsChange = (newColumns: IKanbanColumn[]) => {
    setColumns(newColumns);
    // Opcjonalnie: zapisz do API
    // saveToAPI(newColumns);
  };

  return (
    <div className="app">
      <h1>Mój Kanban Board</h1>
      <KanbanBoard
        columns={columns}
        onColumnsChange={handleColumnsChange}
        columnHeight="600px"
      />
    </div>
  );
};
```

## 🎛️ Konfiguracja i Propsy

### KanbanBoard Props

```typescript
interface IKanbanBoard {
  columns: IKanbanColumn[];           // Wymagane - dane kolumn
  className?: string;                 // Dodatkowe klasy CSS
  useOwnStyles?: boolean;             // Czy używać własnych stylów
  columnHeight?: string;              // Wysokość kolumn (default: "600px")
  onColumnsChange?: (columns: IKanbanColumn[]) => void; // Callback przy zmianach
}
```

### Struktura Danych

#### IKanbanColumn
```typescript
interface IKanbanColumn {
  id: string;                         // Unikalny identyfikator
  title: string;                      // Tytuł kolumny
  status: "todo" | "in-progress" | "review" | "done"; // Status
  cards: IKanbanCard[];              // Lista kart w kolumnie
  color?: string;                     // Opcjonalny kolor kolumny
  maxCards?: number;                  // Limit kart w kolumnie
}
```

#### IKanbanCard
```typescript
interface IKanbanCard {
  id: string;                         // Unikalny identyfikator
  title: string;                      // Tytuł karty
  description?: string;               // Opis karty
  priority: "low" | "medium" | "high" | "urgent"; // Priorytet
  status: "todo" | "in-progress" | "review" | "done"; // Status
  assignee?: string;                  // Przypisana osoba
  dueDate?: Date;                     // Termin wykonania
  order?: number;                     // Kolejność (opcjonalne)
  tags?: string[];                    // Tagi
}
```

## 🎨 Customizacja Stylów

### Używanie Własnych Stylów

```tsx
// Sposób 1: Nadpisanie domyślnych stylów
<KanbanBoard
  columns={columns}
  useOwnStyles={false}
  className="my-custom-board"
/>

/* W CSS */
.my-custom-board {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.my-custom-board .kanban-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

```tsx
// Sposób 2: Kompletnie własne style
<KanbanBoard
  columns={columns}
  useOwnStyles={true}
  className="completely-custom"
/>

/* Musisz zdefiniować wszystkie style samodzielnie */
.completely-custom {
  /* Twoje style */
}
```

### Dostępne Klasy CSS

```css
/* Główne elementy */
.kanban-board          /* Kontener całej planszy */
.kanban-column         /* Pojedyncza kolumna */
.kanban-card           /* Pojedyncza karta */

/* Stany drag & drop */
.card-dragging         /* Karta podczas przeciągania */
.column-drop-target    /* Kolumna jako cel drop */

/* Elementy karty */
.card-title            /* Tytuł karty */
.card-description      /* Opis karty */
.card-priority         /* Badge priorytetu */
.card-assignee         /* Przypisana osoba */
.card-tags             /* Kontener tagów */
```

## ⚙️ Zaawansowane Funkcje

### Ograniczenie Liczby Kart w Kolumnie

```tsx
const columns: IKanbanColumn[] = [
  {
    id: "in-progress",
    title: "W trakcie",
    status: "in-progress",
    maxCards: 3, // Maksymalnie 3 karty
    cards: []
  }
];
```

### Integracja z API

```tsx
const KanbanWithAPI = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);

  // Załaduj dane z API
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/kanban-data');
        const data = await response.json();
        setColumns(data);
      } catch (error) {
        console.error('Błąd ładowania danych:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Zapisz zmiany do API
  const handleColumnsChange = async (newColumns: IKanbanColumn[]) => {
    setColumns(newColumns);
    
    try {
      await fetch('/api/kanban-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColumns)
      });
    } catch (error) {
      console.error('Błąd zapisywania:', error);
      // Opcjonalnie: przywróć poprzedni stan
    }
  };

  if (loading) return <div>Ładowanie...</div>;

  return (
    <KanbanBoard
      columns={columns}
      onColumnsChange={handleColumnsChange}
    />
  );
};
```

### Dodawanie Nowych Kart

```tsx
const KanbanWithAddCard = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(initialData);

  const addNewCard = (columnId: string, cardData: Partial<IKanbanCard>) => {
    const newCard: IKanbanCard = {
      id: `card-${Date.now()}`,
      title: cardData.title || 'Nowa karta',
      description: cardData.description || '',
      priority: cardData.priority || 'medium',
      status: cardData.status || 'todo',
      assignee: cardData.assignee,
      tags: cardData.tags || []
    };

    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    );
  };

  return (
    <>
      <AddCardForm onAddCard={addNewCard} />
      <KanbanBoard
        columns={columns}
        onColumnsChange={setColumns}
      />
    </>
  );
};
```

### Filtrowanie i Wyszukiwanie

```tsx
const KanbanWithSearch = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(allData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      cards: column.cards.filter(card => {
        const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            card.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = !selectedPriority || card.priority === selectedPriority;
        
        return matchesSearch && matchesPriority;
      })
    }));
  }, [columns, searchTerm, selectedPriority]);

  return (
    <>
      <div className="filters">
        <input
          type="text"
          placeholder="Szukaj kart..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option value="">Wszystkie priorytety</option>
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
          <option value="urgent">Pilny</option>
        </select>
      </div>
      
      <KanbanBoard
        columns={filteredColumns}
        onColumnsChange={setColumns}
      />
    </>
  );
};
```

## 🔗 Integracja z State Management

### Redux Toolkit

```tsx
// store/kanbanSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KanbanState {
  columns: IKanbanColumn[];
  loading: boolean;
}

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: { columns: [], loading: false } as KanbanState,
  reducers: {
    setColumns: (state, action: PayloadAction<IKanbanColumn[]>) => {
      state.columns = action.payload;
    },
    updateColumns: (state, action: PayloadAction<IKanbanColumn[]>) => {
      state.columns = action.payload;
    }
  }
});

// Component
const KanbanWithRedux = () => {
  const { columns } = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();

  const handleColumnsChange = (newColumns: IKanbanColumn[]) => {
    dispatch(updateColumns(newColumns));
  };

  return (
    <KanbanBoard
      columns={columns}
      onColumnsChange={handleColumnsChange}
    />
  );
};
```

### Zustand

```tsx
// store/kanbanStore.ts
import { create } from 'zustand';

interface KanbanStore {
  columns: IKanbanColumn[];
  setColumns: (columns: IKanbanColumn[]) => void;
  updateColumns: (columns: IKanbanColumn[]) => void;
}

const useKanbanStore = create<KanbanStore>((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns }),
  updateColumns: (columns) => set({ columns })
}));

// Component
const KanbanWithZustand = () => {
  const { columns, updateColumns } = useKanbanStore();

  return (
    <KanbanBoard
      columns={columns}
      onColumnsChange={updateColumns}
    />
  );
};
```

## 📱 Responsywność

```tsx
// Adaptacyjna wysokość kolumn
const useResponsiveHeight = () => {
  const [height, setHeight] = useState('600px');

  useEffect(() => {
    const updateHeight = () => {
      const screenHeight = window.innerHeight;
      if (screenHeight < 700) {
        setHeight('400px');
      } else if (screenHeight < 900) {
        setHeight('500px');
      } else {
        setHeight('600px');
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return height;
};

const ResponsiveKanban = () => {
  const columnHeight = useResponsiveHeight();

  return (
    <KanbanBoard
      columns={columns}
      columnHeight={columnHeight}
      onColumnsChange={handleChange}
    />
  );
};
```

## 🛡️ Error Handling

```tsx
import { ErrorBoundary } from 'kanbanui';

const App = () => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Wyślij błąd do serwisu monitoringu
    console.error('Kanban Error:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <KanbanBoard columns={columns} />
    </ErrorBoundary>
  );
};
```

## 🎯 Best Practices

### Performance
```tsx
// ✅ Dobrze - używaj useCallback dla handlerów
const handleColumnsChange = useCallback((newColumns: IKanbanColumn[]) => {
  setColumns(newColumns);
}, []);

// ✅ Dobrze - memoizuj ciężkie obliczenia
const sortedColumns = useMemo(() => 
  columns.sort((a, b) => a.title.localeCompare(b.title))
, [columns]);

// ❌ Źle - nie twórz obiektów inline
<KanbanBoard style={{ height: '600px' }} /> // Tworzy nowy obiekt przy każdym renderze

// ✅ Lepiej
const boardStyle = { height: '600px' };
<KanbanBoard style={boardStyle} />
```

### Data Management
```tsx
// ✅ Dobrze - używaj unikalnych ID
const generateId = () => `${Date.now()}-${Math.random()}`;

// ✅ Dobrze - waliduj dane
const validateCard = (card: IKanbanCard): boolean => {
  return !!(card.id && card.title && card.priority && card.status);
};

// ✅ Dobrze - używaj immutable updates
const updateCard = (cardId: string, updates: Partial<IKanbanCard>) => {
  setColumns(prev => prev.map(column => ({
    ...column,
    cards: column.cards.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    )
  })));
};
```

To wszystko co potrzebujesz do efektywnego używania KanbanUI! 🚀

