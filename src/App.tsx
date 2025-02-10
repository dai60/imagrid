import Upload from "./components/Upload";
import Grid from "./components/Grid";
import Download from "./components/Download";
import { MontageImage, useMontage } from "./Montage";

const Settings = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();

    const handleGridRows: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatch({ type: "CHANGE_GRID_ROWS", rows: e.target.valueAsNumber });
    }

    const handleGridCols: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatch({ type: "CHANGE_GRID_COLS", cols: e.target.valueAsNumber });
    }

    return (
        <div>
            <p className="text-sm">Grid size:</p>
            <input className="w-16 text-right" type="number" min={1} max={12} step={1} value={state.gridSize.cols} onChange={handleGridCols} />
            <span>x</span>
            <input className="w-16 text-right" type="number" min={1} max={12} step={1} value={state.gridSize.rows} onChange={handleGridRows} />
            <p className="text-sm">Element size:</p>
            <select defaultValue="max">
                <option value="min">Min image</option>
                <option value="max">Max image</option>
            </select>
            <p>{elemWidth}x{elemHeight} px</p>
        </div>
    );
}

const App = () => {
    const { dispatch } = useMontage();

    const handleUpload = (urls: string[]) => {
        const images = urls.map(url => {
            return new Promise<MontageImage>(resolve => {
                const img = new Image();
                img.onload = () => resolve({ url, img });
                img.src = url;
            });
        })

        Promise.all(images).then(images => {
            dispatch({ type: "ADD_IMAGES", images });
        });

    }

    const handleDownload = () => {

    }

    return (
        <div className="flex max-w-screen h-screen max-h-screen">
            <aside className="flex flex-col w-72 border-black border-r-2 p-4">
                <Upload onUpload={handleUpload} />
                <Settings />
                <div className="mt-auto">
                    <Download onDownload={handleDownload} />
                </div>
            </aside>
            <main className="p-8 flex flex-1 justify-center items-center">
                <Grid />
            </main>
        </div>
    );
}

export default App;
