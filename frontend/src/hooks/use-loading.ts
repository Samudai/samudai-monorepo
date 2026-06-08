import { useState, useEffect } from 'react';

const useLoading = (delay = 1000) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), delay);
    }, []);

    return loading;
};

export default useLoading;
