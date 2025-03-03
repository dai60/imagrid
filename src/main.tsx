import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MontageContextProvider } from "./Montage";
import App from "./App";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MontageContextProvider>
            <App />
        </MontageContextProvider>
    </StrictMode>,
);
