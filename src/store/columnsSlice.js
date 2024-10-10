import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setTasks } from './tasksSlice';

export const fetchColumns = createAsyncThunk(
  'columns/fetchColumns',
  async (projectId, { dispatch }) => {
    const response = await fetch(`/api/projects/${projectId}/columns`);
    const columnsData = await response.json();

    const tasksMap = {};
    const columnTaskIds = {};

    // Fetch tasks for each column
    for (const column of columnsData) {
      const taskResponse = await fetch(
        `/api/projects/${projectId}/columns/${column._id}/tasks`,
      );
      const columnTasks = await taskResponse.json();

      columnTaskIds[column._id] = columnTasks.map(task => task._id);

      columnTasks.forEach(task => {
        tasksMap[task._id] = task;
      });
    }
    dispatch(setTasks(tasksMap));

    return { columns: columnsData, columnTaskIds };
  },
);

export const moveTaskBetweenColumns = createAsyncThunk(
    'columns/moveTaskBetweenColumns',
    async ({ projectId, taskId, sourceColumnId, destinationColumnId }, { dispatch }) => {
  
      // Then, refetch both source and destination columns
      const [sourceColumn, destinationColumn] = await Promise.all([
        fetch(`/api/projects/${projectId}/columns/${sourceColumnId}`).then(res => res.json()),
        fetch(`/api/projects/${projectId}/columns/${destinationColumnId}`).then(res => res.json()),
      ]);
  
      // Fetch tasks for both columns
      const [sourceTasks, destinationTasks] = await Promise.all([
        fetch(`/api/projects/${projectId}/columns/${sourceColumnId}/tasks`).then(res => res.json()),
        fetch(`/api/projects/${projectId}/columns/${destinationColumnId}/tasks`).then(res => res.json()),
      ]);
  
      // Update tasks in the store
      const tasksToUpdate = [...sourceTasks, ...destinationTasks];
      dispatch(setTasks(tasksToUpdate.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
      }, {})));
  
      // Return the updated columns
      return {
        [sourceColumnId]: { ...sourceColumn, taskIds: sourceTasks.map(task => task._id) },
        [destinationColumnId]: { ...destinationColumn, taskIds: destinationTasks.map(task => task._id) },
      };
    },
  );

const columnsSlice = createSlice({
  name: 'columns',
  initialState: {},
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchColumns.fulfilled, (state, action) => {
      const newState = {};
      action.payload.columns.forEach(column => {
        newState[column._id] = {
          ...column,
          taskIds: action.payload.columnTaskIds[column._id] || [],
        };
      });
      return newState;
    });
    builder.addCase(moveTaskBetweenColumns.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export default columnsSlice.reducer;
