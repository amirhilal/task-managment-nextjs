import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  FaCalendar,
  FaSpinner,
  FaCheckCircle,
  FaTasks,
  FaFlag,
  FaUser,
  FaPlus,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColumns, moveTaskBetweenColumns } from '../../store/columnsSlice';
import { addTask } from '../../store/tasksSlice';
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
} from '../../socket/client';

import ReactConfetti from 'react-confetti';

export default function Dashboard() {
  const dispatch = useDispatch();
  const columns = useSelector(state => state.columns);
  const tasks = useSelector(state => state.tasks);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState(null);
  const [newTask, setNewTask] = useState({
    content: '',
    priority: 'low',
    assignee: '',
    dueDate: '',
  });

  useEffect(() => {
    const socket = initializeSocket();

    dispatch(fetchColumns('6702efdcb9fafdb07a64380d'));

    socket.on('taskMoved', handleTaskMoved);
    socket.on('newTask', handleNewTask);

    return () => {
      socket.off('taskMoved', handleTaskMoved);
      socket.off('newTask', handleNewTask);
      disconnectSocket();
    };
  }, [dispatch]);

  const handleTaskMoved = useCallback(
    ({ taskId, sourceColumnId, destinationColumnId, newIndex }) => {
    dispatch(moveTaskBetweenColumns({
        projectId: '6702efdcb9fafdb07a64380d',
        taskId: taskId,
        sourceColumnId: sourceColumnId,
        destinationColumnId: destinationColumnId,
        }));
    },
    [columns, dispatch],
  );

  const handleNewTask = useCallback(
    task => {
      dispatch(addTask(task));
    },
    [columns, dispatch],
  );

  const handleAddTask = columnId => {
    setNewTaskColumn(columnId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewTask({ content: '', priority: 'low', assignee: '', dueDate: '' });
  };

  const handleNewTaskSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, columnId: newTaskColumn }),
    });
    const createdTask = await response.json();
    const newTaskId = createdTask.id;

    const updatedColumns = {
      ...columns,
      [newTaskColumn]: {
        ...columns[newTaskColumn],
        taskIds: [...columns[newTaskColumn].taskIds, newTaskId],
      },
    };
    dispatch(addTask({ id: createdTask._id, task: createdTask }));

    getSocket().emit('newTask', createdTask);
    handleModalClose();
  };

  const onDragEnd = useCallback(
    async result => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const start = columns[source.droppableId];
      const finish = columns[destination.droppableId];

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
      } else {
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
          ...start,
          taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
          ...finish,
          taskIds: finishTaskIds,
        };

        getSocket().emit('taskMoved', {
          taskId: draggableId,
          sourceColumnId: source.droppableId,
          destinationColumnId: destination.droppableId,
          newIndex: destination.index,
        });

        // Update task's column in the backend
        await fetch(`/api/tasks/${draggableId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columnId: destination.droppableId }),
        });

        dispatch(moveTaskBetweenColumns({
            projectId: '6702efdcb9fafdb07a64380d', // Replace with your actual project ID
            taskId: draggableId,
            sourceColumnId: source.droppableId,
            destinationColumnId: destination.droppableId,
        }));

        if (destination.droppableId === 'done') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 2 seconds
        }
      }
    },
    [columns, dispatch],
  );

  function getColumnColor(columnId) {
    const colors = {
      todo: '#3B82F6', // blue
      inProgress: '#F59E0B', // yellow
      done: '#10B981', // green
    };
    return colors[columnId] || '#9CA3AF'; // default to gray
  }

  function getColumnIcon(columnId) {
    switch (columnId) {
      case 'todo':
        return <FaTasks className="text-blue-500" />;
      case 'inProgress':
        return <FaSpinner className="text-yellow-500" />;
      case 'done':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {showConfetti && <ReactConfetti />}
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
          <ul className="mt-4 space-y-2">
            <li className="text-blue-600 font-medium">Project Alpha</li>
            <li className="text-gray-600 hover:text-blue-600">Project Beta</li>
            <li className="text-gray-600 hover:text-blue-600">Project Gamma</li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Project Alpha Board
            </h1>
          </div>
        </header>

        {/* Board */}
        <main className="flex-1 overflow-x-auto py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-6">
                {Object.values(columns).map(column => (
                  <div
                    key={column._id}
                    className="bg-white p-4 rounded-lg shadow-md min-h-screen w-80 bg-gradient-to-br from-gray-100 to-gray-200"
                  >
                    <h2
                      className="font-bold text-xl mb-4 text-gray-700 flex items-center border-b-4 pb-2"
                      style={{ borderColor: getColumnColor(column._id) }}
                    >
                      {getColumnIcon(column._id)}
                      <span className="ml-2">{column.title}</span>
                    </h2>
                    <Droppable droppableId={column._id}>
                      {provided => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="min-h-[200px]"
                        >
                          {column.taskIds.map((taskId, index) => {
                            const task = tasks[taskId];
                            if (!task) {
                              console.log(`Task not found for id: ${taskId}`);
                              return null; // Skip rendering if task is not found
                            }
                            return (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-gray-50 p-4 mb-3 rounded-md shadow-sm border border-gray-200
                                                                                                          ${snapshot.isDragging ? 'bg-blue-50 shadow-md' : ''}
                                                                                                          hover:bg-gray-100 transition-colors duration-150`}
                                  >
                                    <p className="text-gray-800 font-medium mb-2">
                                      {task.content}
                                    </p>
                                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2">
                                      <div className="flex items-center mr-4 mb-2">
                                        <FaFlag
                                          className={`mr-1 ${getPriorityColor(task.priority)}`}
                                        />
                                        <span className="capitalize">
                                          {task.priority}
                                        </span>
                                      </div>
                                      <div className="flex items-center mr-4 mb-2">
                                        <FaUser className="mr-1 text-gray-400" />
                                        <span
                                          className="truncate max-w-[100px]"
                                          title={task.assignee}
                                        >
                                          {task.assignee}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-2">
                                        <FaCalendar className="mr-1 text-gray-400" />
                                        <span>{task.dueDate}</span>
                                      </div>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    {column._id !== 'done' && (
                      <button
                        onClick={() => handleAddTask(column.id)}
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                      >
                        <FaPlus className="mr-2" /> Add Task
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </DragDropContext>

            {showModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                  <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
                  <form onSubmit={handleNewTaskSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="content"
                      >
                        Task Content
                      </label>
                      <input
                        type="hidden"
                        id="columnId"
                        value={newTaskColumn}
                      />
                      <input
                        type="text"
                        id="content"
                        value={newTask.content}
                        onChange={e =>
                          setNewTask({ ...newTask, content: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="priority"
                      >
                        Priority
                      </label>
                      <select
                        id="priority"
                        value={newTask.priority}
                        onChange={e =>
                          setNewTask({ ...newTask, priority: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="assignee"
                      >
                        Assignee
                      </label>
                      <input
                        type="text"
                        id="assignee"
                        value={newTask.assignee}
                        onChange={e =>
                          setNewTask({ ...newTask, assignee: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="dueDate"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        value={newTask.dueDate}
                        onChange={e =>
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Add Task
                      </button>
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
