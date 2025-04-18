import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MontageImage } from "./Montage";
import Canvas from "./canvas";
import Download from "./components/Download";
import Grid from "./components/Grid";
import Settings from "./components/Settings";
import Upload from "./components/Upload";
import useDrop from "./hooks/useDrop";
import useMontage from "./hooks/useMontage";

const App = () => {
    const { i18n } = useTranslation();
    const { elemWidth, elemHeight, state, dispatch } = useMontage();
    const [rendering, setRendering] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    useDrop(files => handleUpload(files));

    const handleEmptyGrid = () => {
        uploadRef.current?.click();
    };

    const handleUpload = (files: File[]) => {
        const images = files.map(
            file =>
                new Promise<MontageImage>(resolve => {
                    const url = URL.createObjectURL(file);
                    const img = new Image();
                    img.onload = () => resolve({ url, img });
                    img.src = url;
                }),
        );

        Promise.all(images).then(images => {
            dispatch({ type: "ADD_IMAGES", images });
        });
    };

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
                type === "image/png" ? ".png" : type === "image/jpeg" ? ".jpeg" : type === "image/webp" ? ".webp" : "";

            link.download = `${Date.now()}${extension}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setRendering(false);
        } catch (e) {
            setRendering(false);
            console.error(e);
        }
    };

    const font = i18n.resolvedLanguage === "jp" ? "font-m-plus" : "font-fira-sans";

    return (
        <div className={`flex h-full max-w-screen flex-col-reverse sm:flex-row ${font}`}>
            <aside className="bg-sidebar text-text flex flex-col overflow-y-auto p-4 sm:w-80">
                <Upload ref={uploadRef} onUpload={handleUpload} />
                <Settings />
                <div className="mt-auto">
                    <Download disabled={rendering || state.images.length === 0} onDownload={handleDownload} />
                </div>
            </aside>
            <main className="bg-main text-text min-h-48 flex-1 p-8">
                <Grid onEmptyClick={handleEmptyGrid} />
            </main>
        </div>
    );
};

export default App;
