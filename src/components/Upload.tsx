import { ChangeEventHandler, useId, useRef } from "react";

type UploadProps = {
    onUpload: (urls: string[]) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
    const id = useId();
    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        if (!e.target.files) {
            return;
        }

        const images = Array.from(e.target.files).map(file => {
            return URL.createObjectURL(file);
        });
        onUpload(images);
        e.target.value = "";
    }

    return (
        <div className="my-2">
            <label className="block text-xs mb-1" htmlFor={id}>Upload images:</label>
            <button className="border-white border-1 rounded-md px-2 py-1 cursor-pointer" id={id} onClick={() => fileRef.current?.click()}>Choose Files</button>
            <input className="hidden" ref={fileRef} type="file" accept="image/*" multiple onChange={handleChange} />
        </div>
    );
}

export default Upload;
