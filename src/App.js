import MainLayout from "./layout/main";
import "antd/dist/antd.min.css";
import "reactflow/dist/style.css";

import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <MainLayout />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
