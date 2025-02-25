import { useRef, useState } from "react";
import { MontageImage } from "./Montage";
import Upload from "./components/Upload";
import Grid from "./components/Grid";
import Download from "./components/Download";
import Settings from "./components/Settings";
import useMontage from "./hooks/useMontage";
import useDrop from "./hooks/useDrop";
import Canvas from "./canvas";

const App = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();
    const [rendering, setRendering] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    useDrop(files => handleUpload(files));

    const handleEmptyGrid = () => {
        uploadRef.current?.click();
    }

    const handleUpload = (files: File[]) => {
        const images = files.map(file => new Promise<MontageImage>(resolve => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => resolve({ url, img });
            img.src = url;
        }));

        Promise.all(images).then(images => {
            dispatch({ type: "ADD_IMAGES", images });
        });
    }

    const handleDownload = async (type: string, quality: number) => {
        setRendering(true);

        const canvas = new Canvas({
            gridRows: state.gridRows,
            gridCols: state.gridCols,
            elemWidth,
            elemHeight,
        });
        canvas.clear("white");
        canvas.drawImages(state.images, state.imageFit);

        try {
            const blob = await canvas.createBlob(type, quality);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;

            const extension =
                type === "image/png" ? ".png" :
                type === "image/jpeg" ? ".jpeg" :
                type === "image/webp" ? ".webp" : "";

            link.download = `${Date.now()}${extension}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setRendering(false);
        }
        catch (e) {
            setRendering(false);
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col-reverse sm:flex-row max-w-screen h-full">
            <aside className="bg-background text-primary flex flex-col sm:w-80 p-4 overflow-y-auto">
                <Upload ref={uploadRef} onUpload={handleUpload} />
                <Settings />
                <div className="mt-auto">
                    <Download disabled={rendering} onDownload={handleDownload} />
                </div>
            </aside>
            <main className="p-8 flex-1">
                <Grid onEmptyClick={handleEmptyGrid} />
            </main>
        </div>
    );
}

export default App;
