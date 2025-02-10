import { useState } from "react";
import { MontageImage, useMontage } from "./Montage";
import Upload from "./components/Upload";
import Grid from "./components/Grid";
import Download from "./components/Download";
import Settings from "./components/Settings";

const App = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();
    const [rendering, setRendering] = useState(false);

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
        setRendering(true);

        const canvas = document.createElement("canvas");
        canvas.width = elemWidth * state.gridSize.cols;
        canvas.height = elemHeight * state.gridSize.rows;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("error getting canvas context");
            setRendering(false);
            return;
        }

        for (let y = 0; y < state.gridSize.rows; ++y) {
            for (let x = 0; x < state.gridSize.cols; ++x) {
                const index = y * state.gridSize.cols + x;
                if (index >= state.images.length) {
                    continue;
                }

                const image = state.images[index];
                ctx.drawImage(image.img, x * elemWidth, y * elemHeight);
            }
        }

        canvas.toBlob(blob => {
            if (!blob) {
                console.error("error creating blob");
                setRendering(false);
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.download = `${Date.now()}.jpeg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setRendering(false);
        }, "image/jpeg", 90);
    }

    return (
        <div className="flex flex-col-reverse sm:flex-row max-w-screen h-screen max-h-screen">
            <aside className="bg-black text-white flex flex-col w-full sm:w-80 p-4">
                <Upload onUpload={handleUpload} />
                <Settings />
                <div className="mt-auto">
                    <Download disabled={rendering} onDownload={handleDownload} />
                </div>
            </aside>
            <main className="p-8 flex-1">
                <Grid />
            </main>
        </div>
    );
}

export default App;
