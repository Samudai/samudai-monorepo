import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { selectProvider, selectStreamId } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import InformationIcon from 'ui/SVG/InformationIcon';
import { getVerifiableCredentials } from 'utils/ceramic/verifiableCreds';
import { toast } from 'utils/toast';
import '../styles/EarnedBadges.scss';

const EarnedBadges: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const streamId = useTypedSelector(selectStreamId);
    const { memberid } = useParams();
    const providerEth = useTypedSelector(selectProvider);

    const fetchBadges = async () => {
        const { data } = await axios.get<any[]>('/mockup/earned-badges.json');
        setData(data);
    };

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getVerifiableCredentials(memberid!);
                const val = (res || []).map(
                    (val: { issuanceDate: any; badges: { badgePhoto: any } }) => {
                        return {
                            id: val.issuanceDate,
                            icon: val.badges?.badgePhoto || '/img/icons/badge-1.svg',
                        };
                    }
                );
                console.log('VC:', res);
                setData(val);
                // setData([]);
            } catch (err: any) {
                toast(
                    'Failure',
                    5000,
                    'Something went wrong while fetching verifiable credentials',
                    err?.data?.message
                )();
            }
        };
        fun();
    }, [memberid]);

    return (
        <Block className="earned-badges">
            <Block.Header>
                <Block.Title>
                    <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
                        <div>Earned Badges</div>
                        <button
                            className={'reviewsPreviewBtn'}
                            style={{ marginTop: '0px', padding: '0px', minWidth: '0px' }}
                            onClick={() => {
                                // window.open('https://www.google.com/', '_blank');
                            }}
                        >
                            <InformationIcon />
                        </button>
                    </div>
                </Block.Title>
            </Block.Header>
            {data.length > 0 && (
                <Block.Scrollable className="earned-badges__content">
                    <ul className="earned-badges__list">
                        {data.slice(0, 5).map((item) => (
                            <li className="earned-badges__item" key={item.id}>
                                <img src={item.icon} alt="icon" />
                                {/* <p className="earned-badges__value">{item.value}</p> */}
                            </li>
                        ))}
                    </ul>
                </Block.Scrollable>
            )}
            {data.length === 0 && (
                <Block style={{ borderRadius: '20px', marginTop: '24px' }}>
                    <div
                        className="transactions__header"
                        style={{
                            marginTop: '0px',
                            color: '#fdc087',
                            padding: '40px 0',
                            textAlign: 'center',
                        }}
                    >
                        <Block.Scrollable>No Earned Badges</Block.Scrollable>
                    </div>
                </Block>
            )}
        </Block>
    );
};

export default EarnedBadges;
