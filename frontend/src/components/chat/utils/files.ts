import { FileHelper } from 'utils/helpers/FileHelper';

export type MsgAttachmentsType = {
    id: string;
    name: string;
    size: string;
    date: string;
    url: string;
};

export function filterFiles(files: MsgAttachmentsType[], include?: string[], exclude?: string[]) {
    const includeFiles = include ? include.join(',') : '';
    const excludeFiles = exclude ? exclude.join(',') : '';

    return files.filter((file) => {
        const ext = FileHelper.getFileExt(file.name);

        if (!ext) {
            return false;
        }

        const isInclude = includeFiles.length > 0 ? includeFiles.includes(ext) : true;
        const isNotExclude = !excludeFiles.includes(ext);

        return isInclude && isNotExclude;
    });
}

export function switchImages(files: MsgAttachmentsType[], incImage?: boolean) {
    return files.filter((file) => {
        const ext = FileHelper.getFileExt(file.name);

        if (!ext) return false;

        const isFileImage = FileHelper.extensions.image.includes(ext);

        if (isFileImage && incImage) {
            return true;
        } else if (isFileImage) {
            return false;
        }

        return true;
    });
}

export function getFileIcon(fileName: string) {
    const { extensions } = FileHelper;
    const ext = FileHelper.getFileExt(fileName);

    if (!ext) {
        return null;
    }

    switch (true) {
        case extensions.docs.includes(ext):
            return '/img/extensions/doc.svg';
        case extensions.html.includes(ext):
            return '/img/extensions/html.svg';
        case extensions.pdf.includes(ext):
            return '/img/extensions/pdf.svg';
        default:
            return null;
    }
}
