import { useState } from 'react';

export const useForceUpdate = () => {
    const [value, setValue] = useState(1);
    return () => setValue((prev) => prev + 1);
};
