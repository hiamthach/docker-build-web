import { configureStore } from "@reduxjs/toolkit";

import objectSlice from "./slices/objectSlice";

const store = configureStore({
  reducer: {
    objects: objectSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
