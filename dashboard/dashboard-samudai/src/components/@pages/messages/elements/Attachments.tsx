import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Navigation } from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { HatButton, HatTitle } from 'components/chat/elements/Components';
import Hat from 'components/chat/elements/Hat';
import Workspace from 'components/chat/elements/Workspace';
import { filterFiles, getFileIcon } from 'components/chat/utils/files';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Search from 'ui/@form/Input/Input';
import Attachment from 'ui/Attachment/Attachment';
import ChatIcon from 'ui/SVG/ChatIcon';
import Magnifier from 'ui/SVG/Magnifier';
import TrashIcon from 'ui/SVG/TrashIcon';
import TextOverflow from 'ui/TextOverflow/TextOverflow';
import { FileHelper } from 'utils/helpers/FileHelper';
import { attachments1 as data } from '../temp_data';
import styles from '../styles/Attachments.module.scss';

interface AttachmentsProps {
    onClickBack?: () => void;
}

const COUNT_SHOW_PAGES = 6;

const Attachments: React.FC<AttachmentsProps> = ({ onClickBack }) => {
    const [value, setValue] = useState<string>('');
    const [page, setPage] = useState<number>(0);

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleNavPage = (next: number) => {
        const nextPage = page + next;

        if (nextPage !== 0) {
            setPage(nextPage);
        }
    };

    const handleChangePage = (page?: number) => {
        if (page !== undefined) {
            setPage(page);
        }
    };

    const sliderSettings: SwiperProps = {
        slidesPerView: 1,
        modules: [Navigation],
        navigation: {
            nextEl: `.${styles.imagesNext}`,
        },
        breakpoints: {
            385: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 3,
            },
            1366: {
                slidesPerView: 4,
            },
        },
    };

    const images = filterFiles(data, [FileHelper.extensions.image]);
    const files = filterFiles(data, [], [FileHelper.extensions.image]);
    const pages = Math.ceil(files.length / COUNT_SHOW_PAGES);

    return (
        <React.Fragment>
            <Hat className={styles.hat}>
                <HatTitle text="Attachments" />
                <HatButton icon={<ChatIcon />} text="Back to Chat" onClick={onClickBack} />
                {/* <div className={styles.hatRight}>
          <HatButton icon={<ChatIcon />} text="Back to Chat" />
          <Settings className={styles.hatSettings}>
            <Settings.Item icon="/img/icons/information.svg" title="Unknown" />
            <Settings.Item icon="/img/icons/information.svg" title="Unknown 2" />
            <Settings.Item icon="/img/icons/information.svg" title="Unknown 3" />
          </Settings>
        </div> */}
            </Hat>
            <Workspace className={styles.workspace}>
                <div className={styles.head}>
                    <Search
                        value={value}
                        icon={<Magnifier />}
                        className={styles.input}
                        onChange={handleChangeValue}
                        placeholder="Search File"
                    />
                    <button className={styles.uploadBtn}>
                        <img src="/img/icons/upload.svg" alt="upload" />
                        <span>Upload Files</span>
                    </button>
                </div>

                {images.length > 0 && (
                    <div className={styles.images}>
                        <div className={styles.imagesWrapper}>
                            <Swiper {...sliderSettings} className={styles.swiper}>
                                {images.map((file) => (
                                    <SwiperSlide key={file.id} className={styles.swiperSlide}>
                                        <Attachment name={file.name} url={file.url} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <NavButton variant="next" className={styles.imagesNext} />
                        </div>
                    </div>
                )}

                <div className={styles.files}>
                    <ul className={styles.filesList}>
                        <li className={clsx(styles.filesItem, styles.filesItemTitle)}>
                            <div className={clsx(styles.filesCol, styles.filesColCheckbox)}>
                                <Checkbox
                                    className={styles.filesCheckbox}
                                    active={false}
                                    value={null}
                                />
                            </div>
                            <div className={clsx(styles.filesCol, styles.filesColTitle)}>
                                <p className={styles.filesText}>NAME</p>
                            </div>
                            <div className={clsx(styles.filesCol, styles.filesColSize)}>
                                <p className={styles.filesText}>SIZE</p>
                            </div>
                            <div className={clsx(styles.filesCol, styles.filesColDate)}>
                                <p className={styles.filesText}>Date</p>
                            </div>
                            <div className={clsx(styles.filesCol, styles.filesColControls)}>
                                <p className={clsx(styles.filesText, styles.filesTextWhite)}>
                                    {files.length} items
                                </p>
                            </div>
                        </li>
                        {files
                            .slice(
                                page * COUNT_SHOW_PAGES,
                                page * COUNT_SHOW_PAGES + COUNT_SHOW_PAGES
                            )
                            .map((item) => (
                                <li key={item.id} className={styles.filesItem}>
                                    <div className={clsx(styles.filesCol, styles.filesColCheckbox)}>
                                        <Checkbox
                                            className={styles.filesCheckbox}
                                            active={false}
                                            value={null}
                                        />
                                    </div>
                                    <div className={clsx(styles.filesCol, styles.filesColTitle)}>
                                        <img
                                            className={styles.filesIcon}
                                            src={getFileIcon(item.name) || ''}
                                            alt="icon"
                                        />
                                        <TextOverflow className={styles.filesTitle}>
                                            {FileHelper.getOnlyFileName(item.name)}
                                        </TextOverflow>
                                    </div>
                                    <div className={clsx(styles.filesCol, styles.filesColSize)}>
                                        <p className={styles.filesText}>{item.size}</p>
                                    </div>
                                    <div className={clsx(styles.filesCol, styles.filesColDate)}>
                                        <p className={styles.filesText}>
                                            {dayjs(item.date).format('DD MMM YYYY, hh:mm a')}
                                        </p>
                                    </div>
                                    <div className={clsx(styles.filesCol, styles.filesColControls)}>
                                        <button
                                            className={clsx(
                                                styles.controlsBtn,
                                                styles.controlsBtnDownload
                                            )}
                                        >
                                            <img src="/img/icons/download.svg" alt="download" />
                                        </button>
                                        <button
                                            className={clsx(
                                                styles.controlsBtn,
                                                styles.controlsBtnRemove
                                            )}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                    {pages > 1 && (
                        <ReactPaginate
                            className={styles.filesPaginate}
                            pageClassName={styles.filesPaginatePage}
                            activeClassName={styles.filesPaginatePageActive}
                            pageCount={pages}
                            forcePage={page}
                            marginPagesDisplayed={0}
                            pageRangeDisplayed={COUNT_SHOW_PAGES}
                            breakLabel={false}
                            onClick={({ nextSelectedPage }) => handleChangePage(nextSelectedPage)}
                            previousLabel={<NavButton onClick={() => handleNavPage(-1)} />}
                            nextLabel={
                                <NavButton variant="next" onClick={() => handleNavPage(1)} />
                            }
                        />
                    )}
                </div>
            </Workspace>
        </React.Fragment>
    );
};

export default Attachments;
