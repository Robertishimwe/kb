import { Route, Routes, Navigate } from "react-router-dom";
import './App.css'

import AddKBEntry from './pages/AddKb'
import KnowledgeBaseList from './pages/KbList'

function App() {

  return (
    <Routes>
      <Route path="/" element={<KnowledgeBaseList />} />
      <Route path="/add" element={<AddKBEntry />} />
      <Route path="/articles" element={<KnowledgeBaseList />} />
    </Routes>
  )
}

export default App
