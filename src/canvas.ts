import { MontageImage, ObjectFit } from "./Montage";

type CanvasSettings = {
    gridRows: number;
    gridCols: number;
    elemWidth: number;
    elemHeight: number;
};

export default class Canvas {
    settings: CanvasSettings;
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D;

    constructor(settings: CanvasSettings) {
        this.settings = settings;
        this.#canvas = document.createElement("canvas");
        this.#canvas.width = settings.gridCols * settings.elemWidth;
        this.#canvas.height = settings.gridRows * settings.elemHeight;
        const ctx = this.#canvas.getContext("2d");
        if (!ctx) {
            throw new Error("error creating canvas context");
        }
        this.#ctx = ctx;
    }

    clear(color: string) {
        this.#ctx.fillStyle = color;
        this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    drawImages(images: MontageImage[], fit: ObjectFit) {
        for (let y = 0; y < this.settings.gridRows; ++y) {
            for (let x = 0; x < this.settings.gridCols; ++x) {
                const index = y * this.settings.gridCols + x;
                if (index >= images.length) {
                    return;
                }

                const image = images[index];
                if (fit === "contain") {
                    this.drawImageContain(image, x, y);
                } else {
                    this.drawImageCover(image, x, y);
                }
            }
        }
    }

    drawImageContain({ img }: MontageImage, col: number, row: number) {
        const elemWidth = this.settings.elemWidth;
        const elemHeight = this.settings.elemHeight;

        const scale = Math.min(elemWidth / img.width, elemHeight / img.height);

        const dw = img.width * scale;
        const dh = img.height * scale;

        const dx = col * elemWidth + (elemWidth - dw) / 2;
        const dy = row * elemHeight + (elemHeight - dh) / 2;

        this.#ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
    }

    drawImageCover({ img }: MontageImage, col: number, row: number) {
        const dw = this.settings.elemWidth;
        const dh = this.settings.elemHeight;
        const dx = col * dw;
        const dy = row * dh;

        const elemRatio = dw / dh;
        const imgRatio = img.width / img.height;

        let sx, sy, sw, sh;
        if (imgRatio > elemRatio) {
            sw = img.height * elemRatio;
            sh = img.height;
            sx = (img.width - sw) / 2;
            sy = 0;
        } else {
            sw = img.width;
            sh = img.width / elemRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
        }

        this.#ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    createBlob(type: string, quality: number): Promise<Blob> {
        return new Promise((resolve, reject) => {
            this.#canvas.toBlob(
                blob => {
                    if (!blob) {
                        reject(new Error("error creating blob"));
                    } else {
                        resolve(blob);
                    }
                },
                type,
                quality,
            );
        });
    }
}
