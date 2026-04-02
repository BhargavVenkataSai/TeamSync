// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// Pattern: RESTful API, JWT Auth, Socket.io, Zustand
// Style: ES6+, async/await, functional React with hooks
// File: Draggable Kanban task card alias component

import KanbanTaskCard from './KanbanTaskCard';

const TaskCard = ({ task, onClick }) => {
  return <KanbanTaskCard task={task} onClick={onClick} />;
};

export default TaskCard;
