import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Simulator from "@/pages/simulator";
import Advisory from "@/pages/advisory";
import Map from "@/pages/map";
import PatientJourney from "@/pages/patient-journey";
import ARVision from "@/pages/ar-vision";
import Social from "@/pages/social";
import Telemedicine from "@/pages/telemedicine";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home">
        <ProtectedRoute><Home /></ProtectedRoute>
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/simulator">
        <ProtectedRoute><Simulator /></ProtectedRoute>
      </Route>
      <Route path="/advisory">
        <ProtectedRoute><Advisory /></ProtectedRoute>
      </Route>
      <Route path="/map">
        <ProtectedRoute><Map /></ProtectedRoute>
      </Route>
      <Route path="/patient-journey">
        <ProtectedRoute><PatientJourney /></ProtectedRoute>
      </Route>
      <Route path="/ar-vision">
        <ProtectedRoute><ARVision /></ProtectedRoute>
      </Route>
      <Route path="/social">
        <ProtectedRoute><Social /></ProtectedRoute>
      </Route>
      <Route path="/telemedicine">
        <ProtectedRoute><Telemedicine /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
