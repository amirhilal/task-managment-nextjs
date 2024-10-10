# Taski-Man Project

## Overview
Taski-Man is a task management application that allows users to organize tasks into columns and move them between columns using a drag-and-drop interface. It's built with a React frontend and a Node.js backend, using MongoDB as the database.

- *This project is part of an ongoing initiative to develop and implement full-stack web applications utilizing different frameworks and libraries*

- *Future projects will explore additional frameworks and libraries, further expanding the scope and depth of my own full-stack development expertise.*

## Technical Stack
- Frontend: React.js with Redux for state management
- Backend: Node.js with Next.js
- Database: MongoDB 
- State Management: Redux with Redux Toolkit 
- Drag and Drop: @hello-pangea/dnd library

## Key Features
1. Drag and drop tasks between columns
2. Real-time updates of task positions
3. Persistent storage of task and column data

## API Documentation

### Columns API

#### GET /api/projects/:projectId/columns
- Description: Fetches all columns for a specific project
- Response: Array of column objects

#### GET /api/projects/:projectId/columns/:columnId
- Description: Fetches a specific column
- Response: Column object

#### PUT /api/projects/:projectId/columns/:columnId
- Description: Updates a specific column
- Request Body: Column update object
- Response: Updated column object

### Tasks API

#### GET /api/projects/:projectId/columns/:columnId/tasks
- Description: Fetches all tasks for a specific column
- Response: Array of task objects

#### PUT /api/projects/:projectId/tasks/:taskId
- Description: Updates a specific task
- Request Body: Task update object
- Response: Updated task object

## State Management
The application uses Redux for state management. The state is divided into two main slices:

1. `columnsSlice`: Manages the state of columns
2. `tasksSlice`: Manages the state of tasks

## Drag and Drop Functionality
The drag and drop functionality is implemented using the @hello-pangea/dnd library. The `onDragEnd` function in the Dashboard component handles the logic for updating the state and the backend when a task is moved.

## Potential Bugs
1. Race conditions may occur if multiple users are moving tasks simultaneously.
2. The application may not handle network errors gracefully, potentially leading to inconsistent state between the frontend and backend.
3. Large numbers of tasks or columns may lead to performance issues.

## TODOs
1. Cotinue working on user authentication and authorization.
2. Add better error handling for failed API calls.
3. Add unit and integration tests for both frontend and backend.
4. Optimize performance for large datasets.
5. Implement a caching strategy to reduce API calls.
6. Fix the ability to create and delete columns and tasks.
7. Implement sorting and filtering options for tasks.
8. Implement a search functionality across all tasks.

## Setup and Installation

# Environment Variables
Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=<your-mongodb-uri>
```

# Install Dependencies
```
npm install
```

# Run the Development Server
```
npm run dev
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.

# What is MIT License?

The MIT License is a permissive license, which means that it does not impose any restrictions on the use of the software. Users are free to use, modify, and distribute the software without any limitations. The only requirement is that the copyright notice and license text must be preserved in any copies or derivative works of the software.

Which means, users are free to use, modify, and distribute the software **without any limitations**.

