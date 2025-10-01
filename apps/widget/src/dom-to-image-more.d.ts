declare module 'dom-to-image-more' {
  interface DomToImageOptions {
    filter?: (node: HTMLElement) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
  }

  const domtoimage: {
    /**
     * Converts a DOM node to a Blob.
     * @param node The DOM node to convert.
     * @param options Configuration options.
     * @returns A promise that resolves with the Blob.
     */
    toBlob: (node: Node, options?: DomToImageOptions) => Promise<Blob>;

    /**
     * Converts a DOM node to a PNG image encoded as a data URL.
     * @param node The DOM node to convert.
     * @param options Configuration options.
     * @returns A promise that resolves with the data URL.
     */
    toPng: (node: Node, options?: DomToImageOptions) => Promise<string>;

    /**
     * Converts a DOM node to a JPEG image encoded as a data URL.
     * @param node The DOM node to convert.
     * @param options Configuration options.
     * @returns A promise that resolves with the data URL.
     */
    toJpeg: (node: Node, options?: DomToImageOptions) => Promise<string>;

    /**
     * Converts a DOM node to an SVG image encoded as a data URL.
     * @param node The DOM node to convert.
     * @param options Configuration options.
     * @returns A promise that resolves with the data URL.
     */
    toSvg: (node: Node, options?: DomToImageOptions) => Promise<string>;
  };

  export default domtoimage;
}