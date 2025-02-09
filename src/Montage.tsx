import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from "react";

type MontageState = {
    images: string[];
    elementWidth: number;
    elementHeight: number;
}

type MontageAction =
    | { type: "ADD_IMAGES"; images: string[]; }
    | { type: "MOVE_IMAGE", from: number; to: number; }
    | { type: "CHANGE_WIDTH"; width: number; }
    | { type: "CHANGE_HEIGHT"; height: number; }

const montageReducer = (state: MontageState, action: MontageAction): MontageState => {
    switch (action.type) {
        case "ADD_IMAGES":
            return { ...state, images: [...state.images, ...action.images] };
        case "MOVE_IMAGE":
            return { ...state, images: arrayMove(state.images, action.from, action.to) }
        case "CHANGE_WIDTH":
            return { ...state, elementWidth: action.width };
        case "CHANGE_HEIGHT":
            return { ...state, elementHeight: action.height };
        default:
            return state;
    }
}

type MontageContextProps = {
    state: MontageState,
    dispatch: Dispatch<MontageAction>;
}

const MontageContext = createContext<MontageContextProps | undefined>(undefined);

export const MontageContextProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(montageReducer, { images: [], elementWidth: 0, elementHeight: 0 });

    return (
        <MontageContext.Provider value={{ state, dispatch }}>
            {children}
        </MontageContext.Provider>
    );
}

export const useMontage = () => {
    const context = useContext(MontageContext);
    if (!context) {
        throw new Error("useMontageContext must be used within a MontageContextProvider");
    }
    return context;
}
