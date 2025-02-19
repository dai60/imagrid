export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("error creating canvas context");
        }
        this.ctx = ctx;
    }

    createBlob(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            this.canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("error creating blob"));
                }
                else {
                    resolve(blob);
                }
            })
        });
    }
}
