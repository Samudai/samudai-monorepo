export default function deviceApple() {
    const userAgent = ['mac', 'iphone'];
    const isAppleProduct = userAgent.some((item) => {
        return navigator.userAgent.toLowerCase().includes(item.toLowerCase());
    });

    if (isAppleProduct) {
        document.body.classList.add('ios');
    }
}
