import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Swal from "sweetalert2";
import JSZip from "jszip";
import FileSaver from "file-saver";

import {
  dockerfileTemplate,
  renderServiceTxt,
  serviceTemplate,
} from "../../utils";

const objectSlice = createSlice({
  name: "objectSlice",
  initialState: {
    status: "idle",
    objectList: [],
    edges: [], // Hiểu là connections
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteAllThunk.fulfilled, (state, action) => {
        state.objectList = [];
        state.edges = [];
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
      })
      .addCase(updateEdgesThunk.fulfilled, (state, { payload }) => {
        state.edges = payload;
      });
  },
});

export default objectSlice;

export const addObjectThunk = createAsyncThunk("object/add", async (data) => {
  return {
    ...data,
    position: {
      x: 100,
      y: 100,
    },
  };
});

export const updateObjectThunk = createAsyncThunk(
  "object/update",
  async (data, thunkAPI) => {
    const objectList = thunkAPI.getState().objects.objectList;

    const newList = [...objectList];

    //Tìm object cần cập nhật
    const findObject = newList.findIndex((object) => object.id === data.id);

    const newData = {
      ...newList[findObject],
      ...data,
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

export const updateEdgesThunk = createAsyncThunk(
  "object/updateEdges",
  async (data) => {
    return data.length > 0 ? data : [];
  }
);

export const exportThunk = createAsyncThunk(
  "objectSlice/exportThunk",
  async (data, thunkAPI) => {
    const objects = thunkAPI.getState().objects.objectList;
    const edges = thunkAPI.getState().objects.edges;
    console.log("Objects: ", objects);
    console.log("Connections: ", edges);
    const zip = new JSZip();
    //Ubuntu
    objects
      .filter((object) => object.configure.os === "ubuntu")
      .forEach((object) => {
        const zipFolder = zip.folder(`${object.name}`);
        zipFolder.file("dockerfile", dockerfileTemplate(object));
      });
    zip.file("service", renderServiceTxt(objects));
    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "docker.zip");
    });

    Swal.fire({
      title: "Export Success",
      icon: "success",
    });
    return data;
  }
);
