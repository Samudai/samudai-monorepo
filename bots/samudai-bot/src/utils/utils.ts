
export const getTimestamp = (timeStamp: string | number | Date): string => {
    const date = new Date(timeStamp);
    return date.toISOString();
}
