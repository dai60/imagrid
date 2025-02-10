import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MontageContextProvider } from "./Montage";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MontageContextProvider>
            <App />
        </MontageContextProvider>
    </StrictMode>,
);
