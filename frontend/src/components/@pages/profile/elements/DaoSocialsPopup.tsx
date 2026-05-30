import { Dispatch, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import * as Socials from 'UI/SVG/socials';
import { selectAccess } from 'store/features/common/slice';
import { useUpdateDaoSocialsMutation } from 'store/services/Dashboard/dashboard';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import styles from './DaoSocialsPopup.module.scss';

interface PorfolioLinksProps {
    links: any;
    onClose?: () => void;
    setFormData: Dispatch<any>;
    dataParentId?: string;
}
interface FormDataLinksType {
    twitter: string;
    discord: string;
    mirror: string;
    website: string;
}

type OrderType = {
    name: string;
    icon: JSX.Element | string;
    id: number;
    value: string;
    placeholder: string;
    username: string;
};

const order: OrderType[] = [
    {
        id: 5,
        value: '',
        name: 'discord',
        icon: <Socials.Discord />,
        placeholder: 'https://discord.gg/',
        username: 'invite',
    },
    {
        id: 1,
        value: '',
        name: 'twitter',
        icon: <Socials.TwitterDAOSocials />,
        placeholder: 'https://twitter.com/',
        username: 'username',
    },
    {
        id: 4,
        value: '',
        name: 'mirror',
        icon: <Socials.Mirror />,
        placeholder: 'https://mirror.xyz/',
        username: 'username',
    },
    {
        id: 3,
        value: '',
        name: 'website',
        icon: <Socials.Website />,
        placeholder: 'https://website.xyz',
        username: '',
    },
];

const DaoSocialsPopup: React.FC<PorfolioLinksProps> = ({
    links,
    onClose,
    setFormData,
    dataParentId,
}) => {
    const [socials, setSocials] = useState(order);
    const { daoid } = useParams();

    const access: boolean = useTypedSelector(selectAccess)?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    useEffect(() => {
        setSocials(order.map((item) => ({ ...item, value: links[item.name] })));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const newSocials = socials?.map((item: any) => {
            if (item.id === id) {
                return {
                    ...item,
                    value: e.target.value,
                };
            }
            return item;
        });
        setSocials(newSocials);
    };
    const [updateSocial] = useUpdateDaoSocialsMutation();
    const handleSave = async () => {
        let value = true;
        socials.forEach((item) => {
            if (item.value) {
                if (
                    item.value.trim().indexOf(item.placeholder) !== 0 &&
                    item.value !== '' &&
                    item.name !== 'website'
                ) {
                    toast('Failure', 5000, `Please enter a valid ${item.name} link`, '')();
                    value = false;
                    return;
                }
            }
        });
        if (!value) return;
        try {
            const payload = {
                daoSocial: socials?.map((item: any) => {
                    return {
                        type: item.name,
                        url: item.value,
                        dao_id: daoid!,
                    };
                }),
            };
            const obj = socials.reduce((acc: any, item: any) => {
                acc[item.name] = item.value;
                return acc;
            }, {});
            setFormData((prev: any) => ({
                ...prev,
                links: obj,
            }));
            // const obj: any = {};
            // order.forEach((item) => (obj[item.name] = item.placeholder));
            // socials.forEach((item) => {
            //   if (item.value === '' || item.value.startsWith(obj[item.name])) {
            //   } else {
            //     return toast('Failure', 50000, 'Check the socials links', '')();
            //   }
            // });
            const res = await updateSocial(payload).unwrap();
            toast('Success', 5000, 'Socials updated', '')();
            onClose?.();
        } catch (err: any) {
            toast('Failure', 5000, 'Save Failed', '')();
        }
    };

    return (
        <Popup className={styles.popup} onClose={onClose} dataParentId={dataParentId}>
            <div className={styles.head}>
                {/* <h2 className={styles.headTitle}>Socials</h2> */}
                <PopupTitle
                    className={styles.popupTitle}
                    icon="/img/icons/setup.png"
                    title="Add Socials Links"
                />
                {false && (
                    <Button
                        color="orange"
                        onClick={() =>
                            setSocials([
                                ...socials,
                                {
                                    name: 'Link',
                                    value: '',
                                    icon: <></>,
                                    id: socials.length + 1,
                                    placeholder: '',
                                    username: '',
                                },
                            ])
                        }
                        data-analytics-click="add_social_button"
                    >
                        <span>Add Social</span>
                    </Button>
                )}
            </div>
            <ul className={styles.list}>
                {socials?.map((item: any) => (
                    <li className={styles.listItem} key={item.name}>
                        {typeof item.icon === 'string' ? (
                            <div className={styles.icon1}>
                                <img src={item.icon} alt="icon" />
                            </div>
                        ) : (
                            <div className={styles.icon1}>{item.icon}</div>
                        )}
                        <Input
                            value={item.value}
                            onChange={(e) => handleChange(e, item.id)}
                            name={item.name}
                            placeholder={
                                item.placeholder.toLowerCase() + item.username.toLowerCase()
                            }
                            className={styles.input}
                            data-analytics-click={item.name + '_input'}
                        />
                    </li>
                ))}
            </ul>
            <div className={styles.controls}>
                <Button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={!access}
                    data-analytics-click="save_add_socials"
                >
                    <span>Save</span>
                </Button>
            </div>
        </Popup>
    );
};

export default DaoSocialsPopup;
