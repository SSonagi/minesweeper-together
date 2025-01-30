import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './actions';

export default configureStore({
    reducer: rootReducer,
  })