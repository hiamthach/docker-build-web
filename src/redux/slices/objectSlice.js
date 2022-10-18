import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const objectSlice = createSlice({
  name: "objectSlice",
  initialState: {
    status: "idle",
    objectList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteAllThunk.fulfilled, (state, action) => {
        state.objectList = [];
      })
      .addCase(addObjectThunk.fulfilled, (state, { payload }) => {
        state.objectList.push(payload);
      })
      .addCase(deleteObjectThunk.fulfilled, (state, { payload }) => {
        state.objectList = state.objectList.filter(
          (object) => object.id !== payload
        );
      })
      .addCase(updateObjectThunk.fulfilled, (state, { payload }) => {
        state.objectList = payload;
      });
  },
});

export default objectSlice;

export const addObjectThunk = createAsyncThunk("object/add", async (data) => {
  return data;
});

export const updateObjectThunk = createAsyncThunk(
  "object/update",
  async (data, thunkAPI) => {
    const objectList = thunkAPI.getState().objects.objectList;

    const newList = [...objectList];

    const findObject = newList.findIndex((object) => object.id === data.id);

    const newData = {
      ...newList[findObject],
      configure: data.configure,
    };

    newList[findObject] = newData;

    return newList;
  }
);

export const deleteObjectThunk = createAsyncThunk("object/delete", (id) => {
  return id;
});

export const deleteAllThunk = createAsyncThunk(
  "objectSlice/deleteAll",
  (data) => {
    return data;
  }
);

export const exportThunk = createAsyncThunk(
  "objectSlice/exportThunk",
  async (data, thunkAPI) => {
    const objects = thunkAPI.getState().objects.objectList;
    console.log(objects);
    return data;
  }
);
