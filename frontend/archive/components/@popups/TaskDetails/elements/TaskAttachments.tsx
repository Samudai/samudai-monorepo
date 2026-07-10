import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskFile, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { Navigation } from 'swiper';
import SwiperCore from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { useGetTasksByProjectIdQuery } from 'store/services/projects/totalProjects';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import FileInput from 'ui/@form/FileInput/FileInput';
import Attachment from 'ui/Attachment/Attachment';
import { downloadFile, uploadFile } from 'utils/fileupload/fileupload';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import styles from '../styles/TaskAttachments.module.scss';

interface TaskAttachmentsProps {
    task: TaskResponse;
    getTaskDeatils: () => Promise<void>;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ task, getTaskDeatils }) => {
    const params = useParams();
    const [attachments, setAttachments] = useState<TaskFile[]>([]);
    const [swiper, setSwiper] = useState<SwiperCore | null>(null);
    const {
        data: taskData,
        isSuccess: taskSuccess,
        refetch,
    } = useGetTasksByProjectIdQuery(params.id!);
    const settings: SwiperProps = {
        slidesPerView: 1,
        modules: [Navigation],
        loop: true,
        allowTouchMove: false,
        loopedSlides: 4,
        navigation: {
            nextEl: `.${styles.next}`,
        },
        onInit: setSwiper,
    };
    const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'png', 'jpg', 'jpeg'];
    const handleFileLoad = async (file: File | null) => {
        const ext = file?.name.split('.').pop();
        if (ext && !validExtensions.includes(ext))
            return toast('Failure', 5000, 'Invalid file type', '')();
        if (!file) return toast('Failure', 5000, 'Invalid file type', '')();
        if (file?.size > 1e7) return toast('Failure', 5000, 'File size too large', '')();
        toast('Attention', 5000, 'Uploading file...', '')();
        const res = await uploadFile(file, FileUploadType.TASK, StorageType.SPACES, task.task_id);
        setAttachments((prev) => [...prev, res as TaskFile]);
        setTimeout(() => {
            getTaskDeatils();
            getTaskDeatils();
        }, 1000);
        toast('Success', 5000, 'File uploaded successfully', '')();
        refetch();
    };

    useEffect(() => {
        refetch();
        const attachments = taskData?.data?.find((t) => t.task_id === task.task_id);
        console.log(attachments);
        setAttachments(attachments?.files || []);
    }, []);

    useEffect(() => {
        swiper?.update();
    }, [attachments, swiper]);

    const attachmentsList = attachments || [];

    return (
        <div className={styles.root}>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <FileInput onChange={handleFileLoad}>
                        <div className={styles.file}>
                            <div className={styles.fileBox}></div>
                            <p className={styles.fileText}>Add new files</p>
                        </div>
                    </FileInput>
                </li>
                <li className={styles.item}>
                    <div className={styles.slider}>
                        <Swiper
                            {...settings}
                            loop={attachmentsList.length > 1}
                            className={styles.swiper}
                        >
                            {attachmentsList.map((file, id) => (
                                <SwiperSlide className={styles.item} key={id}>
                                    <div
                                        onClick={() => {
                                            downloadFile(file.url, StorageType.SPACES, file.name);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Attachment
                                            key={file.task_file_id}
                                            name={file.name}
                                            url={file.url}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <NavButton
                        variant="next"
                        className={clsx(styles.next, attachmentsList.length < 2 && styles.nextHide)}
                        disabled={attachmentsList.length < 2}
                    />
                </li>
            </ul>
        </div>
    );
};

export default TaskAttachments;
