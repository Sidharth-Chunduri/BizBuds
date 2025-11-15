import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { textClickHandler } from "@/lib/text-click-handler";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Join from "@/pages/Join";
import SignIn from "@/pages/SignIn";
import Schedule from "@/pages/Schedule";
import Resources from "@/pages/Resources";
import Explore from "@/pages/Explore";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/join" component={Join} />
      <Route path="/signin" component={SignIn} />
      <Route path="/dashboard" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/schedule" component={() => <ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/resources" component={() => <ProtectedRoute><Resources /></ProtectedRoute>} />
      <Route path="/explore" component={() => <ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize text-to-speech click handler
    textClickHandler.initialize();
    
    return () => {
      textClickHandler.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
