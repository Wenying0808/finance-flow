
import { configureStore } from '@reduxjs/toolkit';
import  summaryReducer  from './reducers';

const store = configureStore({
  reducer: {
    summary: summaryReducer,
  },

});

export default store;
