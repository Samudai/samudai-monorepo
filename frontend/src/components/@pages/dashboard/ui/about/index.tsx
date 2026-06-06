import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { textLengthFormatter } from '../../../../../utils/utils';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import AddAbout from 'components/@pages/settings/profile/AddAbout';
import styles1 from 'components/@pages/settings/styles/IntegrationsConnectItem.module.scss';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import PenIcon from 'ui/SVG/PenIcon';
import { AboutFullText, AboutSkeleton } from './components';
import './about.scss';

export const About: React.FC = () => {
    const { daoid } = useParams();
    const [getDao] = useLazyGetDaoByDaoIdQuery();
    const activeDAO = useTypedSelector(selectActiveDao);
    const ref = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [text, setText] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [isEditable, setEditable] = useState<boolean>(false);
    const aboutPopup = usePopup();
    const showText = usePopup();
    const [daoData, setDaoData] = useState<any>();
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const onClickInputWrapper = () => {
        setEditable(true);
    };

    const onCancel = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Escape') {
            setValue(text);
            setEditable(false);
        }
    };
    const fetchDao = async (activeDAO: string) => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;

        if (member_id) {
            try {
                const response = await getDao(activeDAO).unwrap();
                const data = response?.data?.dao;
                setDaoData({
                    dao_id: data!.dao_id,
                    name: data!.name,
                    guild_id: data!.guild_id,
                    about: data!.about,
                    profile_picture: data!.profile_picture,
                    contract_address: '',
                    snapshot: data!.snapshot,
                    owner_id: data!.owner_id,
                    onboarding: data!.onboarding,
                    dao_type: data!.dao_type,
                    created_at: data!.created_at,
                    updated_at: data!.updated_at,
                });
                setValue(data?.about || '');
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onClickOutsideInput = (e: MouseEvent) => {
        if (wrapperRef.current && !e.composedPath().includes(wrapperRef.current)) {
            setEditable(false);
            setText(value);
        }
    };

    useEffect(() => {
        fetchDao(daoid!);
    }, [daoid, activeDAO]);

    useEffect(() => {
        document.body.addEventListener('click', onClickOutsideInput);
        return () => document.body.removeEventListener('click', onClickOutsideInput);
    }, [isEditable, value]);

    return (
        <React.Fragment>
            <Block className="about-dao" data-analytics-parent="about_dao_widget">
                <Block.Header>
                    <Block.Title>About DAO</Block.Title>
                    {access && (
                        <button
                            className="dashboard-skills__edit"
                            // onClick={aboutPopup.open}
                            data-analytics-click="about_dao_edit_pencil_button"
                            onClick={aboutPopup.open}
                            style={{ marginLeft: '20px' }}
                        >
                            <PenIcon />
                        </button>
                    )}
                    {/* {access && <Block.Link onClick={aboutPopup.open} />} */}
                </Block.Header>
                {value ? (
                    <Block.Scrollable>
                        <Skeleton
                            className="about-dao__content"
                            loading={false} // data loading
                            skeleton={<AboutSkeleton />}
                        >
                            <div
                                ref={wrapperRef}
                                // className={clsx('about-dao__wrapper', { editable: isEditable })}
                                onClick={() => {
                                    return onClickInputWrapper;
                                }}
                                onKeyUp={onCancel}
                            >
                                <TextArea
                                    ref={ref}
                                    value={textLengthFormatter(value, 200)}
                                    // onChange={onChange}
                                    extraText={'Read More'}
                                    analyticsId="about_dao_read_more"
                                    onClickPass={showText.open}
                                    disabled={true}
                                    changeColor
                                    // className={color}
                                />
                            </div>
                        </Skeleton>
                    </Block.Scrollable>
                ) : access ? (
                    <>
                        <div className="about-dao__line" />
                        <div className="about-dao__line" />
                        <Button
                            onClick={aboutPopup.open}
                            color="orange-outlined"
                            className="about-dao__addBtn"
                            data-analytics-click="add_about_dao_button"
                        >
                            <span>Add About DAO</span>
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="about-dao__line" />
                        <div className="about-dao__line" />
                        <div className="about-dao__line" />
                    </>
                )}
            </Block>
            <PopupBox active={aboutPopup.active} onClose={aboutPopup.close}>
                <Popup className={styles1.popup} dataParentId="add_about_dao_modal">
                    <AddAbout
                        daoData={daoData!}
                        setValue={setValue}
                        onCloseModal={aboutPopup.close}
                        value={value}
                    />
                </Popup>
            </PopupBox>
            <PopupBox active={showText.active} onClose={showText.close}>
                <Popup className={styles1.popup} dataParentId="about_dao_expanded_modal">
                    <AboutFullText text={value || ''} title={'About DAO'} />
                </Popup>
            </PopupBox>
        </React.Fragment>
    );
};
