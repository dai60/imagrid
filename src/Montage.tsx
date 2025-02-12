import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, PropsWithChildren, useReducer } from "react";

export type MontageImage = {
    url: string;
    img: HTMLImageElement;
}

type ElemSize = "contain" | "cover" | { width: number; height: number; };

type MontageState = {
    images: MontageImage[];
    gridSize: {
        rows: number;
        cols: number;
    };
    elemSize: ElemSize;
}

type MontageAction =
    | { type: "ADD_IMAGES"; images: MontageImage[]; }
    | { type: "REMOVE_IMAGE"; index: number; }
    | { type: "MOVE_IMAGE"; from: number; to: number; }
    | { type: "CHANGE_GRID_ROWS"; rows: number; }
    | { type: "CHANGE_GRID_COLS"; cols: number; }
    | { type: "CHANGE_ELEM_SIZE"; size: ElemSize; }

const montageReducer = (state: MontageState, action: MontageAction): MontageState => {
    switch (action.type) {
        case "ADD_IMAGES":
            const newImages = [...state.images, ...action.images];
            const prevCols = state.gridSize.cols;
            const newCols = Math.ceil(newImages.length / state.gridSize.rows);
            return { ...state, images: newImages, gridSize: { rows: state.gridSize.rows, cols: Math.max(prevCols, newCols) } };
        case "REMOVE_IMAGE":
            return { ...state, images: state.images.toSpliced(action.index, 1) };
        case "MOVE_IMAGE":
            return { ...state, images: arrayMove(state.images, action.from, action.to) };
        case "CHANGE_GRID_ROWS": {
            const newRows = action.rows;
            if (isNaN(newRows) || newRows <= 0) {
                return state;
            }

            const prevCols = state.gridSize.cols;
            const newCols = Math.ceil(state.images.length / newRows);
            return { ...state, gridSize: { rows: newRows, cols: Math.max(prevCols, newCols) } };
        }
        case "CHANGE_GRID_COLS": {
            const newCols = action.cols;
            if (isNaN(newCols) || newCols <= 0) {
                return state;
            }

            const prevRows = state.gridSize.rows;
            const newRows = Math.ceil(state.images.length / newCols);
            return { ...state, gridSize: { rows: Math.max(prevRows, newRows), cols: newCols } };
        }
        case "CHANGE_ELEM_SIZE":
            return { ...state, elemSize: action.size };
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

export const MontageContext = createContext<MontageContextProps | undefined>(undefined);

export const MontageContextProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(montageReducer, {
        images: [],
        gridSize: { rows: 1, cols: 1 },
        elemSize: "contain",
    });

    const [elemWidth, elemHeight] = state.images.length === 0 ? [0, 0] : (
        state.elemSize === "contain" ? [
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

const getElemSize = (images: MontageImage[], elemSize: ElemSize): [width: number, height: number] => {
    if (elemSize === "contain") {
        return [
            Math.max(...images.map(image => image.img.width)),
            Math.max(...images.map(image => image.img.height)),
        ];
    }
    else if (elemSize === "cover") {
        return [
            Math.min(...images.map(image => image.img.width)),
            Math.min(...images.map(image => image.img.height)),
        ];
    }
    else {
        return [elemSize.width, elemSize.height];
    }
}
