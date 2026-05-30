export const combineTwoArrays = (arr1: any[], arr2: any[]) => {
    if (arr1 && arr2) {
        const combinedArray = arr1.concat(arr2);
        const uniqueArray = combinedArray.filter((item, index) => {
            return combinedArray.indexOf(item) === index;
        });
        return uniqueArray;
    } else if (arr1 && !arr2) {
        return arr1;
    } else if (!arr1 && arr2) {
        return arr2;
    } else {
        return [];
    }
};

export const getKeysFromArrayofObjects = (arr: any[]) => {
    let keys: string[] = [];

    const keysArray = arr.map((item) => {
        return Object.keys(item);
    });

    keysArray.forEach((item) => {
        keys.push(item[0]);
    });

    return keys;
};

export const randString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
