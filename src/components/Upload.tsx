import { ChangeEventHandler, RefObject, useId } from "react";

type UploadProps = {
    ref: RefObject<HTMLInputElement | null>;
    onUpload: (files: File[]) => void;
}

const Upload = ({ ref, onUpload }: UploadProps) => {
    const id = useId();

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        if (!e.target.files) {
            return;
        }
        onUpload(Array.from(e.target.files));
        e.target.value = "";
    }

    return (
        <div className="my-2">
            <label className="block text-xs mb-1" htmlFor={id}>Upload images:</label>
            <button className="bg-sidebar-accent hover:brightness-120 rounded-md px-2 py-1 cursor-pointer transition-all" id={id} onClick={() => ref.current?.click()}>Choose Files</button>
            <input className="hidden" ref={ref} type="file" accept="image/*" multiple onChange={handleChange} />
        </div>
    );
}

export default Upload;
