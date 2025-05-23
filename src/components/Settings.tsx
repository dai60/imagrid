import { ChangeEventHandler, useId } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd as Add, MdRemove as Remove } from "react-icons/md";
import useMontage from "../hooks/useMontage";

type CounterEventHandler = (change: number) => void;

type CounterProps = {
    label: string;
    addLabel: string;
    removeLabel: string;
    value: number;
    min: number;
    max: number;
    onChange: CounterEventHandler;
};

const Counter = ({ label, addLabel, removeLabel, value, min, max, onChange }: CounterProps) => {
    const id = useId();

    const isMin = value === min;
    const isMax = value === max;

    return (
        <>
            <label className="mb-1 block text-xs" htmlFor={id}>
                {label}
            </label>
            <div className="border-sidebar-accent flex w-fit items-stretch overflow-hidden rounded-md border">
                <input
                    className="w-14 px-2 py-1"
                    type="number"
                    id={id}
                    readOnly
                    disabled
                    value={value}
                    min={min}
                    max={max}
                    step={1}
                />
                <button
                    className="bg-sidebar-accent w-8 rounded-l-sm px-2 py-1 not-disabled:cursor-pointer hover:not-disabled:brightness-120 disabled:opacity-50"
                    aria-label={addLabel}
                    disabled={isMax}
                    onClick={() => onChange(1)}
                >
                    <Add />
                </button>
                <button
                    className="bg-sidebar-accent w-8 rounded-r-sm px-2 py-1 not-disabled:cursor-pointer hover:not-disabled:brightness-120 disabled:opacity-50"
                    aria-label={removeLabel}
                    disabled={isMin}
                    onClick={() => onChange(-1)}
                >
                    <Remove />
                </button>
            </div>
        </>
    );
};

const Settings = () => {
    const { t } = useTranslation();
    const { elemWidth, elemHeight, state, dispatch } = useMontage();
    const id = useId();
    const elemSizeId = id + "-size";
    const imageFitId = id + "-fit";

    const handleGridRows: CounterEventHandler = change => {
        dispatch({ type: "CHANGE_GRID_ROWS", rows: state.gridRows + change });
    };

    const handleGridCols: CounterEventHandler = change => {
        dispatch({ type: "CHANGE_GRID_COLS", cols: state.gridCols + change });
    };

    const handleElemSize: ChangeEventHandler<HTMLSelectElement> = e => {
        if (e.target.value === "min" || e.target.value === "max") {
            dispatch({ type: "CHANGE_ELEM_SIZE", size: e.target.value });
        }
    };

    const handleImageFit: ChangeEventHandler<HTMLSelectElement> = e => {
        if (e.target.value === "cover" || e.target.value === "contain") {
            dispatch({ type: "CHANGE_IMAGE_FIT", fit: e.target.value });
        }
    };

    return (
        <>
            <div className="my-2">
                <Counter
                    label={t("gridColumns") + ":"}
                    addLabel="Add column"
                    removeLabel="Remove column"
                    min={1}
                    max={12}
                    value={state.gridCols}
                    onChange={handleGridCols}
                />
            </div>
            <div className="my-2">
                <Counter
                    label={t("gridRows") + ":"}
                    addLabel="Add row"
                    removeLabel="Remove row"
                    min={1}
                    max={12}
                    value={state.gridRows}
                    onChange={handleGridRows}
                />
            </div>
            <div className="my-2">
                <label htmlFor={elemSizeId} className="mb-1 block text-xs">
                    {t("elementSize")}:
                </label>
                <div className="flex items-center gap-4">
                    <select
                        id={elemSizeId}
                        className="bg-sidebar border-sidebar-accent rounded-md border px-2 py-1"
                        defaultValue="max"
                        onChange={handleElemSize}
                    >
                        <option value="max">{t("maxImage")}</option>
                        <option value="min">{t("minImage")}</option>
                    </select>
                    {state.images.length > 1 && (
                        <span className="ms-auto text-nowrap select-none">
                            {elemWidth} x {elemHeight} px
                        </span>
                    )}
                </div>
            </div>
            <div className="my-2">
                <label htmlFor={imageFitId} className="mb-1 block text-xs">
                    {t("imageFit")}:
                </label>
                <select
                    id={imageFitId}
                    className="bg-sidebar border-sidebar-accent rounded-md border px-2 py-1"
                    defaultValue="cover"
                    onChange={handleImageFit}
                >
                    <option value="cover">{t("cover")}</option>
                    <option value="contain">{t("contain")}</option>
                </select>
            </div>
        </>
    );
};

export default Settings;
