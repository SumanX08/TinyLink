import { Routes, Route, } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Stats from "./Pages/Stats";


function App() {

  return (
   <div>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/code/:code' element={<Stats/>}/>
    </Routes>
   </div>
  )
}

export default App
