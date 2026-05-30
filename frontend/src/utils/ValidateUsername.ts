import { ethers } from 'ethers';
import { toast } from './toast';

const toastCreate = (message: string) => {
    toast('Failure', 5000, 'Enter a Different Name', message)();
};

export const validateUsername = (username: string): void => {
    const unameBytes = ethers.utils.toUtf8Bytes(username);
    if (unameBytes.length > 16) {
        toastCreate('username cannot be greater than 16 characters');
    }
    if (unameBytes.length === 0) {
        toastCreate('username cannot be empty string');
    }
    let nameEnded = false;

    /**
     * Iterate over the bytes16 fname one char at a time, ensuring that:
     *   1. The name begins with [a-z 0-9] or the ascii numbers [48-57, 97-122] inclusive
     *   2. The name can contain [a-z 0-9 -] or the ascii numbers [45, 48-57, 97-122] inclusive
     *   3. Once the name is ended with a NULL char (0), the follows character must also be NULLs
     */

    // If the name begins with a hyphen, reject it
    if (unameBytes[0] === 45) throw new Error('invalid name');

    unameBytes.forEach((charInt, index) => {
        if (nameEnded) {
            // Only NULL characters are allowed after a name has ended
            if (charInt !== 0) {
                toastCreate('invalid name');
            }
        } else {
            // Only valid ASCII characters [45, 48-57, 97-122] are allowed before the name ends

            // Check if the character is a-z
            if (charInt >= 97 && charInt <= 122) {
                return;
            }

            // Check if the character is 0-9
            if (charInt >= 48 && charInt <= 57) {
                return;
            }

            // Check if the character is a hyphen
            if (charInt === 45) {
                return;
            }

            // On seeing the first NULL char in the name, revert if is the first char in the
            // name, otherwise mark the name as ended
            if (charInt === 0) {
                // We check i==1 instead of i==0 because i is incremented before the check
                if (index === 1) toastCreate('invalid name');
                nameEnded = true;
                return;
            }

            toastCreate('invalid name');
        }
    });
};
