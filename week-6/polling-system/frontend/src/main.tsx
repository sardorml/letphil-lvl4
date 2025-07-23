import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { EmailPasswordAuth } from "./components/AuthForm.tsx";
import PollsPage from "./pages/PollsPage.tsx";
import PollPage from "./pages/PollPage.tsx";
import { Navigation } from "./components/Navigation.tsx";
import { Toaster } from "@/components/ui/sonner";
import { LoginForm } from "./pages/LoginPage.tsx";
import { RegisterForm } from "./pages/RegisterPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/poll/:id" element={<PollPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
