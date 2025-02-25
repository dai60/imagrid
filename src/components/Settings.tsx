import { ChangeEventHandler, useId } from "react";
import useMontage from "../hooks/useMontage";
import { MdAdd as Add, MdRemove as Remove } from "react-icons/md";

type CounterEventHandler = (change: number) => void;

type CounterProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: CounterEventHandler;
}

const Counter = ({ label, value, min, max, onChange }: CounterProps) => {
    const id = useId();

    const isMin = value === min;
    const isMax = value === max;

    return (
        <>
            <label className="block text-xs mb-1" htmlFor={id}>{label}</label>
            <div className="flex items-stretch w-fit border border-primary rounded-md overflow-hidden">
                <input className="w-14 px-2 py-1" type="number" id={id} readOnly disabled value={value} min={min} max={max} step={1} />
                <button className="px-2 py-1 w-8 disabled:bg-disabled cursor-pointer disabled:cursor-default" disabled={isMax} onClick={() => onChange(1)}>
                    <Add />
                </button>
                <button className="px-2 py-1 w-8 disabled:bg-disabled cursor-pointer disabled:cursor-default" disabled={isMin} onClick={() => onChange(-1)}>
                    <Remove />
                </button>
            </div>
        </>
    );
}

const Settings = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();
    const id = useId();
    const elemSizeId = id + "-size";
    const imageFitId = id + "-fit";

    const handleGridRows: CounterEventHandler = (change) => {
        dispatch({ type: "CHANGE_GRID_ROWS", rows: state.gridRows + change });
    }

    const handleGridCols: CounterEventHandler = (change) => {
        dispatch({ type: "CHANGE_GRID_COLS", cols: state.gridCols + change });
    }

    const handleElemSize: ChangeEventHandler<HTMLSelectElement> = (e) => {
        if (e.target.value === "min" || e.target.value === "max") {
            dispatch({ type: "CHANGE_ELEM_SIZE", size: e.target.value });
        }
    }

    const handleImageFit: ChangeEventHandler<HTMLSelectElement> = (e) => {
        if (e.target.value === "cover" || e.target.value === "contain") {
            dispatch({ type: "CHANGE_IMAGE_FIT", fit: e.target.value });
        }
    }

    return (
        <>
            <div className="my-2">
                <Counter label="Grid Columns:" min={1} max={12} value={state.gridCols} onChange={handleGridCols} />
            </div>
            <div className="my-2">
                <Counter label="Grid Rows:" min={1} max={12} value={state.gridRows} onChange={handleGridRows} />
            </div>
            <div className="my-2">
                <label htmlFor={elemSizeId} className="block text-xs mb-1">Element size:</label>
                <div className="flex items-center gap-4">
                    <select id={elemSizeId} className="bg-background border-primary border-1 px-2 py-1 rounded-md" defaultValue="max" onChange={handleElemSize}>
                        <option value="max">Max Image</option>
                        <option value="min">Min Image</option>
                    </select>
                    <span className="ms-auto select-none text-nowrap">{elemWidth} x {elemHeight} px</span>
                </div>
            </div>
            <div className="my-2">
                <label htmlFor={imageFitId} className="block text-xs mb-1">Image fit:</label>
                <select id={imageFitId} className="bg-background border-primary border-1 px-2 py-1 rounded-md" defaultValue="cover" onChange={handleImageFit}>
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                </select>
            </div>
        </>
    );
}

export default Settings;
