import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import './App.css';
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* Sidebar component */}
      <Sidebar />
    </BrowserRouter>
   
  );
}

export default App;
