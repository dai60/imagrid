import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, PropsWithChildren, useMemo, useReducer } from "react";

export type MontageImage = {
    url: string;
    img: HTMLImageElement;
}

export type ElemSize = "min" | "max";

export type ObjectFit = "cover" | "contain";

type MontageState = {
    images: MontageImage[];
    gridRows: number;
    gridCols: number;
    maxGridRows: number;
    maxGridCols: number;
    elemSize: ElemSize;
    imageFit: ObjectFit;
}

type MontageAction =
    | { type: "ADD_IMAGES"; images: MontageImage[]; }
    | { type: "REMOVE_IMAGE"; index: number; }
    | { type: "MOVE_IMAGE"; from: number; to: number; }
    | { type: "CHANGE_GRID_ROWS"; rows: number; }
    | { type: "CHANGE_GRID_COLS"; cols: number; }
    | { type: "CHANGE_ELEM_SIZE"; size: ElemSize; }
    | { type: "CHANGE_IMAGE_FIT"; fit: ObjectFit; }

const montageReducer = (state: MontageState, action: MontageAction): MontageState => {
    switch (action.type) {
        case "ADD_IMAGES":
            const newImages = [...state.images, ...action.images];
            const prevCols = state.gridCols;
            const newCols = Math.ceil(newImages.length / state.gridRows);
            return { ...state, images: newImages, gridCols: Math.max(prevCols, newCols) };
        case "REMOVE_IMAGE":
            return { ...state, images: state.images.toSpliced(action.index, 1) };
        case "MOVE_IMAGE":
            return { ...state, images: arrayMove(state.images, action.from, action.to) };
        case "CHANGE_GRID_ROWS": {
            const newRows = action.rows;
            if (isNaN(newRows) || newRows <= 0) {
                return state;
            }

            const prevCols = state.gridCols;
            const newCols = Math.ceil(state.images.length / newRows);
            return { ...state, gridCols: Math.max(prevCols, newCols), gridRows: newRows };
        }
        case "CHANGE_GRID_COLS": {
            const newCols = action.cols;
            if (isNaN(newCols) || newCols <= 0) {
                return state;
            }

            const prevRows = state.gridRows;
            const newRows = Math.ceil(state.images.length / newCols);
            return { ...state, gridRows: Math.max(prevRows, newRows), gridCols: newCols };
        }
        case "CHANGE_ELEM_SIZE":
            return { ...state, elemSize: action.size };
        case "CHANGE_IMAGE_FIT":
            return { ...state, imageFit: action.fit };
        default:
            return state;
    }
}

export type MontageContextProps = {
    state: MontageState,
    dispatch: Dispatch<MontageAction>;
    elemWidth: number;
    elemHeight: number;
}

export const MontageContext = createContext<MontageContextProps | undefined>(undefined);

export const MontageContextProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(montageReducer, {
        images: [],
        gridRows: 1,
        gridCols: 1,
        maxGridCols: 12,
        maxGridRows: 12,
        elemSize: "max",
        imageFit: "cover",
    });

    const [elemWidth, elemHeight] = useMemo(
        () => getElemSize(state.images, state.elemSize),
        [state.images, state.elemSize],
    );

    return (
        <MontageContext.Provider value={{ state, dispatch, elemWidth, elemHeight }}>
            {children}
        </MontageContext.Provider>
    );
}

const getElemSize = (images: MontageImage[], elemSize: ElemSize): [width: number, height: number] => {
    if (images.length === 0) {
        return [0, 0];
    }

    if (elemSize === "max") {
        return [
            Math.max(...images.map(image => image.img.width)),
            Math.max(...images.map(image => image.img.height)),
        ];
    }
    else {
        return [
            Math.min(...images.map(image => image.img.width)),
            Math.min(...images.map(image => image.img.height)),
        ];
    }
}
