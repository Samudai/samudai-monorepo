import { Navigation } from 'swiper';
import { SwiperProps } from 'swiper/react';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import { ProjectHelper } from 'utils/helpers/ProjectHelper';
import styles from '../styles/ProjectAttachments.module.scss';
import FileInput from 'ui/@form/FileInput/FileInput';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';

interface ProjectAttachmentsProps {
    project: ProjectResponse;
}

const ProjectAttachments: React.FC<ProjectAttachmentsProps> = ({ project }) => {
    const files = ProjectHelper.getAttachmentsAll(project);

    const sliderSettings: SwiperProps = {
        slidesPerView: 4,
        allowTouchMove: false,
        loop: true,
        modules: [Navigation],
        navigation: {
            enabled: true,
            nextEl: `.${styles.filesNextBtn}`,
        },
    };

    return (
        <div className={styles.root}>
            <h3 className={styles.title}>
                <AttachmentIcon className={styles.titleIcon} />
                <p className={styles.titleText}>{/* Attachments <span>{files.length}</span> */}</p>
            </h3>
            <div className={styles.files}>
                <div className={styles.filesInner}>
                    <ul className={styles.filesList}>
                        <li className={styles.filesField}>
                            <div className={styles.filesSwiperItem}>
                                <FileInput className={styles.filesInput}>
                                    <div className={styles.filesInputContent}>
                                        <span className={styles.filesInputCross}></span>
                                    </div>
                                </FileInput>
                                <p className={styles.filesInputText}>Add new files</p>
                            </div>
                        </li>
                        <li className={styles.filesSlider}>
                            {/* <Swiper {...sliderSettings} className={styles.filesSwiper}>
                {files.map((file, id) => (
                  <SwiperSlide className={styles.filesSwiperItem}>
                    <Attachment
                      className={styles.filesSwiperFile}
                      name={file}
                      url={file}
                      key={id}
                    />
                  </SwiperSlide>
                ))}
              </Swiper> */}
                        </li>
                    </ul>
                </div>

                <div className={styles.filesNext}>
                    <NavButton variant="next" className={styles.filesNextBtn} />
                </div>
            </div>
        </div>
    );
};

export default ProjectAttachments;
