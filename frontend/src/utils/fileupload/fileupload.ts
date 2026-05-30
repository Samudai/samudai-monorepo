import { decrypt, decryptForView, encrypt } from './enc-dec';
import {
    BountyFile,
    DiscussionEnums,
    JobFile,
    Message,
    ProjectFile,
    TaskFile,
} from '@samudai_xyz/gateway-consumer-types';
import axios from 'axios';
import store from 'store/store';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import { getMemberId } from 'utils/utils';
import { makeStorage } from './web3storage';

const headers = {
    authorization: 'Bearer ' + store.getState().commonReducer.jwt,
};

export const uploadFile = async (
    file: File,
    fileUploadType: FileUploadType,
    storageType: StorageType,
    id?: string
) => {
    try {
        if (storageType === StorageType.IPFS) {
            const storage = makeStorage();

            const fileArray = await file.arrayBuffer();
            const encryptedFile = encrypt(fileArray);
            const fileData = new File([encryptedFile as any], file.name, { type: file.type });
            const cid = await storage.put([fileData]);
            const url = cid.toString();
            console.log('url', url);
            if (fileUploadType === FileUploadType.PROJECT) {
                const projectFile: ProjectFile = {
                    project_file_id: '',
                    folder_id: id!,
                    name: file.name,
                    url: url,
                    metadata: {},
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/file/upload/project`,
                    {
                        projectFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    projectFile.project_file_id = fileUploadResult.data.data.project_file_id;
                    return projectFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.TASK) {
                const taskFile: TaskFile = {
                    task_file_id: '',
                    task_id: id!,
                    name: file.name,
                    url: url,
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/file/upload/task`,
                    {
                        taskFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    taskFile.task_file_id = fileUploadResult.data.data.task_file_id;
                    return taskFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.DISCUSSIONS) {
                const dicussionFile: Message = {
                    message_id: '',
                    discussion_id: id!,
                    type: DiscussionEnums.MessageType.FILE,
                    content: file.name,
                    attachment_link: url,
                    sender_id: getMemberId()!,
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/discussion/message/create`,
                    {
                        message: dicussionFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    return url;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.JOB) {
                const jobFile: JobFile = {
                    job_file_id: '',
                    job_id: id!,
                    name: file.name,
                    url: url,
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/jobsFile/create`,
                    {
                        jobFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    jobFile.job_file_id = fileUploadResult.data.data.job_file_id;
                    return jobFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.BOUNTY) {
                const bountyFile: BountyFile = {
                    bounty_file_id: '',
                    bounty_id: id!,
                    name: file.name,
                    url: url,
                    metadata: {},
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/bountyFile/create`,
                    {
                        bountyFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    bountyFile.bounty_file_id = fileUploadResult.data.data.bounty_file_id;
                    return bountyFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.RESPONSE) {
                return url;
            }
        } else if (storageType === StorageType.SPACES) {
            const fileData = new FormData();
            fileData.append('file', file);
            let url = '';

            const fileUploadResult = await axios.post(
                `${process.env.REACT_APP_GATEWAY}api/upload/spaces`,
                fileData,
                {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('jwt'),
                    },
                }
            );
            if (fileUploadResult.data) {
                url = fileUploadResult.data.data;
            }

            if (fileUploadType === FileUploadType.PROJECT) {
                const projectFile: ProjectFile = {
                    project_file_id: '',
                    folder_id: id!,
                    name: file.name,
                    url: url,
                    metadata: {},
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/file/upload/project`,
                    {
                        projectFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    projectFile.project_file_id = fileUploadResult.data.data.project_file_id;
                    return projectFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.TASK) {
                const taskFile: TaskFile = {
                    task_file_id: '',
                    task_id: id!,
                    name: file.name,
                    url: url,
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/file/upload/task`,
                    {
                        taskFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    taskFile.task_file_id = fileUploadResult.data.data.task_file_id;
                    return taskFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.DISCUSSIONS) {
                const dicussionFile: Message = {
                    message_id: '',
                    discussion_id: id!,
                    type: DiscussionEnums.MessageType.FILE,
                    content: file.name,
                    attachment_link: url,
                    sender_id: getMemberId()!,
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/discussion/message/create`,
                    {
                        message: dicussionFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    return url;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.JOB) {
                const jobFile: JobFile = {
                    job_file_id: '',
                    job_id: id!,
                    name: file.name,
                    url: url,
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/jobsFile/create`,
                    {
                        jobFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    jobFile.job_file_id = fileUploadResult.data.data.job_file_id;
                    return jobFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.BOUNTY) {
                const bountyFile: BountyFile = {
                    bounty_file_id: '',
                    bounty_id: id!,
                    name: file.name,
                    url: url,
                    metadata: {},
                };
                const fileUploadResult = await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/bountyFile/create`,
                    {
                        bountyFile,
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoid: store.getState().commonReducer.activeDao,
                        },
                    }
                );
                if (fileUploadResult.status === 200) {
                    bountyFile.bounty_file_id = fileUploadResult.data.data.bounty_file_id;
                    return bountyFile;
                } else {
                    return null;
                }
            } else if (fileUploadType === FileUploadType.RESPONSE) {
                return url;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const downloadFile = async (url: string, storageType: StorageType, name: string) => {
    try {
        if (storageType === StorageType.IPFS) {
            fetch(`https://${url}.ipfs.w3s.link/${encodeURIComponent(name)}`)
                .then((data) => data.blob())
                .then((blob) => {
                    const file = new File([blob], name, {
                        type: blob.type,
                    });
                    const dec = decrypt(file);
                })
                .catch((err) => {
                    toast('Failure', 5000, 'Failed to download file', 'error')();
                    console.log(err);
                });
            // const storage = makeStorage();
            // const result = await storage.get(url);

            // const files: any = result?.files();
            // result?.files().then((files: any) => {
            //   console.log(files);
            // });

            // files![0].arrayBuffer().then((buffer: any) => {
            //   const file = new File([buffer], files![0].name);
            //   const dec = decrypt(file);
            // });
        } else {
            fetch(url)
                .then((data) => data.blob())
                .then((blob) => {
                    const file = new File([blob], name, {
                        type: blob.type,
                    });
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(file);
                    const filename = name;
                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
        }
    } catch (err) {
        toast('Failure', 5000, 'Failed to download file', 'error')();
        console.log(err);
    }
};

export const previewFile = async (
    url: string,
    storageType: StorageType,
    name: string
): Promise<any> => {
    try {
        if (storageType === StorageType.IPFS) {
            return new Promise((resolve, reject) => {
                fetch(`https://${url}.ipfs.w3s.link/${encodeURIComponent(name)}`)
                    .then((data) => data.blob())
                    .then(async (blob) => {
                        const file = new File([blob], name, {
                            type: blob.type,
                        });

                        const url = await decryptForView(file);
                        if (url) {
                            resolve(url);
                        } else {
                            reject('Failed to decrypt file , error');
                        }
                    });
            });
        }
    } catch (err) {
        toast('Failure', 5000, 'Failed to Preview file', 'error')();
        console.log(err);
    }
};
