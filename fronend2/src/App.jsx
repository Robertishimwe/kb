import { Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from './components/protectedRoute';
import Login from "./pages/Login";

import "./App.css";

import AddKBEntry from "./pages/AddKb";
import KnowledgeBaseList from "./pages/KbList";

function App() {
  return (
    <GoogleOAuthProvider clientId="956893850820-37naqqfh2lmeusq5vnqeulb7csskb2kc.apps.googleusercontent.com">
      <Routes>
        <Route path="/" element={<ProtectedRoute><KnowledgeBaseList /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute> <AddKBEntry /></ProtectedRoute>} />
        <Route path="/articles" element={<ProtectedRoute> <KnowledgeBaseList /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
