import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Suspense, lazy, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import { useAuthStore } from "./store/authStore";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Analytics = lazy(() => import("./pages/Analytics"));
const WorkflowBuilder = lazy(() => import("./pages/WorkflowBuilder"));
const TestingLab = lazy(() => import("./pages/TestingLab"));
const Team = lazy(() => import("./pages/Team"));
const Billing = lazy(() => import("./pages/Billing"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-void-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
    </div>
  );
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          className: "glass-strong !text-slate-100 !border-white/10",
        }}
      />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="workflows" element={<WorkflowBuilder />} />
            <Route path="testing-lab" element={<TestingLab />} />
            <Route path="team" element={<Team />} />
            <Route path="billing" element={<Billing />} />
            <Route path="assistant" element={<AIAssistant />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
