# TeamSync - Real-time Collaborative Task Management System

A production-ready MERN stack application for team task management with real-time collaboration features.

## 🚀 Tech Stack

### Frontend
- **React 18** + Vite for fast development
- **TailwindCSS** for styling
- **Socket.io-client** for real-time updates
- **Zustand** for state management
- **@dnd-kit** for drag-and-drop Kanban board
- **Lucide React** for icons
- **Axios** for API calls
- **date-fns** for date formatting

### Backend
- **Node.js** + Express.js
- **MongoDB** + Mongoose ODM
- **Socket.io** for WebSockets
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security
- **express-rate-limit** for rate limiting

## ✨ Features

1. **User Authentication** - JWT-based secure login/register
2. **Task CRUD Operations** - Create, read, update, delete tasks with filtering
3. **Real-time Updates** - Live task updates via WebSockets
4. **Kanban Board** - Drag-and-drop task management
5. **Online User Presence** - See who's online in real-time
6. **Priority & Status** - Organize tasks by priority (high/medium/low) and status (todo/in-progress/done)
7. **Due Date Tracking** - Set and track task deadlines with overdue indicators
8. **Task Assignment** - Assign tasks to team members

## 📦 Project Structure

```
teamsync/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   ├── socket/
│   │   └── socketHandler.js   # Socket.io event handlers
│   ├── server.js              # Express server entry
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   ├── TaskList.jsx
│   │   │   │   └── TaskFilters.jsx
│   │   │   ├── kanban/
│   │   │   │   ├── KanbanBoard.jsx
│   │   │   │   ├── KanbanColumn.jsx
│   │   │   │   └── KanbanTaskCard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── OnlineUsers.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js   # Socket.io hook
│   │   ├── store/
│   │   │   ├── authStore.js   # Auth state
│   │   │   └── taskStore.js   # Task state
│   │   ├── utils/
│   │   │   ├── api.js         # Axios configuration
│   │   │   └── socket.js      # Socket.io client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd teamsync
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   Create a `.env` file in the backend folder:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/teamsync
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   CLIENT_URL=http://localhost:5173
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   Create a `.env` file in the frontend folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:5173

## 🔒 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/users` | Get all users | Yes |

### User Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PUT | `/api/users/profile` | Update profile (name, email, avatar) | Yes |
| PUT | `/api/users/password` | Change password | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks (with filters & pagination) | Yes |
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/stats` | Get task statistics & weekly productivity | Yes |
| GET | `/api/tasks/:id` | Get task by ID | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks/:id/comments` | Add comment to task | Yes |
| DELETE | `/api/tasks/:id/comments/:commentId` | Delete comment | Yes |

### Attachments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks/:id/attachments` | Upload attachment (multipart) | Yes |
| DELETE | `/api/tasks/:id/attachments/:attachmentId` | Delete attachment | Yes |

### Timer
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks/:id/timer/start` | Start task timer | Yes |
| POST | `/api/tasks/:id/timer/stop` | Stop timer & log time | Yes |

### Time Logs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/timelogs` | Get time logs (with filters & pagination) | Yes |
| GET | `/api/timelogs/summary` | Get daily aggregated summary | Yes |
| DELETE | `/api/timelogs/:id` | Delete a time log entry | Yes |

### Activity Feed
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activities` | Get recent activity feed | Yes |
| GET | `/api/activities/task/:taskId` | Get activities for a task | Yes |

## 🔴 Socket.io Events

### Client to Server
- `task:create` - Notify others of new task
- `task:update` - Notify others of task update
- `task:delete` - Notify others of task deletion
- `join:task` - Join task-specific room
- `leave:task` - Leave task-specific room
- `user:typing` - Typing indicator for task details

### Server to Client
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `users:online` - Updated online users list
- `user:status` - User online/offline status change
- `user:typing` - User typing indicator

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Import project to Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy

## 📝 License

MIT

---

Built with ❤️ using the MERN Stack
