export class Image {
    path: string;
    altText: string;
    widht: number;
    height: number;

    constructor(path: string, altText: string, widht: number, height: number) {
        this.path = path;
        this.altText = altText;
        this.widht = widht;
        this.height = height;
    }
}