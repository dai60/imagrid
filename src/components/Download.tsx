import { ChangeEventHandler, useId, useState } from "react";
import { useTranslation } from "react-i18next";

type DownloadProps = {
    disabled?: boolean;
    onDownload: (type: string, quality: number) => void;
};

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
            } else if (file !== prev && file === "image/webp") {
                setQuality(80);
            }
            return file;
        });
    };

    const handleDownload = () => {
        onDownload(file, quality / 100);
    };

    return (
        <div className="flex items-end justify-between">
            <div className="my-2">
                <label className="mb-1 block text-xs" htmlFor={fileId}>
                    {t("saveAs")}:
                </label>
                <select
                    className="bg-sidebar border-sidebar-accent rounded-md border px-2 py-1"
                    id={fileId}
                    defaultValue={file}
                    onChange={handleFile}
                >
                    <option value="image/png">png</option>
                    <option value="image/jpeg">jpeg</option>
                    <option value="image/webp">webp</option>
                </select>
            </div>
            {file !== "image/png" && (
                <div className="my-2">
                    <label className="mb-1 block text-xs" htmlFor={qualityId}>
                        {t("quality")}:
                    </label>
                    <input
                        className="border-sidebar-accent w-16 rounded-md border px-2 py-1"
                        type="number"
                        id={qualityId}
                        min={0}
                        max={100}
                        value={quality}
                        onChange={e => setQuality(e.target.valueAsNumber)}
                    />
                </div>
            )}
            <button
                className="border-sidebar-accent bg-sidebar-accent text-background my-2 rounded-md border px-2 py-1 transition-all not-disabled:cursor-pointer hover:not-disabled:brightness-120 disabled:opacity-50"
                disabled={disabled}
                onClick={handleDownload}
            >
                {t("download")}
            </button>
        </div>
    );
};

export default Download;
