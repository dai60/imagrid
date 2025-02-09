import { useState } from "react";
import Upload from "./components/Upload";
import Grid from "./components/Grid";

const App = () => {
    const [images, setImages] = useState<string[]>([]);

    const handleUpload = (images: string[]) => {
        setImages(prev => [...prev, ...images]);
    }

    return (
        <main>
            <Upload onUpload={handleUpload} />
            <Grid images={images} setImages={setImages} />
        </main>
    );
}

export default App;
