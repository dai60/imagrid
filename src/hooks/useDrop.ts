import { useEffect } from "react";

const useDrop = (callback: (files: File[]) => void): void => {
    useEffect(() => {
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
        }

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            if (!e.dataTransfer?.items) {
                return;
            }

            const files = Array.from(e.dataTransfer.items)
                .filter(file => file.kind === "file")
                .map(file => file.getAsFile())
                .filter(file => file !== null);

            callback(files);
        }

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
        }
    }, []);
}

export default useDrop;
