import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {},
  reducers: {
    addTask: (state, action) => {
      console.log('Adding task:', action.payload);
      const task = action.payload;
      if (task && task._id) {
        state[task._id] = task;
      } else {
        console.error('Attempted to add invalid task:', task);
      }
    },
    setTasks: (state, action) => {
      console.log('Setting tasks:', action.payload);
      return action.payload;
    }
  },
});

export const { addTask, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;