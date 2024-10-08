import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setTasks } from './tasksSlice';

export const fetchColumns = createAsyncThunk(
  'columns/fetchColumns',
  async (projectId, { dispatch }) => {
    console.log('Fetching columns for project:', projectId);
    const response = await fetch(`/api/projects/${projectId}/columns`);
    const data = await response.json();
    console.log('Fetched columns data:', data);

    const tasksMap = {};

    // Create an array of promises for fetching tasks
    const taskFetchPromises = data.map(async column => {
      tasksMap[column._id] = {};
      const taskPromises = column.tasks.map(async taskId => {
        const taskResponse = await fetch(
          `/api/projects/${projectId}/columns/${column._id}/tasks/${taskId}`,
        );
        const taskData = await taskResponse.json();
        return taskData;
      });
      const columnTasks = await Promise.all(taskPromises);
      columnTasks.flat().forEach(task => {
        tasksMap[column._id][task._id] = task;
      });
    });

    // Wait for all task fetching to complete
    await Promise.all(taskFetchPromises);

    console.log('Fetched tasks data:', tasksMap);

    // Flatten the tasksMap for the tasks slice
    const flattenedTasksMap = Object.values(tasksMap).reduce(
      (acc, columnTasks) => ({ ...acc, ...columnTasks }),
      {},
    );
    dispatch(setTasks(flattenedTasksMap));

    // Return both columns and tasks data
    return { columns: data, tasks: tasksMap };
  },
);

const columnsSlice = createSlice({
  name: 'columns',
  initialState: {},
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchColumns.fulfilled, (state, action) => {
      console.log('fetchColumns fulfilled, payload:', action.payload);
      const newState = {};
      action.payload.columns.forEach(column => {
        newState[column._id] = {
          ...column,
          taskIds: column.tasks,
        };
      });
      console.log('New columns state:', newState);
      return newState;
    });
  },
});

export default columnsSlice.reducer;
