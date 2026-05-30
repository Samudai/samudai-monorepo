export class FileHelper {
    static extensions = {
        media: 'fig,mp4,mov,wmv,avi,avchd,flv,f4v,swf,mkv,webm,mpeg-2,mp3',
        image: 'tif,tiff,bmp,jpg,jpeg,gif,png,eps,webp',
        docs: 'doc',
        html: 'html',
        pdf: 'pdf',
        figma: 'fig',
        svg: 'svg',
    };

    static getFileType(fileName: string) {
        const ext = FileHelper.getFileExt(fileName);

        if (!ext) return null;

        for (const [type, extGroup] of Object.entries(FileHelper.extensions)) {
            if (extGroup.includes(ext)) {
                return type.toLowerCase();
            }
        }

        return null;
    }

    static getFileExt(fileName: string) {
        return fileName.split('.').pop()?.toLowerCase().trim();
    }

    static getOnlyFileName(fileName: string) {
        return (fileName.split('/').pop() || '').replace(/\..+$/, '');
    }

    // New
    static getType() {}

    static getName(fileName: string) {
        return (fileName.split('/').pop() || '').replace(/\..+$/, '');
    }
    static getExtension(fileName: string) {
        return fileName.split('.').pop()?.toLowerCase().trim();
    }

    static getIcon(fileName: string) {
        const { extensions } = FileHelper;
        const ext = FileHelper.getExtension(fileName);

        if (!ext) {
            return '';
        }

        switch (true) {
            case extensions.docs.includes(ext):
                return '/img/extensions/doc.svg';
            case extensions.html.includes(ext):
                return '/img/extensions/html.svg';
            case extensions.pdf.includes(ext):
                return '/img/extensions/pdf.svg';
            default:
                return '/img/extensions/any.svg';
        }
    }
}
