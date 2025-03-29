import { ChangeEventHandler, RefObject, useId } from "react";
import { useTranslation } from "react-i18next";

type UploadProps = {
    ref: RefObject<HTMLInputElement | null>;
    onUpload: (files: File[]) => void;
};

const Upload = ({ ref, onUpload }: UploadProps) => {
    const { t } = useTranslation();
    const id = useId();

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        if (!e.target.files) {
            return;
        }
        onUpload(Array.from(e.target.files));
        e.target.value = "";
    };

    return (
        <div className="my-2">
            <label className="mb-1 block text-xs" htmlFor={id}>
                {t("uploadImages")}:
            </label>
            <button
                className="bg-sidebar-accent cursor-pointer rounded-md px-2 py-1 transition-all hover:brightness-120"
                id={id}
                onClick={() => ref.current?.click()}
            >
                {t("chooseFiles")}
            </button>
            <input className="hidden" ref={ref} type="file" accept="image/*" multiple onChange={handleChange} />
        </div>
    );
};

export default Upload;
