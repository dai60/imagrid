import { useContext } from "react";
import { MontageContext } from "../Montage";

const useMontage = () => {
    const context = useContext(MontageContext);
    if (!context) {
        throw new Error("useMontageContext must be used within a MontageContextProvider");
    }
    return context;
}

export default useMontage;
