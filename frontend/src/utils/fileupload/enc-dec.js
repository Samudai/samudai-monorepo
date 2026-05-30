import CryptoJS from 'crypto-js';

function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = 'words' in wordArray ? wordArray.words : [];
    var length = 'sigBytes' in wordArray ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length),
        index = 0,
        word,
        i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

export const encrypt = (fileArray) => {
    try {
        const key = process.env.REACT_APP_ENC_KEY;

        if (key) {
            const wordArray = CryptoJS.lib.WordArray.create(fileArray);
            const encryptedFile = CryptoJS.AES.encrypt(wordArray, key).toString();
            return encryptedFile;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
    }
};

export const decrypt = (encryptedFile) => {
    const reader = new FileReader();
    reader.onload = () => {
        const key = process.env.REACT_APP_ENC_KEY;
        const encryptedData = reader.result;
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, key);
        const typedArray = convertWordArrayToUint8Array(decryptedData);

        const fileDec = new Blob([typedArray]);

        const a = document.createElement('a');
        const url = window.URL.createObjectURL(fileDec);
        const filename = encryptedFile.name.replace('.enc', '');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    reader.readAsText(encryptedFile);
};

export const decryptForView = (encryptedFile) => {
    const reader = new FileReader();
    reader.readAsText(encryptedFile);

    return new Promise((res, rej) => {
        reader.onload = () => {
            const key = process.env.REACT_APP_ENC_KEY;
            const encryptedData = reader.result;
            const decryptedData = CryptoJS.AES.decrypt(encryptedData, key);
            const typedArray = convertWordArrayToUint8Array(decryptedData);

            const fileDec = new Blob([typedArray]);
            const url = window.URL.createObjectURL(fileDec);
            console.log(fileDec, url);
            res(url);
        };
    });
};
