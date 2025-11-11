import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RoutesPage from "./adapters/ui/RoutesPage";
import ComparePage from "./adapters/ui/ComparePage";
import BankingPage from "./adapters/ui/BankingPage";
import PoolingPage from "./adapters/ui/PoolingPage";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<RoutesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/banking" element={<BankingPage />} />
          <Route path="/pooling" element={<PoolingPage />} />
        </Routes>
      </main>
    </div>
  );
}
