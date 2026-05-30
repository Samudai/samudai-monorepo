export const getRadians = (degree: number) => {
    return degree * (Math.PI / 180);
};

export const getLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: string | number
) => {
    const lines: string[] = [];
    let lineHeight = 10;

    if (!ctx) {
        return { lines, lineHeight };
    }

    const font = ctx.font.match(/\d+/)?.toString();
    lineHeight = font ? parseInt(font) : lineHeight;

    if (maxWidth === 'auto') {
        lines.push(text);
    } else {
        const words = text.split(' ');
        let currentLine = words[0];
        let word, width;

        for (let i = 1; i < words.length; i++) {
            word = words[i];
            width = ctx.measureText(currentLine + ' ' + word).width;

            if (width < maxWidth) {
                currentLine += ` ${word}`;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
    }

    return { lines, lineHeight };
};
