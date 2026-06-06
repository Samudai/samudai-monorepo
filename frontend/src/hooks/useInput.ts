import React, { useState } from 'react';

type useInputOutput<T> = [string, (e: React.ChangeEvent<T>) => void, string, () => void];

type Input = HTMLInputElement | HTMLTextAreaElement;

function useInput<T extends Input = HTMLInputElement>(value: string): useInputOutput<T> {
    const [data, setData] = useState<string>(value);

    const clearData = data.trim();
    const emptyState = () => setData('');

    const onChange = (e: React.ChangeEvent<T>) => {
        setData(e.target.value);
    };

    return [data, onChange, clearData, emptyState];
}

export default useInput;
