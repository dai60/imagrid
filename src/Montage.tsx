import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from "react";

export type MontageImage = {
    url: string;
    img: HTMLImageElement;
}

type MontageState = {
    images: MontageImage[];
    gridSize: {
        rows: number;
        cols: number;
    };
    elemSize: "max" | "min";
}

type MontageAction =
    | { type: "ADD_IMAGES"; images: MontageImage[]; }
    | { type: "REMOVE_IMAGE"; index: number; }
    | { type: "MOVE_IMAGE"; from: number; to: number; }
    | { type: "CHANGE_GRID_ROWS"; rows: number; }
    | { type: "CHANGE_GRID_COLS"; cols: number; }

const montageReducer = (state: MontageState, action: MontageAction): MontageState => {
    switch (action.type) {
        case "ADD_IMAGES":
            return { ...state, images: [...state.images, ...action.images] };
        case "REMOVE_IMAGE":
            return { ...state, images: state.images.toSpliced(action.index, 1) };
        case "MOVE_IMAGE":
            return { ...state, images: arrayMove(state.images, action.from, action.to) };
        case "CHANGE_GRID_ROWS": {
            const newRows = action.rows;
            const prevCols = state.gridSize.cols;
            const newCols = Math.ceil(state.images.length / newRows);
            return { ...state, gridSize: { rows: newRows, cols: Math.max(prevCols, newCols) } };
        }
        case "CHANGE_GRID_COLS": {
            const newCols = action.cols;
            const prevRows = state.gridSize.rows;
            const newRows = Math.ceil(state.images.length / newCols);
            return { ...state, gridSize: { rows: Math.max(prevRows, newRows), cols: newCols } };
        }
        default:
            return state;
    }
}

type MontageContextProps = {
    state: MontageState,
    dispatch: Dispatch<MontageAction>;
    elemWidth: number;
    elemHeight: number;
}

const MontageContext = createContext<MontageContextProps | undefined>(undefined);

export const MontageContextProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(montageReducer, {
        images: [],
        gridSize: {
            rows: 1,
            cols: 1,
        },
        elemSize: "max",
    });

    const [elemWidth, elemHeight] = state.images.length === 0 ? [0, 0] : (
        state.elemSize === "max" ? [
            Math.max(...state.images.map(image => image.img.width)),
            Math.max(...state.images.map(image => image.img.height)),
        ] : [
            Math.min(...state.images.map(image => image.img.width)),
            Math.min(...state.images.map(image => image.img.height)),
        ]
    );

    return (
        <MontageContext.Provider value={{ state, dispatch, elemWidth, elemHeight }}>
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
