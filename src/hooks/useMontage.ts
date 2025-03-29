import { useContext } from "react";
import { MontageContext, MontageContextProps } from "../Montage";

const useMontage = (): MontageContextProps => {
    const context = useContext(MontageContext);
    if (!context) {
        throw new Error("useMontageContext must be used within a MontageContextProvider");
    }
    return context;
};

export default useMontage;
