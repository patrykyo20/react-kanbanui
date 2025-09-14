# 🚀 KanbanUI - Przewodnik Testowania Wydajności

## 📋 Przegląd

Ten przewodnik pokazuje krok po kroku jak przetestować wydajność aplikacji KanbanUI. Poznasz narzędzia, metryki i techniki optymalizacji.

## 🛠️ Narzędzia do Testowania

### **1. Chrome DevTools**
- **Performance Tab** - Analiza renderowania i JavaScript
- **Memory Tab** - Śledzenie wycieków pamięci  
- **Network Tab** - Analiza ładowania zasobów
- **Lighthouse** - Kompleksowa analiza wydajności

### **2. React Developer Tools**
- **Profiler** - Analiza re-renderów komponentów
- **Components** - Inspekcja stanu i props

### **3. Bundle Analyzer**
- Analiza rozmiaru bundle'a
- Identyfikacja niepotrzebnych zależności

## 📊 Krok 1: Przygotowanie Środowiska Testowego

### **1.1 Instalacja narzędzi**

```bash
# React DevTools (Chrome Extension)
# Zainstaluj z Chrome Web Store

# Bundle Analyzer  
npm install --save-dev webpack-bundle-analyzer

# Performance monitoring
npm install --save-dev @welldone-software/why-did-you-render
```

### **1.2 Konfiguracja środowiska**

```typescript
// src/performance.ts - Narzędzie do debugowania
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
```

### **1.3 Przygotowanie danych testowych**

```typescript
// utils/testData.ts - Generowanie dużych zestawów danych
export const generateTestData = (
  columnsCount: number = 4, 
  cardsPerColumn: number = 50
): IKanbanColumn[] => {
  const columns: IKanbanColumn[] = [];
  
  for (let i = 0; i < columnsCount; i++) {
    const cards: IKanbanCard[] = [];
    
    for (let j = 0; j < cardsPerColumn; j++) {
      cards.push({
        id: `card-${i}-${j}`,
        title: `Task ${j + 1} in Column ${i + 1}`,
        description: `Description for task ${j + 1}`,
        priority: ['low', 'medium', 'high', 'urgent'][j % 4] as any,
        status: ['todo', 'in-progress', 'review', 'done'][i] as any,
        assignee: `User ${(j % 5) + 1}`,
        tags: [`tag-${j % 3}`, `category-${j % 4}`]
      });
    }
    
    columns.push({
      id: `col-${i}`,
      title: `Column ${i + 1}`,
      status: ['todo', 'in-progress', 'review', 'done'][i] as any,
      cards
    });
  }
  
  return columns;
};
```

## 🔍 Krok 2: Testowanie Wydajności Renderowania

### **2.1 Test z Chrome DevTools Performance**

1. **Uruchom aplikację** z dużą ilością danych:
```typescript
// App.tsx
const [columns] = useState(() => generateTestData(4, 100)); // 400 kart
```

2. **Otwórz Chrome DevTools** (F12)

3. **Przejdź do zakładki Performance**

4. **Rozpocznij nagrywanie** (czerwony przycisk)

5. **Wykonaj akcje testowe**:
   - Przeciągnij kartę z pierwszej kolumny na ostatnią
   - Zmień kolejność kilku kart w tej samej kolumnie
   - Dodaj nową kartę (jeśli masz taką funkcję)

6. **Zatrzymaj nagrywanie** (stop button)

### **2.2 Analiza wyników Performance**

**🔍 Na co zwrócić uwagę:**

- **FCP (First Contentful Paint)** < 1.5s
- **LCP (Largest Contentful Paint)** < 2.5s  
- **FID (First Input Delay)** < 100ms
- **CLS (Cumulative Layout Shift)** < 0.1

**📊 Kluczowe metryki:**
```
Main thread activity:
- Scripting (JavaScript) < 30%
- Rendering < 20% 
- Painting < 10%

Memory usage:
- JS Heap < 50MB dla 400 kart
- DOM Nodes < 2000
```

### **2.3 Test React Profiler**

1. **Zainstaluj React DevTools** (extension)

2. **Uruchom aplikację** w trybie development

3. **Otwórz React DevTools → Profiler**

4. **Rozpocznij profilowanie** (niebieski przycisk)

5. **Wykonaj operacje drag & drop**

6. **Zatrzymaj profilowanie**

**🔍 Analiza wyników:**
- Sprawdź które komponenty re-renderują się niepotrzebnie
- Zidentyfikuj expensive commits (> 16ms)
- Znajdź komponenty bez memoization

## ⚡ Krok 3: Testowanie Wydajności Drag & Drop

### **3.1 Test responsywności przeciągania**

```typescript
// utils/performanceTest.ts
export const measureDragPerformance = () => {
  let dragStartTime: number;
  let frameCount = 0;
  let fps: number[] = [];
  
  const startMeasurement = () => {
    dragStartTime = performance.now();
    frameCount = 0;
    fps = [];
    requestAnimationFrame(measureFrame);
  };
  
  const measureFrame = (timestamp: number) => {
    frameCount++;
    const elapsed = timestamp - dragStartTime;
    const currentFPS = frameCount / (elapsed / 1000);
    fps.push(currentFPS);
    
    if (elapsed < 5000) { // 5 sekund testu
      requestAnimationFrame(measureFrame);
    } else {
      const avgFPS = fps.reduce((a, b) => a + b) / fps.length;
      console.log(`Average FPS during drag: ${avgFPS.toFixed(2)}`);
      console.log(`Min FPS: ${Math.min(...fps).toFixed(2)}`);
      console.log(`Max FPS: ${Math.max(...fps).toFixed(2)}`);
    }
  };
  
  return { startMeasurement };
};
```

### **3.2 Użycie w komponencie**

```typescript
// KanbanBoard component
const { startMeasurement } = measureDragPerformance();

const handleDragStart = useCallback((event) => {
  if (process.env.NODE_ENV === 'development') {
    startMeasurement();
  }
  // ... reszta logiki
}, []);
```

### **3.3 Testowanie z różnymi rozmiarami danych**

```typescript
// Test scenarios
const testScenarios = [
  { columns: 3, cardsPerColumn: 10 },   // Małe - 30 kart
  { columns: 4, cardsPerColumn: 25 },   // Średnie - 100 kart  
  { columns: 5, cardsPerColumn: 50 },   // Duże - 250 kart
  { columns: 6, cardsPerColumn: 100 },  // Bardzo duże - 600 kart
];

testScenarios.forEach(({ columns, cardsPerColumn }) => {
  const data = generateTestData(columns, cardsPerColumn);
  // Test każdego scenariusza osobno
});
```

## 🧠 Krok 4: Testowanie Zużycia Pamięci

### **4.1 Memory Tab w Chrome DevTools**

1. **Otwórz Memory tab**

2. **Wybierz "Heap snapshot"**

3. **Weź snapshot przed** rozpoczęciem testów

4. **Wykonaj intensywne operacje**:
   - 50+ drag & drop operacji
   - Dodawanie/usuwanie kart
   - Zmiany w wielu kolumnach

5. **Weź snapshot po** operacjach

6. **Porównaj snapshots**

**🔍 Na co zwrócić uwagę:**
- Wzrost heap size > 10MB = potencjalny memory leak
- Liczba detached DOM nodes > 100 = problem
- Objects retained between snapshots

### **4.2 Test ciągłego używania**

```typescript
// utils/memoryStressTest.ts
export const runMemoryStressTest = (duration: number = 60000) => {
  const operations = [
    'dragFromColumn1ToColumn2',
    'dragFromColumn2ToColumn3', 
    'reorderInColumn1',
    'reorderInColumn2'
  ];
  
  let operationCount = 0;
  
  const performRandomOperation = () => {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    // Symuluj drag & drop operation
    operationCount++;
    
    if (operationCount % 100 === 0) {
      // Loguj zużycie pamięci co 100 operacji
      console.log(`Operations: ${operationCount}`);
      console.log(`Memory used: ${(performance as any).memory?.usedJSHeapSize || 'N/A'}`);
    }
  };
  
  const interval = setInterval(performRandomOperation, 100);
  
  setTimeout(() => {
    clearInterval(interval);
    console.log(`Stress test completed. Total operations: ${operationCount}`);
  }, duration);
};
```

## 📱 Krok 5: Testowanie na Różnych Urządzeniach

### **5.1 Chrome DevTools Device Simulation**

1. **Otwórz DevTools**
2. **Kliknij device toggle** (ikona telefonu)
3. **Wybierz różne urządzenia**:
   - iPhone SE (375px)
   - iPad (768px) 
   - Desktop (1920px)

### **5.2 Network Throttling**

1. **W DevTools → Network tab**
2. **Ustaw throttling**:
   - Slow 3G
   - Fast 3G
   - Offline

3. **Przetestuj responsywność** drag & drop

## 🎯 Krok 6: Analiza Bundle Size

### **6.1 Bundle Analyzer**

```bash
# Zbuduj aplikację
npm run build

# Analizuj bundle
npx webpack-bundle-analyzer dist/static/js/*.js
```

**🔍 Sprawdź:**
- Całkowity rozmiar < 500KB
- Główne dependencies
- Duplicate modules
- Unused imports

### **6.2 Performance Metrics**

```typescript
// utils/performanceMetrics.ts
export const trackPerformanceMetrics = () => {
  // Web Vitals
  import('web-vitals').then(({ getCLS, getFCP, getFID, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFCP(console.log);
    getFID(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
  
  // Custom metrics
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(entry);
      }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
};
```

## ✅ Benchmarki Wydajności

### **Oczekiwane wyniki dla różnych rozmiarów:**

| Liczba kart | Initial Render | Drag & Drop | Memory Usage | FPS podczas drag |
|------------|----------------|-------------|--------------|------------------|
| 50 kart    | < 200ms        | < 16ms      | < 10MB       | 60 FPS           |
| 100 kart   | < 400ms        | < 20ms      | < 20MB       | 55+ FPS          |
| 250 kart   | < 800ms        | < 30ms      | < 40MB       | 50+ FPS          |
| 500 kart   | < 1200ms       | < 50ms      | < 80MB       | 45+ FPS          |

### **Krytyczne progi:**
- **Bundle size** > 1MB = za duży
- **Initial render** > 2s = za wolny  
- **Drag latency** > 100ms = zauważalny lag
- **Memory growth** > 2MB/min = memory leak
- **FPS** < 30 = poor UX

## 🔧 Optymalizacje na Podstawie Testów

### **Jeśli wydajność jest niska:**

1. **Sprawdź czy używasz React.memo** dla wszystkich komponentów
2. **Zweryfikuj dependency arrays** w useCallback/useMemo
3. **Usuń niepotrzebne re-rendery** (Why Did You Render)
4. **Zoptymalizuj drag calculations** (debounce/throttle)
5. **Użyj virtualization** dla > 500 kart
6. **Rozważ code splitting** dla dużych bundle'ów

### **Monitoring w Production:**

```typescript
// Real User Monitoring
const sendMetrics = (metric: any) => {
  // Wyślij do analytics service
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
};

// Zbieraj metryki w produkcji
if (process.env.NODE_ENV === 'production') {
  trackPerformanceMetrics();
}
```

Ten przewodnik pomoże Ci systematycznie przetestować i zoptymalizować wydajność Twojej aplikacji KanbanUI! 🚀
