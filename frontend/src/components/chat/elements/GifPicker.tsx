import React, { useEffect, useState } from 'react';
import { useLazyFetchGifsQuery } from 'store/services/Gif/gif';
import useInput from 'hooks/useInput';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Input from 'ui/@form/Input/Input';
import styles from '../styles/GifPicker.module.scss';

interface GifPickerProps {
    setIsOpen: (value: boolean) => void;
    onSelect: (gif: any) => void;
}

const GifPicker: React.FC<GifPickerProps> = ({ setIsOpen, onSelect }) => {
    const [searchInputValue, setSearchInputValue] = useInput<HTMLInputElement>('');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [fetchGifs, { error }] = useLazyFetchGifsQuery();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            await fetchGifs(searchInputValue)
                .then((res) => setData(res.data))
                .finally(() => setLoading(false));
        };
        fetch();
    }, [searchInputValue, fetchGifs]);

    return (
        <Popup className={styles.root} dataParentId="gif_picker_modal">
            <PopupTitle
                icon="/img/icons/magnifier.png"
                className={styles.mainTitle}
                title="Search Gifs"
            />
            <>
                <Input
                    value={searchInputValue}
                    className={styles.inputTitle}
                    placeholder="Search"
                    onChange={setSearchInputValue}
                    data-analytics-click="gif_name_input"
                />
                {loading ? (
                    <Loader removeBg />
                ) : error ? (
                    <p className="text-center">Sorry... Giphy has limited the request</p>
                ) : (
                    <div className={styles.gifPickerContainer}>
                        {data &&
                            (data as any).data?.map((item: any) => (
                                <img
                                    className={styles.gifPicker}
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item?.images?.original?.url);
                                        setIsOpen(false);
                                    }}
                                    src={item?.images?.original?.url}
                                    alt=""
                                    data-analytics-click={'gif_' + item?.id}
                                />
                            ))}
                    </div>
                )}
            </>
        </Popup>
    );
};

export default GifPicker;
