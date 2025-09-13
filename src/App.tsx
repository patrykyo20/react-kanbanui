import "./App.css";
import { useState } from "react";
import { KanbanBoard, IKanbanColumn } from "./components";

const customColumns: IKanbanColumn[] = [
  {
    id: "col-1",
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
        tags: ["frontend", "auth"],
      },
      {
        id: "card-2",
        title: "Design dashboard",
        description: "Create admin dashboard layout",
        priority: "medium",
        status: "todo",
        assignee: "Jane Smith",
        tags: ["design", "ui"],
      },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    status: "in-progress",
    cards: [
      {
        id: "card-3",
        title: "API integration",
        description: "Connect frontend with backend API",
        priority: "high",
        status: "in-progress",
        assignee: "Mike Johnson",
        tags: ["backend", "api"],
      },
    ],
  },
  {
    id: "col-3",
    title: "Review",
    status: "review",
    cards: [
      {
        id: "card-4",
        title: "Unit tests",
        description: "Write tests for components",
        priority: "medium",
        status: "review",
        assignee: "Sarah Wilson",
        tags: ["testing", "quality"],
      },
    ],
  },
  {
    id: "col-4",
    title: "Done",
    status: "done",
    cards: [
      {
        id: "card-5",
        title: "Project setup",
        description: "Initialize project structure",
        priority: "low",
        status: "done",
        assignee: "John Doe",
        tags: ["setup", "config"],
      },
    ],
  },
];

function App() {
  const [columns, setColumns] = useState<IKanbanColumn[]>(customColumns);

  const handleColumnsChange = (newColumns: IKanbanColumn[]) => {
    setColumns(newColumns);
  };

  return (
    <div className="App">
      <KanbanBoard
        columns={columns}
        useOwnStyles={false}
        columnHeight="700px"
        onColumnsChange={handleColumnsChange}
      />
    </div>
  );
}

export default App;
