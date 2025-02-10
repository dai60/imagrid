type DownloadProps = {
    disabled?: boolean;
    onDownload: () => void;
}

const Download = ({ disabled, onDownload }: DownloadProps) => {
    return (
        <button
            className="bg-white disabled:bg-zinc-400 text-black px-2 py-1 rounded-md font-semibold cursor-pointer disabled:cursor-default transition-colors"
            disabled={disabled}
            onClick={onDownload}
        >
                Download
        </button>
    );
}

export default Download;
