export function replaceParam(path: string, alias: string, param: string) {
    return path.replace(`:${alias}`, param);
}
