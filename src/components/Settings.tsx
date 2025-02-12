import { ChangeEventHandler, useId } from "react";
import useMontage from "../hooks/useMontage";

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
            <div className="w-fit border border-white rounded-md overflow-hidden">
                <input className="w-14 px-2" type="number" id={id} readOnly disabled value={value} min={min} max={max} step={1} />
                <button className="px-2 py-1 w-8 disabled:bg-zinc-600 cursor-pointer disabled:cursor-default" disabled={isMax} onClick={() => onChange(1)}>+</button>
                <button className="px-2 py-1 w-8 disabled:bg-zinc-600 cursor-pointer disabled:cursor-default" disabled={isMin} onClick={() => onChange(-1)}>-</button>
            </div>
        </>
    );
}

const Settings = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();

    const handleGridRows: CounterEventHandler = (change) => {
        dispatch({ type: "CHANGE_GRID_ROWS", rows: state.gridSize.rows + change });
    }

    const handleGridCols: CounterEventHandler = (change) => {
        dispatch({ type: "CHANGE_GRID_COLS", cols: state.gridSize.cols + change });
    }

    const handleElemSize: ChangeEventHandler<HTMLSelectElement> = (e) => {
        if (e.target.value !== "contain" && e.target.value !== "cover") {
            return;
        }
        dispatch({ type: "CHANGE_ELEM_SIZE", size: e.target.value });
    }

    return (
        <>
            <div className="my-2">
                <Counter label="Grid Columns:" min={1} max={12} value={state.gridSize.cols} onChange={handleGridCols} />
            </div>
            <div className="my-2">
                <Counter label="Grid Rows:" min={1} max={12} value={state.gridSize.rows} onChange={handleGridRows} />
            </div>
            <div className="my-2">
                <label className="block text-xs mb-1">Element size:</label>
                <div className="flex items-center">
                    <select className="bg-black border-white border-1 px-2 py-1 rounded-md" defaultValue="contain" onChange={handleElemSize}>
                        <option value="contain">Contain Image</option>
                        <option value="cover">Fit Image</option>
                    </select>
                    <span className="ms-auto select-none text-nowrap">{elemWidth} x {elemHeight} px</span>
                </div>
            </div>
        </>
    );
}

export default Settings;
