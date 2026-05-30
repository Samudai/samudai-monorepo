export default function supportWebp() {
    const canvas = document.createElement('canvas');

    if (canvas.getContext && canvas.getContext('2d')) {
        if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            document.body.classList.add('webp');
        }
    } else {
        return false;
    }
}
