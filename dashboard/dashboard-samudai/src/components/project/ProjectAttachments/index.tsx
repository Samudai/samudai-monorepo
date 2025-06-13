import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { ProjectFile, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { folderRes } from 'store/services/projects/model';
import {
    useDeleteFileinFolderMutation,
    useLazyGetFoldersByPIDQuery,
} from 'store/services/projects/totalProjects';
import useInput from 'hooks/useInput';
import usePopup from 'hooks/usePopup';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import AddNewFolder from 'components/project/ProjectAttachments/AddNewFolder';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import FileInput from 'ui/@form/FileInput/FileInput';
import Input from 'ui/@form/Input/Input';
import { DatePeriodPeriod } from 'ui/@form/date-period/date-period';
import { File } from 'ui/Attachment';
import Magnifier from 'ui/SVG/Magnifier';
import PlusIcon from 'ui/SVG/PlusIcon';
import UploadIcon from 'ui/SVG/UploadIcon';
import { uploadFile } from 'utils/fileupload/fileupload';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import ProjectAttachmentsItem from './ProjectAttachmentsItem';
import ProjectFolder from './ProjectFolder';
import styles from './styles/ProjectAttachments.module.scss';
import itemStyles from './styles/ProjectAttachmentsItem.module.scss';

interface ProjectAttachmentsProps {
    onClose?: () => void;
    project?: ProjectResponse;
}

// Config
const MAX_ELEMENTS_PER_PAGE = 4;
const COUNT_SHOW_PAGES = 4;

const ProjectAttachments: React.FC<ProjectAttachmentsProps> = ({ onClose, project }) => {
    const [search, setSearch] = useInput('');
    const [swiper, setSwiper] = useState<SwiperCore | null>(null);
    const [, setActiveSlide] = useState(0);
    const [page, setPage] = useState(0);
    const [period, setPeriod] = useState<DatePeriodPeriod>({
        start: null,
        end: null,
    });
    const [showCalendar, setShowCalendar] = useState(false);
    const addFolderPopup = usePopup();
    const [folders, setFolders] = useState<folderRes[]>([] as folderRes[]);
    const [foldersFilter, setFoldersFilter] = useState<ProjectFile[]>([] as ProjectFile[]);
    const [selectedFolder, setSelectedFolder] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);

    const [deleteFile] = useDeleteFileinFolderMutation();
    const [getFolders] = useLazyGetFoldersByPIDQuery();
    const access = project?.access === 'manage_project';

    const fun = async () => {
        try {
            setLoad(true);
            if (!project?.project_id) return;
            const res = await getFolders(project.project_id, true).unwrap();
            setFolders(res?.data ? res.data : ([] as folderRes[]));
            setLoad(false);
        } catch (err) {
            setLoad(false);
            console.log(err);
        }
    };
    useEffect(() => {
        fun();
    }, [project?.project_id]);

    const swiperProps: SwiperProps = {
        slidesPerView: 2,
        allowTouchMove: false,
        modules: [Navigation],
        navigation: {
            prevEl: `.${styles.prevButton}`,
            nextEl: `.${styles.nextButton}`,
        },
        breakpoints: {
            505: {
                slidesPerView: 3,
            },
            676: {
                slidesPerView: 4,
            },
            851: {
                slidesPerView: 5,
            },
            992: {
                slidesPerView: 6,
            },
        },
        onInit: setSwiper,
        onSlideChange: (swiper) => setActiveSlide(swiper.activeIndex),
    };

    const handleNavPage = (next: number) => {
        const nextPage = page + next;
        const check = Math.ceil((foldersFilter || [])?.length / MAX_ELEMENTS_PER_PAGE);
        if (nextPage <= 0 || nextPage >= check) return;

        if (nextPage !== 0) {
            setPage(nextPage);
        }
    };

    const handleChangePage = (page?: number) => {
        if (page !== undefined) {
            setPage(page);
        }
    };

    const formattedPeriod = (() => {
        if (period.start && period.end) {
            return dayjs(period.start).format('DD') + ' - ' + dayjs(period.end).format('DD MMM');
        }

        return 'All time';
    })();
    const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'jpg', 'jpeg', 'png'];

    const handleFileLoad = async (file: File | null) => {
        try {
            const ext = file?.name.split('.').pop();
            if (ext && !validExtensions.includes(ext)) {
                toast('Attention', 5000, 'File format not supported', 'Upload a different file')();
                return;
            }

            if (!file) return toast('Failure', 5000, 'Upload a file', '')();
            if (file?.size > 1e7) return toast('Failure', 5000, 'Upload a smaller file', '')();
            toast('Attention', 3000, 'Uploading File', '')();
            const res = await uploadFile(
                file,
                FileUploadType.PROJECT,
                StorageType.SPACES,
                selectedFolder
            );
            setFolders([
                ...folders.filter((folder) => folder.folder_id !== selectedFolder),
                {
                    ...folders.find((f) => f.folder_id === selectedFolder),
                    files: [
                        ...(folders.find((f) => f.folder_id === selectedFolder)?.files || []),
                        res,
                    ] as ProjectFile[],
                },
            ] as folderRes[]);
            // console.log([
            //   ...folders,
            //   {
            //     ...folders.find((f) => f.folder_id === selectedFolder),
            //     files: [
            //       ...(folders.find((f) => f.folder_id === selectedFolder)?.files || []),
            //       res,
            //     ] as ProjectFile[],
            //   },
            // ]);

            toast('Success', 5000, 'File uploaded', '')();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleFileDelete = async (id: string) => {
        try {
            const res = await deleteFile(id).unwrap();
            if (res?.data) {
                setFolders([
                    ...folders.filter((folder) => folder.folder_id !== selectedFolder),
                    {
                        ...folders.find((f) => f.folder_id === selectedFolder),
                        files: [
                            ...(
                                folders.find((f) => f.folder_id === selectedFolder)?.files || []
                            ).filter((file) => file.project_file_id !== id),
                        ] as ProjectFile[],
                    },
                ] as folderRes[]);
                toast('Success', 5000, 'File deleted', '')();
            }
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    useEffect(() => {
        if (!search)
            setFoldersFilter(
                folders?.find((item) => item.folder_id === selectedFolder)?.files ||
                    ([] as ProjectFile[])
            );
        else {
            const select = folders?.find((item) => item?.folder_id === selectedFolder);
            setFoldersFilter(
                (select || ({} as folderRes))?.files?.filter((f) =>
                    f.name.toLowerCase().includes(search.toLowerCase())
                ) || ([] as ProjectFile[])
            );
        }
    }, [search, selectedFolder, folders]);

    return !load ? (
        <Popup
            className={styles.root}
            onClose={onClose}
            dataParentId="project_board_attachment_modal"
        >
            <h2 className={styles.title}>Project Attachments</h2>
            {/* Folders */}
            <div className={styles.folders}>
                <div className={styles.row}>
                    <h3 className={styles.smallTitle}>Folders</h3>
                    {access && (
                        <button
                            className={styles.addBtn}
                            onClick={addFolderPopup.open}
                            data-analytics-click="add_folder_button"
                        >
                            <PlusIcon />
                            <span>Add Folder</span>
                        </button>
                    )}
                </div>
                {folders.length > 0 && (
                    <div
                        className={clsx(styles.foldersList, {
                            [styles['--start']]: swiper?.isBeginning,
                            [styles['--end']]: swiper?.isEnd,
                        })}
                    >
                        <Swiper className={styles.foldersSwiper} {...swiperProps}>
                            {folders.map((item) => (
                                <SwiperSlide
                                    className={styles.foldersItem}
                                    key={item.name}
                                    onClick={() => {
                                        setSelectedFolder(item?.folder_id);
                                    }}
                                >
                                    <ProjectFolder
                                        name={item?.name}
                                        files={item?.files?.length || 0}
                                        key={item?.folder_id}
                                        id={item?.folder_id}
                                        setFolders={setFolders}
                                        access={access}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <NavButton
                            className={styles.prevButton}
                            data-visible={!swiper?.isBeginning}
                        />
                        <NavButton
                            className={styles.nextButton}
                            variant="next"
                            data-visible={!swiper?.isEnd}
                        />
                    </div>
                )}
                {folders.length === 0 && (
                    <div
                        className="transactions__header"
                        style={{
                            marginTop: '20px',
                            color: '#fdc087',
                            padding: '90px 0',
                            textAlign: 'center',
                        }}
                    >
                        No folders found
                    </div>
                )}
            </div>
            {/* Files */}
            {!!selectedFolder && (
                <div className={styles.files}>
                    <div className={styles.files_head}>
                        <h3 className={styles.smallTitle}>Files</h3>

                        <FileInput
                            className={clsx(styles.addBtn, styles.addBtn_mobile)}
                            onChange={handleFileLoad}
                        >
                            <UploadIcon />
                            <span>Upload Files</span>
                        </FileInput>
                    </div>
                    <div className={clsx(styles.row, styles.rowFiles)}>
                        <Input
                            placeholder="Search File"
                            value={search}
                            onChange={setSearch}
                            className={styles.search}
                            icon={<Magnifier className={styles.searchIcon} />}
                        />
                        {/* <div className={styles.calendarPeriod}>
            <button
              className={styles.calendarPeriodBtn}
              onClick={setShowCalendar.bind(null, !showCalendar)}
            >
              <CalendarSearch />
              <span>{formattedPeriod}</span>
            </button>
            {showCalendar && (
              <DatePeriod
                period={period}
                onPeriodChange={setPeriod}
                onClose={setShowCalendar.bind(null, false)}
              />
            )}
          </div> */}
                        {access && (
                            <FileInput className={styles.addBtn} onChange={handleFileLoad}>
                                <UploadIcon />
                                <span>Upload Files</span>
                            </FileInput>
                        )}
                    </div>
                    {/* Files > List */}
                    {foldersFilter.length > 0 ? (
                        <div className={styles.filesTable}>
                            <div className={clsx(styles.filesTitle, itemStyles.attch)}>
                                <div className={styles.attch_wrapper}>
                                    {/* <div className={itemStyles.checkboxCol}>
              <Checkbox active={false} className={itemStyles.checkbox} />
            </div> */}
                                    <div className={itemStyles.fileCol} data-mobile-hide>
                                        <p className={styles.filesTitleName}>Name</p>
                                    </div>
                                    {/* <div className={itemStyles.sizeCol}>
                  <p className={styles.filesTitleName}>Size</p>
                </div> */}
                                    <div className={itemStyles.dateCol}>
                                        <p className={styles.filesTitleName}>Date</p>
                                    </div>
                                    <div className={itemStyles.controlsCol} data-mobile-pd>
                                        <p className={styles.filesTitleLength}>
                                            {folders?.length} items
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <ul className={clsx(styles.filesList, 'orange-scrollbar')}>
                                {foldersFilter
                                    ?.slice(
                                        page * MAX_ELEMENTS_PER_PAGE,
                                        page * MAX_ELEMENTS_PER_PAGE + MAX_ELEMENTS_PER_PAGE
                                    )
                                    .map((file) => (
                                        <ProjectAttachmentsItem
                                            name={file.name}
                                            size={file.metadata?.size}
                                            createdAt={file.created_at}
                                            url={file.url}
                                            key={file.project_file_id}
                                            handleFileDelete={handleFileDelete}
                                            id={file.project_file_id}
                                            access={access}
                                        />
                                    ))}
                            </ul>
                            {(foldersFilter || []).length > 0 && (
                                <ReactPaginate
                                    className={styles.paginate}
                                    pageClassName={styles.paginatePage}
                                    activeClassName={styles.paginatePageActive}
                                    pageCount={Math.ceil(
                                        (foldersFilter || [])?.length / MAX_ELEMENTS_PER_PAGE
                                    )}
                                    forcePage={page}
                                    marginPagesDisplayed={0}
                                    pageRangeDisplayed={Math.ceil(
                                        (foldersFilter || [])?.length / MAX_ELEMENTS_PER_PAGE
                                    )}
                                    breakLabel={false}
                                    onClick={({ nextSelectedPage }) =>
                                        handleChangePage(nextSelectedPage)
                                    }
                                    previousLabel={<NavButton onClick={() => handleNavPage(-1)} />}
                                    nextLabel={
                                        <NavButton
                                            variant="next"
                                            onClick={() => handleNavPage(1)}
                                        />
                                    }
                                />
                            )}
                        </div>
                    ) : (
                        <div
                            className="transactions__header"
                            style={{
                                marginTop: '20px',
                                color: '#fdc087',
                                padding: '70px 0',
                                textAlign: 'center',
                            }}
                        >
                            No files found
                        </div>
                    )}
                </div>
            )}
            <PopupBox active={addFolderPopup.active} onClose={addFolderPopup.close}>
                <AddNewFolder
                    onClose={addFolderPopup.close}
                    setFolders={setFolders}
                    project={project!}
                />
            </PopupBox>
        </Popup>
    ) : (
        <Loader />
    );
};

export default ProjectAttachments;
