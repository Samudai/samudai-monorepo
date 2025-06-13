import React, { useState } from 'react';
import { BasicStepProps, ChangeNameType } from '../../../types';
import clsx from 'clsx';
import { changeProfilePicture } from 'store/features/common/slice';
import { useLazyCheckUserNameQuery, useUploadProfilePicMutation } from 'store/services/Login/login';
import { useTypedDispatch } from 'hooks/useStore';
import Input from 'ui/@form/Input/Input';
import GalleryIcon from 'ui/SVG/GalleryIcon';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './SetupImgName.scss';

type SetupImgNameProps = BasicStepProps & {
    onOpenOpensea: () => void;
    setEnableNext: React.Dispatch<React.SetStateAction<boolean>>;
};

const SetupImgName: React.FC<SetupImgNameProps> = ({
    state,
    setState,
    onOpenOpensea,
    setEnableNext,
}) => {
    const dispatch = useTypedDispatch();
    const [checkUserName] = useLazyCheckUserNameQuery();
    const [uploadProfilePic] = useUploadProfilePicMutation();
    const [isValid, setIsValid] = useState<boolean>(false);
    const onChangeImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const img = e.target.files && e.target.files[0];
        if (img!.size > 1000000) {
            toast('Failure', 5000, 'Please Select an Image less than 1MB', '')();
            return;
        }
        setState((prev) => ({ ...prev, img }));
        const member_id = getMemberId();
        const formData = new FormData();
        formData.append('file', img!);
        formData.append('memberId', member_id);
        formData.append('typeOfProfilePicture', '0');
        formData.append('nftProfilePicture', '');
        uploadProfilePic(formData)
            .unwrap()
            .then((res) => {
                console.log(res);
                dispatch(changeProfilePicture({ profilePicture: res.data }));
            })
            .catch((err) => {
                toast('Failure', 5000, 'Please Try Again', '')();
            });
    };

    const onChangeName: ChangeNameType = ({ target: { value } }) => {
        setState((prev) => ({ ...prev, nickname: value }));
        const regex = new RegExp('^(?=[a-z0-9._]{3,18}$)(?!.*[_.]{2})[^_.].*[^_.]$');
        if (!regex.test(value)) return setIsValid(false);
        checkUserName(value.trim().toLowerCase())
            .unwrap()
            .then((res) => {
                if (!res.data?.exist) {
                    setIsValid(true);
                    setEnableNext(true);
                } else {
                    setIsValid(false);
                    setEnableNext(false);
                }
            });
    };

    return (
        <React.Fragment>
            <h4 className="setup-img__title profile-setup__title">Add your profile picture</h4>
            <div className="setup-img__upload">
                <button className="setup-img__upload-input">
                    <label htmlFor="upload-image" className="setup-img__upload-block">
                        <input
                            type="file"
                            name="file"
                            id="upload-image"
                            onChange={onChangeImageInput}
                            accept="image/*"
                        />
                        <div
                            className={clsx('setup-img__upload-img', {
                                active: state.img instanceof File,
                            })}
                        >
                            <GalleryIcon />
                            {state.img instanceof File && (
                                <img src={URL.createObjectURL(state.img)} alt="img" />
                            )}
                        </div>
                        <p className="setup-img__upload-text">Upload</p>
                    </label>
                </button>
                <p className="setup-img__upload-or">or</p>

                <button className="setup-img__upload-input" onClick={onOpenOpensea}>
                    <div className="setup-img__upload-block">
                        <div
                            className={clsx('setup-img__upload-img', {
                                active: typeof state.img === 'string',
                            })}
                        >
                            <GalleryIcon />
                            {typeof state.img === 'string' && <img src={state.img} alt="img" />}
                        </div>
                        <p className="setup-img__upload-text">Use NFT</p>
                    </div>
                </button>
            </div>
            <h4 className="setup-img__title profile-setup__title">Add Username</h4>
            <Input
                className="setup-img__input"
                value={state.nickname}
                placeholder="Enter your username"
                onChange={onChangeName}
            />
            {!isValid && state.nickname.length >= 3 && (
                <h6 className="setup-img__title profile-setup__title" style={{ color: 'red' }}>
                    Please enter a different nickname
                </h6>
            )}
        </React.Fragment>
    );
};

export default SetupImgName;
