import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import '../styles/TaskContainer.scss';

interface TaskContainerProps {
  className?: string;
  classNamePopup?: string;
  active: boolean;
  children?: React.ReactNode;
  onClose: () => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  active,
  onClose,
  children,
  className,
  classNamePopup
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOut = (e: MouseEvent) => {
    if(ref.current && !e.composedPath().includes(ref.current)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    }
  });

  const RenderElement =  (
    <CSSTransition
      classNames="task-container"
      in={active}
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      <div className={clsx("custom-scrollbar", className)} data-task-container>
        <div data-task-scrollable>
          <div ref={ref} className={classNamePopup} data-task-popup>
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>
  );

  return createPortal(RenderElement, document.getElementById("app")!);
};

export default TaskContainer;
