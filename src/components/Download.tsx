type DownloadProps = {
    onDownload: () => void;
}

const Download = ({ onDownload }: DownloadProps) => {
    return (
        <button className="cursor-pointer" onClick={onDownload}>Download</button>
    );
}

export default Download;
