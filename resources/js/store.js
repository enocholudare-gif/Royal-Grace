import { configureStore } from '@reduxjs/toolkit';

// Placeholder slice – you will add real slices for each domain later
const placeholderSlice = {
  name: 'placeholder',
  initialState: {},
  reducers: {},
};

export const store = configureStore({
  reducer: {
    placeholder: (state = {}, action) => state,
  },
});
