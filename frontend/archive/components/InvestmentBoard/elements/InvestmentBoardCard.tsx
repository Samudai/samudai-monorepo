import React from 'react';
import { Draggable, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import Members from 'ui/Members/Members';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import PenIcon from 'ui/SVG/PenIcon';
import { cutText } from 'utils/format';
import { FileHelper } from 'utils/helpers/FileHelper';
import { ITask } from 'utils/types/Project';
import styles from '../styles/BoardCard.module.scss';

interface BoardCardProps {
  item: TaskResponse;
  index: number;
  className?: string;
  onClick: (id: string) => void;
  editPopup: () => void;
  investment?: boolean;
}

const InvestmentBoardCard: React.FC<BoardCardProps> = ({
  item,
  index,
  className,
  onClick,
  editPopup,
  investment = false,
}) => {
  const { title, assignees: contributors, files: attachments, comments } = item;

  const getDraggableStyle = (
    isDragging: boolean,
    styles: DraggableProvidedDraggableProps['style']
  ) => ({
    ...styles,
    cursor: isDragging ? 'grab' : 'pointer',
  });
  return (
    <Draggable
      draggableId={item.task_id.toString() || item.mongo_object?.toString() || ''}
      index={index}
      key={item.task_id || item.mongo_object?.toString() || ''}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getDraggableStyle(snapshot.isDragging, provided.draggableProps.style)}
          className={clsx(styles.root, className)}
          onClick={() => onClick(item.task_id)}
          data-role="board-card"
        >
          <div className={styles.head}>
            <h5 className={styles.headName}>{cutText(title, 20)}</h5>
            {/* <button
              className={styles.headSettings}
              onClick={(e) => {
                e.stopPropagation();
                editPopup();
              }}
            >
              <PenIcon />
            </button> */}
          </div>
          <div className={styles.members}>
            {/* <Members users={contributors?.map((c) => c?.profile_picture)} /> */}
          </div>
          {!investment && (
            <div className={styles.info}>
              <button className={clsx(styles.infoItem, styles.infoItemFiles)}>
                <AttachmentIcon className={styles.infoIcon} />
                <p className={styles.infoValue}>
                  {!!attachments?.length &&
                    attachments?.length > 1 &&
                    attachments?.length}
                  {attachments?.length === 1 && (
                    <>
                      1
                      {/* .<span>{FileHelper.getFileExt(attachments?.[0].name)}</span> */}
                    </>
                  )}
                  {attachments?.length === 0 && <span>0</span>}
                </p>
              </button>
              <button className={clsx(styles.infoItem, styles.infoItemComments)}>
                <CommentsIcon className={styles.infoIcon} />
                <p className={styles.infoValue}>{comments?.length} comments</p>
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default InvestmentBoardCard;
