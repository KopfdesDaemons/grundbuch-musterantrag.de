export class Image {
    path: string;
    altText: string;
    widht: number;
    height: number;

    constructor(path: string, altText: string, height: number, widht: number) {
        this.path = path;
        this.altText = altText;
        this.widht = widht;
        this.height = height;
    }
}