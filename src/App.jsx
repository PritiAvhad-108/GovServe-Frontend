import { Routes, Route, Navigate } from "react-router-dom";
import SupervisorRoutes from "./routes/Supervisorroutes";
import AdminRoutes from "./routes/Adminroutes";

function App() {
  return (
    <Routes>
      {/* Supervisor */}
      <Route path="/supervisor/*" element={<SupervisorRoutes />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/supervisor/dashboard" />} />
    </Routes>
  );
}

export default App;




