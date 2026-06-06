import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazyGetProjectAccessQuery } from 'store/services/projects/totalProjects';
import { useTypedSelector } from 'hooks/useStore';
import AccessManagmentItem from 'components/@pages/settings/AccessManagmentItem';
import styles from 'components/@pages/settings/styles/SelectRole.module.scss';
import { selectRoleStyles1 } from 'components/@pages/settings/utils/select-role.styles';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './styles/ClaimSubdomain.scss';

interface IProps {
    projectId: string;
    onClose: () => void;
}
const ShareProject: React.FC<IProps> = ({ onClose, projectId }) => {
    const [list, setList] = useState<any[]>([]);
    const [invite, setInvite] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [getAccess] = useLazyGetProjectAccessQuery();
    const activeDAO = useTypedSelector(selectActiveDao);

    useEffect(() => {
        const fun = async () => {
            try {
                const access = await getAccess(projectId!).unwrap();
                setList(
                    access?.data?.map((val) => {
                        return {
                            label: val.access,
                            value: val.invite_link,
                        };
                    }) || []
                );
                console.log(list);
            } catch (err) {
                console.error(err);
            }
        };
        fun();
    }, []);

    const handleChange = (e: any) => {
        setInvite(e.value);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(link);
        toast('Success', 2000, 'Invite Link Copied', '')();
        mixpanel.track('project_invite', {
            member_id: getMemberId(),
            timestamp: new Date().toUTCString(),
            invite_link: link,
            project_id: projectId,
            dao_id: activeDAO,
        });
        onClose?.();
    };
    return (
        <>
            {
                <Popup
                    className="add-payments add-payments_complete"
                    dataParentId="share_project_modal"
                >
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Share Project'}
                    />

                    {/* <div style={{ display: 'flex' }}></div>

          <span style={{ color: '#e3625a', marginTop: '20px' }}>
            You can only claim this ONCE. Do you want to continue?
          </span> */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <AccessManagmentItem
                            title="Select Access"
                            style={{ alignItems: 'center', marginTop: '20px' }}
                            contentStyle={{ margin: '0', minWidth: '200px', paddingLeft: '0' }}
                        >
                            <Select
                                classNamePrefix="rs"
                                onChange={handleChange}
                                options={list}
                                // menuIsOpen
                                styles={selectRoleStyles1}
                                placeholder="Select Access"
                                formatOptionLabel={(data: { label: string }) => (
                                    <div
                                        className={styles.label}
                                        data-select-label
                                        style={{ color: 'white' }}
                                    >
                                        {data.label}
                                    </div>
                                )}
                            />
                        </AccessManagmentItem>
                    </div>

                    {!!invite && (
                        <div style={{ marginTop: '30px', minWidth: '30px' }}>
                            <Button
                                color="orange"
                                style={{ width: '120px' }}
                                onClick={() => {
                                    setLink(`${window.location.origin}/invite/project/${invite}`);
                                }}
                                data-analytics-click="generate_link_button"
                            >
                                <span>Generate Link</span>
                            </Button>
                        </div>
                    )}
                    {!!link && (
                        <>
                            <div
                                style={{
                                    width: '90%',
                                    marginTop: '20px',
                                    textAlign: 'center',
                                    background: '#1f2123',
                                    height: '40px',
                                    lineHeight: 2.4,
                                    borderRadius: '15px',
                                }}
                            >
                                {/* <Input
                  placeholder="Type text..."
                  className={styles.textarea}
                  value={link}
                  onChange={() => {}}
                  disabled
                /> */}
                                <span style={{ color: 'white', padding: '15px' }}>{link}</span>
                            </div>
                            <div style={{ marginTop: '30px', minWidth: '30px' }}>
                                <Button
                                    color="green"
                                    style={{ width: '100px' }}
                                    onClick={handleCopyToClipboard}
                                    data-analytics-click="copy_button"
                                >
                                    <span>Copy</span>
                                </Button>
                            </div>
                        </>
                    )}
                </Popup>
            }
        </>
    );
};

export default ShareProject;
