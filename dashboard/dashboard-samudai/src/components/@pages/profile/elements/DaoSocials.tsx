import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetDaoSocialsQuery } from 'store/services/Dashboard/dashboard';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Socials from 'components/Socials/DAOSocials';
import { ISkill } from 'utils/types/User';
import DaoSocialsPopup from './DaoSocialsPopup';
import '../styles/DaoSocials.scss';

interface IProps {
    social?: {
        type: string;
        url: string;
    }[];
}

interface FormDataType {
    name: string;
    username: string;
    links: FormDataLinksType;
    skills: ISkill[];
    avatar: File | null;
    NFT: string | null;
}

interface FormDataLinksType {
    twitter: string;
    discord: string;
    mirror: string;
    website: string;
}

const SocialPortfolio: React.FC<IProps> = () => {
    const popup = usePopup();
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const [getDaoSocials] = useLazyGetDaoSocialsQuery();
    const [social, setSocial] = useState<any[]>([]);
    const [popupData, setPopUpdata] = useState<any[]>([]);
    const [temp, setTemp] = useState<boolean>(false);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const [formData, setFormData] = useState<any>({
        links: {
            discord: '',
            twitter: '',
            mirror: '',
            website: '',
        },
    });
    const fun = async () => {
        try {
            const res = await getDaoSocials(daoid!, true).unwrap();
            setPopUpdata(res?.data?.socials);
            // setSocial(res?.data?.socials);
            const user: any = {};
            res?.data?.socials?.forEach((val: any) => {
                user[val.type] = val.url;
            });
            setSocial(user);
            setFormData({ links: user });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fun();
    }, [daoid, activeDao]);

    const handleLinks = (name: keyof FormDataLinksType) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ links: { ...formData.links, [name]: e.target.value } });
        };
    };

    // console.log('formData', formData.links);

    return (
        <Block className="social-portfolio" data-analytics-parent="socials_widget">
            <div style={{ marginTop: '0' }}>
                <Block.Scrollable className="social-portfolio__content">
                    <div
                        style={{
                            marginBottom: '30px',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Block.Title>Socials</Block.Title>
                        {access && (
                            <button
                                className="dashboard-skills__edit"
                                onClick={popup.open}
                                data-analytics-click="socials_widget_edit"
                            >
                                <Block.Link />
                                {/* <PenIcon /> */}
                            </button>
                        )}
                    </div>
                    <Socials social={formData?.links} />
                </Block.Scrollable>
            </div>
            <PopupBox active={popup.active} onClose={popup.close}>
                <DaoSocialsPopup
                    links={formData.links || []}
                    onClose={popup.close}
                    setFormData={setFormData}
                    dataParentId="socials_widget_modal"
                />
            </PopupBox>
        </Block>
    );
};

export default SocialPortfolio;
