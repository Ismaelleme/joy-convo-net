import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useThemeStore } from "./store/themeStore";

// Apply saved theme on startup
useThemeStore.getState().applyTheme();

createRoot(document.getElementById("root")!).render(<App />);
