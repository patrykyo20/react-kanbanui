# 📋 KanbanUI - React Kanban Board Component

## 🎯 Overview

KanbanUI is a high-performance, fully customizable React Kanban board component built with TypeScript. It features smooth drag-and-drop functionality, optimized rendering, and a clean, modern design.

## ✨ Features

- 🎨 **Modern Design** - Clean, responsive UI with Tailwind CSS
- 🚀 **High Performance** - Optimized with React.memo, useCallback, and useMemo
- 🎯 **Drag & Drop** - Smooth card reordering within and between columns
- 🔧 **Fully Customizable** - Override styles and behavior easily
- 📱 **Responsive** - Works perfectly on all screen sizes
- 🛡️ **Type Safe** - Built with TypeScript for better developer experience
- 🧪 **Well Tested** - Comprehensive error handling and validation
- ♿ **Accessible** - ARIA compliant and keyboard navigation support

## 🚀 Quick Start

### Installation

```bash
npm install kanbanui
# or
yarn add kanbanui
```

### Basic Usage

```tsx
import React, { useState } from 'react';
import { KanbanBoard, IKanbanColumn } from 'kanbanui';

const MyApp = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>([
    {
      id: "todo",
      title: "To Do",
      status: "todo",
      cards: [
        {
          id: "card-1",
          title: "Implement login",
          description: "Create user authentication system",
          priority: "high",
          status: "todo",
          assignee: "John Doe",
          tags: ["frontend", "auth"]
        }
      ]
    }
  ]);

  const handleColumnsChange = (newColumns: IKanbanColumn[]) => {
    setColumns(newColumns);
  };

  return (
    <KanbanBoard
      columns={columns}
      onColumnsChange={handleColumnsChange}
      columnHeight="600px"
    />
  );
};
```

## 📁 Documentation Structure

- [**API Reference**](./api/README.md) - Complete component API documentation
- [**Performance Guide**](./performance/README.md) - Step-by-step performance testing
- [**Components**](./components/README.md) - Individual component documentation
- [**Hooks**](./hooks/README.md) - Custom hooks reference
- [**Utils**](./utils/README.md) - Utility functions documentation
- [**Examples**](./examples/README.md) - Usage examples and patterns
- [**Migration Guide**](./migration/README.md) - Upgrading between versions
- [**Contributing**](./contributing/README.md) - Development guidelines

## 🎨 Styling

KanbanUI uses Tailwind CSS classes by default but can be fully customized:

```tsx
<KanbanBoard
  columns={columns}
  useOwnStyles={true}
  className="my-custom-board"
  columnHeight="700px"
/>
```

## 🔧 Advanced Configuration

### Column Limits

```tsx
const columns: IKanbanColumn[] = [
  {
    id: "in-progress",
    title: "In Progress",
    status: "in-progress",
    maxCards: 3, // Limit to 3 cards
    cards: []
  }
];
```

### Custom Card Components

```tsx
import { KanbanCard } from 'kanbanui';

const CustomCard = ({ card, ...props }) => (
  <KanbanCard
    {...props}
    card={card}
    className="custom-card-style"
  />
);
```

## 🎯 Performance

KanbanUI is optimized for performance with:
- React.memo for component memoization
- useCallback for stable function references  
- useMemo for expensive calculations
- Efficient drag state management
- Minimal re-renders during drag operations

See the [Performance Guide](./performance/README.md) for detailed testing instructions.

## 🐛 Error Handling

Built-in error boundary catches and handles errors gracefully:

```tsx
import { ErrorBoundary } from 'kanbanui';

<ErrorBoundary>
  <KanbanBoard columns={columns} />
</ErrorBoundary>
```

## 📦 Bundle Size

- **Minified**: ~45KB
- **Gzipped**: ~12KB
- **Dependencies**: React, React-DOM

## 🌟 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📄 License

MIT License - see [LICENSE.md](../LICENSE.md) for details.

## 🤝 Contributing

See [Contributing Guide](./contributing/README.md) for development setup and guidelines.

## 📞 Support

- 📚 [Documentation](./api/README.md)
- 🐛 [Issues](https://github.com/your-repo/kanbanui/issues)
- 💬 [Discussions](https://github.com/your-repo/kanbanui/discussions)
