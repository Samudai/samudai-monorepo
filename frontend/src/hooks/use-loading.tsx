import { useEffect, useState } from 'react';

export default function useLoading(delay: number = 2000) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), delay);
    }, []);

    return loading;
}
