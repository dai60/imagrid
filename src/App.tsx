import Upload from "./components/Upload";
import Grid from "./components/Grid";
import Download from "./components/Download";
import { useMontage } from "./Montage";

const Settings = () => {
    return (
        <>
            <p className="text-sm">Element size:</p>
            <input className="w-16 text-right" type="number" min={0} step={1} />
            <span className="mx-2">x</span>
            <input className="w-16 text-right" type="number" min={0} step={1} />
            <span>px</span>
        </>
    );
}

const App = () => {
    const { dispatch } = useMontage();

    const handleUpload = (images: string[]) => {
        dispatch({ type: "ADD_IMAGES", images });
    }

    const handleDownload = () => {

    }

    return (
        <main>
            <Upload onUpload={handleUpload} />
            <Settings />
            <Grid />
            <Download onDownload={handleDownload} />
        </main>
    );
}

export default App;
