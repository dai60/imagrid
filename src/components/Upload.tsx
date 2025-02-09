import { ChangeEventHandler, useId } from "react";

type UploadProps = {
    onUpload: (urls: string[]) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
    const id = useId();

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        if (!e.target.files) {
            return;
        }

        const images = Array.from(e.target.files).map(file => {
            return URL.createObjectURL(file);
        });
        onUpload(images);
    }

    return (
        <div>
            <label className="text-xs block" htmlFor={id}>Upload images:</label>
            <input type="file" id={id} accept="image/*" multiple onChange={handleChange} />
        </div>
    );
}

export default Upload;
