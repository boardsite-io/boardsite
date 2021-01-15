import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer.js';

export default configureStore({ reducer: rootReducer });
