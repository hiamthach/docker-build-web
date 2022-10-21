import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";

import "./styles.scss";

import { useSelector, useDispatch } from "react-redux";

import ObjectItem from "../../components/ObjectItem";

import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  MiniMap,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  updateObjectThunk,
  updateEdgesThunk,
} from "../../redux/slices/objectSlice";

const initialEdges = [];

//Customize Node
const nodeColor = (node) => {
  switch (node.type) {
    case "ObjectItem":
      return "#1890ff";
    default:
      return "#eee";
  }
};

const edgeOptions = {
  animated: true,
  type: "straight",
  style: {
    stroke: "#1890ff",
  },
};

const connectionLineStyle = { stroke: "#1890ff" };

const ScreenCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState(initialEdges); // Edges đc hiểu là Connections

  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();
  const edgeUpdateSuccessful = useRef(true);

  const nodeTypes = useMemo(() => ({ ObjectItem: ObjectItem }), []);
  const { objectList } = useSelector((state) => state.objects);

  //Xử lý kéo thả node
  const onNodesChange = useCallback((changes) => {
    //Khi kéo xong sẽ thêm vào objectList trên Redux
    if (changes[0].dragging === false) {
      const node = reactFlowInstance.getNode(changes[0].id);
      dispatch(
        updateObjectThunk({
          id: node.id,
          position: node.position,
        })
      );
    }
    return setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);
  //Xử lý connection
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);
  const onConnect = useCallback((params) => {
    return setEdges((eds) => addEdge(params, eds));
  }, []);

  //Xử lý các connect
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  //Hàm in object ra màn hình
  const renderObject = (objectList) => {
    return objectList.map((object) => {
      return {
        id: object.id,
        data: {
          id: object.id,
          type: object.type,
          name: object.name,
          status: object.status,
          configure: object.configure,
          position: object.position,
        },
        position: object.position,
        type: "ObjectItem",
      };
    });
  };

  //Khi có sự thay đổi của danh sách object thì render lại object
  useEffect(() => {
    setNodes(renderObject(objectList));
  }, [objectList]);

  //Khi có sự thay đổi của các connection thì cập nhật lên store chung
  useEffect(() => {
    dispatch(updateEdgesThunk(edges));
  }, [edges]);

  return (
    <div className="screen-canvas">
      {/* Phần ReactFlow này có thể tham khảo thêm ở Link mình cập nhật ở trang README */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={edgeOptions}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        connectionMode="loose"
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
      >
        <Background variant="lines" color="#ccc" />
        <Controls />
        {/* MiniMap dưới góc phải */}
        <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
};

export default ScreenCanvas;
