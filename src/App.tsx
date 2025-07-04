import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateSmartlink from './pages/CreateSmartlink';
import EditSmartlink from './pages/EditSmartlink';
import SmartlinkPage from './pages/SmartlinkPage';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateSmartlink />} />
          <Route path="/edit/:id" element={<EditSmartlink />} />
          <Route path="/smartlink/:id" element={<SmartlinkPage />} />
          <Route path="/landing/:id" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
