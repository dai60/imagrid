import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n";
import "./index.css";
import { MontageContextProvider } from "./Montage";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MontageContextProvider>
            <App />
        </MontageContextProvider>
    </StrictMode>,
);
