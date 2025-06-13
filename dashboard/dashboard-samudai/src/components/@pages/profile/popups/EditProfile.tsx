import React from 'react';

// import styles from './EditProfile.module.scss';

interface EditProfileProps {
    onClose?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = (props) => {
    return <div>EditProfile Component</div>;
};

export default EditProfile;

// import React, { useEffect, useState } from 'react';
// import { changeProfilePicture } from 'store/features/common/slice';
// import {
//   useLazyCheckUserNameQuery,
//   useUploadProfilePicMutation,
// } from 'store/services/Login/login';
// import { member } from 'store/services/userProfile/model';
// import { useUpdateMemberMutation } from 'store/services/userProfile/userProfile';
// import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
// import { useTypedDispatch } from 'hooks/useStore';
// import Popup from 'components/@popups/components/Popup/Popup';
// import Button from 'ui/@buttons/Button/Button';
// import Input from 'ui/@form/Input/Input';
// import { toast } from 'utils/toast';
// import { ISkill } from 'utils/types/User';
// import { getMemberId } from 'utils/utils';
// import EditProfileSkills from './EditProfileSkills';
// import PorfolioLinks from './PorfolioLinks';
// import ProfilePicture from './ProfilePicture';
// import styles from '../styles/EditProfile.module.scss';

// interface EditProfileProps {
//   onClose?: () => void;
// }

// export interface FormDataLinksType {
//   twitter: string;
//   behance: string;
//   dribbble: string;
//   mirror: string;
//   linkedIn: string;
// }

// export type FormDataLinkFilledType = {
//   [T in keyof FormDataLinksType]?: boolean;
// };

// interface FormDataType {
//   name: string;
//   username: string;
//   links: FormDataLinksType;
//   skills: string[];
//   avatar: File | null;
//   NFT: string | null;
// }

// const EditProfile: React.FC<EditProfileProps> = ({ onClose }) => {
//   const [getMemberDetails] = useGetMemberByIdMutation();
//   const [memberUpdate] = useUpdateMemberMutation();
//   const [checkUserName] = useLazyCheckUserNameQuery();
//   const [isValid, setIsValid] = useState<boolean>(true);
//   const [load, setLoad] = useState<boolean>(true);
//   const [defaultUserName, setDefaultUserName] = useState<string>('');
//   const [picUrl, setPicUrl] = useState<string>('');
//   const [data, setData] = useState<member>();
//   const [formData, setFormData] = useState<FormDataType>({
//     NFT: null,
//     name: '',
//     username: '',
//     skills: [],
//     avatar: null,
//     links: {
//       twitter: '',
//       behance: '',
//       dribbble: '',
//       mirror: '',
//       linkedIn: ''
//     },
//   });
//   const [uploadProfilePic] = useUploadProfilePicMutation();
//   const dispatch = useTypedDispatch();
//   useEffect(() => {
//     const fun = async () => {
//       try {
//         const res = await getMemberDetails({
//           member: { type: 'member_id', value: profile!.member_id },
//         }).unwrap();
//         setData(res?.data?.member);
//         setDefaultUserName(res.data?.member?.username || '');
//         const socials: any = { twitter: '', behance: '', dribbble: '', mirror: '' };
//         res.data?.socials?.forEach((val) => (socials[val.type] = val.url));
//         const data: FormDataType = {
//           name: res.data?.member?.name || '',
//           username: res.data?.member?.username || '',
//           skills: [],
//           avatar: null,
//           NFT: null,
//           links: socials as FormDataLinksType,
//         };
//         setFormData(data);
//         console.log(res);
//       } catch (err: any) {
//         toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
//       }
//     };
//     fun();
//   }, []);

//   const handleChange = (name: keyof Omit<FormDataType, 'links'>) => {
//     return (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData({ ...formData, [name]: e.target.value });
//       if (name === 'username') {
//         checkUserName(e.target.value.trim().toLowerCase())
//           .unwrap()
//           .then((res) => {
//             setFormData({ ...formData, [name]: e.target.value });
//             if (!res.data?.exist) setIsValid(true);
//             else if (defaultUserName === e.target.value.toLowerCase()) setIsValid(true);
//             else setIsValid(false);
//           });
//       }
//     };
//   };

//   const handleSave = async () => {
//     if (!formData.name.trim()) return toast('Failure', 5000, 'Name is required', '')();
//     if (!formData.username.trim())
//       return toast('Failure', 5000, 'Username is required', '')();
//     try {
//       setLoad(false);
//       if (formData.avatar || formData.NFT) {
//         const member_id = getMemberId();
//         let imageData = new FormData();
//         imageData.append('file', formData.avatar!);
//         imageData.append('memberId', member_id);
//         imageData.append('typeOfProfilePicture', !!formData.NFT ? '1' : '0');
//         imageData.append('nftProfilePicture', !!formData.NFT ? formData.NFT : '');
//         uploadProfilePic(imageData)
//           .unwrap()
//           .then((res) => {
//             console.log(res);
//             setPicUrl(res.data);
//             dispatch(changeProfilePicture({ profilePicture: res.data }));
//           })
//           .catch((err) => {
//             setLoad(true);
//             toast('Failure', 5000, 'Profile Picture update failed', '')();
//           });
//       }

//       const payload = {
//         member: {
//           member_id: getMemberId(),
//           username: formData.username.toLowerCase().trim(),
//           did: data?.did || '',
//           open_for_opportunity: data?.open_for_opportunity || false,
//           captain: data?.captain || false,
//           name: formData.name,
//           email: data?.email || '',
//           about: data?.about || '',
//           skills: [],
//           profile_picture: picUrl || data?.profile_picture || '',
//           ceramin_stream: data?.ceramic_stream || '',
//         },
//         socials: [
//           {
//             member_id: getMemberId(),
//             type: 'twitter',
//             url: formData.links.twitter,
//           },
//           {
//             member_id: getMemberId(),
//             type: 'behance',
//             url: formData.links.behance,
//           },
//           {
//             member_id: getMemberId(),
//             type: 'dribbble',
//             url: formData.links.dribbble,
//           },
//           {
//             member_id: getMemberId(),
//             type: 'mirror',
//             url: formData.links.mirror,
//           },
//         ],
//       };

//       const res = await memberUpdate(payload).unwrap();
//       setLoad(true);

//       toast('Success', 5000, 'Reload the page to get the updated profile', '')();
//       onClose?.();
//     } catch (err: any) {
//       setLoad(true);
//       toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
//     }
//   };

//   const handleLinks = (name: keyof FormDataLinksType) => {
//     return (value: string) => {
//       setFormData({ ...formData, links: { ...formData.links, [name]: value } });
//     };
//   };

//   const handleAddSkill = (skill: string) => {
//     setFormData({ ...formData, skills: [...formData.skills, skill] });
//   };

//   const handleRemoveSkill = (skill: string) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((s) => s !== skill),
//     });
//   };

//   const handleAvatar = (file: File) => {
//     if (file!.size > 1000000) {
//       toast('Failure', 5000, 'Please Select an Image less than 1MB', '')();
//       return;
//     }
//     setFormData({ ...formData, avatar: file, NFT: null });
//   };

//   const handleNFT = (file: string) => {
//     setFormData({ ...formData, NFT: file, avatar: null });
//   };

//   return (
//     <Popup className={styles.root} onClose={onClose}>
//       <h2 className={styles.title}>Edit Profile</h2>
//       <div className={styles.main}>
//         <ProfilePicture
//           avatar={formData.avatar}
//           onChange={handleAvatar}
//           handleNFT={handleNFT}
//         />
//         <Input
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange('name')}
//           title="Name"
//           className={styles.input}
//         />
//         <div>
//           <Input
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange('username')}
//             title="Username"
//             className={styles.input}
//           />
//           {!isValid && (
//             <h6 className="setup-img__title profile-setup__title">
//               Please enter a different username
//             </h6>
//           )}
//         </div>
//       </div>
//       <div className={styles.extra}>
//         <PorfolioLinks links={formData.links} onChange={handleLinks} />
//         <EditProfileSkills
//           skills={formData.skills}
//           onAddSkill={handleAddSkill}
//           onRemoveSkill={handleRemoveSkill}
//         />
//       </div>
//       <div className={styles.controls}>
//         <Button color="green" className={styles.saveBtn} onClick={handleSave}>
//           <span>Save</span>
//         </Button>
//       </div>
//     </Popup>
//   );
// };

// export default EditProfile;
