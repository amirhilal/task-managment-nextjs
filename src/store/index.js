import { configureStore } from '@reduxjs/toolkit';
import columnsReducer from './columnsSlice';
import tasksReducer from './tasksSlice';

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
  },
});