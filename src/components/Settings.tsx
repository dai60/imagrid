import { ChangeEventHandler } from "react";
import useMontage from "../hooks/useMontage";

const Settings = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();

    const handleGridRows: ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatch({ type: "CHANGE_GRID_ROWS", rows: e.target.valueAsNumber });
    }

    const handleGridCols: ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatch({ type: "CHANGE_GRID_COLS", cols: e.target.valueAsNumber });
    }

    return (
        <>
            <div className="my-2">
                <label className="block text-xs mb-1">Grid size:</label>
                <div className="flex items-center">
                    <input className="border-white border-1 px-2 py-1 rounded-md w-14" type="number" min={1} max={12} step={1} value={state.gridSize.cols} onChange={handleGridCols} />
                    <span className="mx-2 select-none">x</span>
                    <input className="border-white border-1 px-2 py-1 rounded-md w-14" type="number" min={1} max={12} step={1} value={state.gridSize.rows} onChange={handleGridRows} />
                    <span className="ms-auto select-none text-nowrap">{elemWidth * state.gridSize.cols} x {elemHeight * state.gridSize.rows} px</span>
                </div>
            </div>
            <div className="my-2">
                <label className="block text-xs mb-1">Element size:</label>
                <div className="flex items-center">
                    <select className="bg-black border-white border-1 px-2 py-1 rounded-md" defaultValue="max">
                        <option value="min">Min image</option>
                        <option value="max">Max image</option>
                    </select>
                    <span className="ms-auto select-none text-nowrap">{elemWidth} x {elemHeight} px</span>
                </div>
            </div>
        </>
    );
}

export default Settings;
