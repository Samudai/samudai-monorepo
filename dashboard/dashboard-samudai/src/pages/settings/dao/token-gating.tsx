import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { getSettingsRoutes } from '../utils/settings-routes';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { ethers } from 'ethers';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetTokenGatingQuery } from 'store/services/Settings/settings';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { GnosisChainValues } from 'components/@pages/payments/utils/providerConstants';
import TokenGatingList from 'components/@pages/settings/TokenGatingList';
import DeleteTokenGating from 'components/@pages/settings/popups/DeleteTokenGating';
import SettingsDone from 'components/@pages/settings/popups/SettingsDone';
import chainData from 'components/@pages/settings/utils/chain';
import { gatingSelectStyles } from 'components/@pages/settings/utils/gatingSelectStyles';
import { getDefaultTokenGateForm } from 'components/@pages/settings/utils/getDefaultTokenGateForm';
import { ChainType, TokenGateFormData, TokenType } from 'components/@pages/settings/utils/types';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Switch from 'ui/Switch/Switch';
import { initLit } from 'utils/lit-protocol/litProtocol';
import styles from 'styles/pages/token-gating.module.scss';

interface TokenGatingProps {}

const token_type = [
    {
        name: 'ETH',
        requiredMinValue: true,
    },
    {
        name: 'ERC20',
        requiredMinValue: true,
        requiredContractAdderess: true,
    },
    {
        name: 'ERC721',
        requiredContractAdderess: true,
    },
    {
        name: 'ERC1155',
        requiredContractAdderess: true,
    },
];

const TokenGating: React.FC<TokenGatingProps> = () => {
    const [formData, setFormData] = useState<TokenGateFormData>(getDefaultTokenGateForm());
    const donePopup = usePopup();
    const deletePopup = usePopup();
    const [checkTokenGating] = useLazyGetTokenGatingQuery();
    const [editable, setEditable] = useState(true);
    const [chain, setChain] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [type, setType] = useState<string>('');
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const activeDao = useTypedSelector(selectActiveDao);
    const navigate = useNavigate();

    useEffect(() => {
        if (!access) {
            navigate(`/dashboard/1`);
        }
    }, [daoid]);

    useEffect(() => {
        const fun = async () => {
            const res = await checkTokenGating(activeDao).unwrap();
            if (!res?.data) {
                setEditable(true);
            } else {
                setChain(res?.data?.accessControlConditions[0].chain);
                setContractAddress(res?.data?.accessControlConditions[0].contractAddress);
                setValue(res?.data?.accessControlConditions[0].returnValueTest.value);
                setType(res?.data?.accessControlConditions[0].standardContractType || 'ETH');
                setEditable(false);
            }
        };
        fun();
    }, []);

    const handleTokenGating = () => {
        setFormData({ ...getDefaultTokenGateForm(), tokenGating: !formData.tokenGating });
    };

    const handleChain = (chain: ChainType) => {
        setFormData({ ...formData, tokenType: null, chain });
    };

    const handleType = (tokenType: TokenType) => {
        setFormData({ ...formData, tokenType });
    };

    const handleInput = (name: keyof typeof formData) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [name]: e.target.value });
        };
    };
    const handleSubmit = async () => {
        const res = await initLit(
            formData.chain?.name.toLocaleLowerCase(),
            formData.tokenType?.name,
            window.location.origin,
            '/' + activeDao + '/dashboard/1',
            activeDao,
            formData.contractAddress,
            '',
            ethers.utils.parseEther('' + formData.minValue).toString()
        );
        console.log(res);
    };

    const chainTypes =
        chainData.find((c) => c.chain.name === formData.chain?.name)?.token_type || [];

    return (
        <SettingsLayout routes={getSettingsRoutes}>
            <React.Suspense fallback={<Loader />}>
                editable ? (
                <React.Fragment>
                    <div className={styles.root} data-analytics-page="settings_dao_token_gating">
                        <TokenGatingList>
                            <TokenGatingList.Item active>
                                <div className={styles.gatting} onClick={handleTokenGating}>
                                    <p className={styles.gattingName}>Enable token gate</p>
                                    <Switch
                                        className={styles.gattingSwitch}
                                        active={formData.tokenGating}
                                    />
                                </div>
                            </TokenGatingList.Item>
                            <TokenGatingList.Item active={formData.tokenGating}>
                                <Select
                                    placeholder="Select chain"
                                    value={formData.chain}
                                    options={GnosisChainValues}
                                    onChange={(chain) => handleChain(chain as ChainType)}
                                    formatOptionLabel={(data: ChainType) => (
                                        <p className={styles.selectItemContent}>{data.name}</p>
                                    )}
                                    classNamePrefix="rs"
                                    styles={gatingSelectStyles}
                                />
                            </TokenGatingList.Item>
                            <TokenGatingList.Item active={!!(formData.chain && chainTypes)}>
                                <Select
                                    placeholder="Select Token "
                                    value={formData.tokenType}
                                    options={token_type.map((tokenType) => ({
                                        ...tokenType,
                                        value: tokenType.name,
                                    }))}
                                    onChange={(tokenType) => handleType(tokenType as TokenType)}
                                    formatOptionLabel={(data: TokenType) => (
                                        <p className={styles.selectItemContent}>{data.name}</p>
                                    )}
                                    classNamePrefix="rs"
                                    styles={gatingSelectStyles}
                                />
                                {formData.tokenType?.requiredContractAdderess && (
                                    <Input
                                        title="Enter the contract address"
                                        value={formData.contractAddress}
                                        onChange={handleInput('contractAddress')}
                                        className={styles.input}
                                        data-analytics-click="token_gating_contract_address_input"
                                    />
                                )}
                                {formData.tokenType?.requiredMinValue && (
                                    <Input
                                        title={'Enter the minimum value ' + formData.tokenType.name}
                                        value={formData.minValue}
                                        onChange={handleInput('minValue')}
                                        className={styles.input}
                                        data-analytics-click="token_gating_min_value_input"
                                    />
                                )}
                            </TokenGatingList.Item>
                        </TokenGatingList>
                        {formData.tokenType &&
                            (!!formData.contractAddress || formData.tokenType.name === 'ETH') && (
                                <div className={styles.controls}>
                                    <Button
                                        color="green"
                                        className={styles.submitBtn}
                                        onClick={handleSubmit}
                                        disabled={!access}
                                        data-analytics-click="token_gating_submit_btn"
                                    >
                                        <span>Submit</span>
                                    </Button>
                                </div>
                            )}
                    </div>
                    <PopupBox active={donePopup.active} onClose={donePopup.close}>
                        <SettingsDone onClose={donePopup.close} />
                    </PopupBox>
                </React.Fragment>
                ) : (
                <React.Fragment>
                    <div className={styles.root}>
                        <div className={styles.gatting}>
                            <p className={styles.gattingName}> Token gating Enabled</p>
                            <Switch className={styles.gattingSwitch} active={true} />
                        </div>

                        <Input
                            title="Chain"
                            value={chain}
                            onChange={() => {}}
                            className={styles.input}
                        />

                        {!!contractAddress && (
                            <Input
                                title="Contract Address"
                                value={formData.contractAddress}
                                onChange={() => {}}
                                className={styles.input}
                            />
                        )}
                        <Input
                            title="Type"
                            value={type}
                            onChange={() => {}}
                            className={styles.input}
                        />
                        <Input
                            title="Value"
                            value={value}
                            onChange={() => {}}
                            className={styles.input}
                        />
                        <div className={styles.controls}>
                            <Button
                                color="orange"
                                className={styles.submitBtn}
                                onClick={deletePopup.open}
                                disabled={!access}
                                data-analytics-click="delete_token_gating_btn"
                            >
                                <span>Delete</span>
                            </Button>
                        </div>
                    </div>
                    <PopupBox active={deletePopup.active} onClose={deletePopup.close}>
                        <DeleteTokenGating onClose={deletePopup.close} setEditable={setEditable} />
                    </PopupBox>
                </React.Fragment>
                );
            </React.Suspense>
        </SettingsLayout>
    );
};

export default TokenGating;
