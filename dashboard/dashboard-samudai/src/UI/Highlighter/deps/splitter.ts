interface SplitterResult {
    text: string;
    highlight: string[] | null;
    partials: string[] | null;
}
export function splitter(content: string, search: string | RegExp) {
    const result: SplitterResult = {
        text: content,
        highlight: null,
        partials: null,
    };
    const Regex = search instanceof RegExp ? search : new RegExp(search, 'ig');
    const match = content.match(Regex);
    if (!match || search === '') {
        return result;
    }
    result.partials = content.split(Regex);
    result.highlight = match;
    return result;
}
