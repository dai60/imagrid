import { ChangeEventHandler, useId, useState } from "react";
import { useTranslation } from "react-i18next";

type DownloadProps = {
    disabled?: boolean;
    onDownload: (type: string, quality: number) => void;
}

const Download = ({ disabled, onDownload }: DownloadProps) => {
    const { t } = useTranslation();
    const id = useId();

    const [file, setFile] = useState("image/jpeg");
    const [quality, setQuality] = useState(92);

    const fileId = id + "-file";
    const qualityId = id + "-quality";

    const handleFile: ChangeEventHandler<HTMLSelectElement> = e => {
        const file = e.target.value;
        setFile(prev => {
            if (file !== prev && file === "image/jpeg") {
                setQuality(92);
            }
            else if (file !== prev && file === "image/webp") {
                setQuality(80);
            }
            return file;
        });
    }

    const handleDownload = () => {
        onDownload(file, quality / 100);
    }

    return (
        <div className="flex justify-between items-end">
            <div className="my-2">
                <label className="block text-xs mb-1" htmlFor={fileId}>{t("saveAs")}:</label>
                <select className="bg-sidebar border border-sidebar-accent rounded-md px-2 py-1" id={fileId} defaultValue={file} onChange={handleFile}>
                    <option value="image/png">png</option>
                    <option value="image/jpeg">jpeg</option>
                    <option value="image/webp">webp</option>
                </select>
            </div>
            {file !== "image/png" && (
                <div className="my-2">
                    <label className="block text-xs mb-1" htmlFor={qualityId}>{t("quality")}:</label>
                    <input className="border border-sidebar-accent rounded-md px-2 py-1 w-16" type="number" id={qualityId} min={0} max={100} value={quality} onChange={e => setQuality(e.target.valueAsNumber)} />
                </div>
            )}
            <button
                className="my-2 border border-sidebar-accent bg-sidebar-accent hover:not-disabled:brightness-120 disabled:opacity-50 text-background px-2 py-1 rounded-md not-disabled:cursor-pointer transition-all"
                disabled={disabled}
                onClick={handleDownload}>
                    {t("download")}
            </button>
        </div>
    );
}

export default Download;
