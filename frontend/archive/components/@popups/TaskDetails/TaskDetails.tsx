import React, { useEffect, useState } from 'react';
import Linkify from 'react-linkify';
import { useParams } from 'react-router-dom';
import Popup from '../../../../src/components/@popups/components/Popup/Popup';
import PopupBox from '../../../../src/components/@popups/components/PopupBox/PopupBox';
import AddSubTaskPopUp from './elements/AddSubTaskPopUp';
import TaskAttachments from './elements/TaskAttachments';
import TaskCommentItem from './elements/TaskCommentItem';
import TaskComments from './elements/TaskComments';
import TaskContainer from './elements/TaskContainer';
import TaskInfo from './elements/TaskInfo';
import TaskSubtasks from './elements/TaskSubtasks';
import AddContributor from './views/AddContributor';
import UserProfileDetails from './views/UserProfileDetails';
import {
  AccessEnums,
  GithubPR,
  ProjectResponse,
  TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { clsx } from 'clsx';
import { ethers } from 'ethers';
import { members } from 'root/members';
import {
  changeProjectid,
  changeTaskid,
  selectAccess,
  selectAccessList,
  selectAccount,
  selectActiveDao,
  selectActiveDaoName,
  selectProvider,
  selectStreamId,
  selectUserName,
  selectWeb3ModalProvider,
} from 'store/features/common/slice';
import { useAddPaymentsMutation } from 'store/services/payments/payments';
import { useLazyGetTaskDetailsQuery } from 'store/services/projects/tasks';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import ProjectPay from 'components/UserProfile/ProjectPay';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Members from 'ui/Members/Members';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import PenIcon from 'ui/SVG/PenIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import UserInfo from 'ui/UserInfo/UserInfo';
import UserSkill from 'ui/UserSkill/UserSkill';
import { ceramicInit } from 'utils/ceramic/ceramic';
import { claimVC } from 'utils/ceramic/verifiableCreds';
import { swichNetwork } from 'utils/changeChain';
import { toCamelCase } from 'utils/format';
import { dynamicColumnType } from 'utils/helpers/KanbanHelper';
import { toast } from 'utils/toast';
import { IProject, ITask } from 'utils/types/Project';
import { IUser } from 'utils/types/User';
import { IVerifiableCredential } from 'utils/types/verifiableCred';
import { getMemberId } from 'utils/utils';
import TaskDetailsEdit from './TaskDetailsEdit';
import styles from './styles/TaskDetails.module.scss';

interface IMember {
  member_id: string;
  username: string;
  profile_picture?: string | null;
}

interface TaskDetailsProps {
  task?: TaskResponse;
  project: ProjectResponse;
  status: dynamicColumnType[];
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ project, task: task1, status }) => {
  const contributorPopup = usePopup();
  const profilePopup = usePopup();
  const payPopUp = usePopup();
  const { daoid } = useParams();
  const [addPaymentTrigger, { isLoading }] = useAddPaymentsMutation();
  const providerEth = useTypedSelector(selectProvider);
  const address = useTypedSelector(selectAccount);
  const web3Modal = useTypedSelector(selectWeb3ModalProvider);
  const streamId = useTypedSelector(selectStreamId);
  const [access, setAccess] = useState(false);
  const activeDaoName = useTypedSelector(selectActiveDaoName);
  const activeDao = useTypedSelector(selectActiveDao);
  const [profile, setProfile] = useState<IMember | null>(null);
  const [task, setTask] = useState<TaskResponse>(task1!);
  const [getDetails] = useLazyGetTaskDetailsQuery();
  const [showComments, setShowComments] = useState(false);
  const [load, setLoad] = useState(false);
  const editPopup = usePopup();
  const dispatch = useTypedDispatch();
  const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    setAccess(
      daoAccess === AccessEnums.AccessType.MANAGE_DAO ||
        daoAccess === AccessEnums.AccessType.MANAGE_PROJECT
    );
  }, [daoid, access]);

  const getTaskDeatils = async () => {
    getDetails(task?.task_id!,true)
      .unwrap()
      .then((res) => {
        if (!res?.data?.vc_claim?.includes(getMemberId())) {
          if (res?.data?.assignee_member?.includes(getMemberId())) {
            setShowClaim(true);
          }
        }
        setTask({
          ...task,
          assignees: res?.data?.assignees || [],
          payout: res?.data?.payout || [],
          comments: res?.data?.comments || [],
          subtasks: res?.data?.subtasks || [],
          files: res?.data?.files || [],
          github_pr: res?.data?.github_pr || ({} as GithubPR),
        });
      }); 
  };

    const getTaskDeatilsWC = async () => {
    getDetails(task?.task_id!,)
      .unwrap()
      .then((res) => {
        if (!res?.data?.vc_claim?.includes(getMemberId())) {
          if (res?.data?.assignee_member?.includes(getMemberId())) {
            setShowClaim(true);
          }
        }
        setTask({
          ...task,
          assignees: res?.data?.assignees || [],
          payout: res?.data?.payout || [],
          comments: res?.data?.comments || [],
          subtasks: res?.data?.subtasks || [],
          files: res?.data?.files || [],
          github_pr: res?.data?.github_pr || ({} as GithubPR),
        });
      }); 
  };
  
  useEffect(() => {
    dispatch(
      changeTaskid({
        taskid: task?.task_id!,
      })
    );
    getTaskDeatils();
  }, [task?.task_id]);

  if (!project || !task) {
    return null;
  }

  const handleClickShowProfile = (user: IMember) => {
    setProfile(user);
    profilePopup.open();
  };

  const handleCloseContributor = () => {
    if (!profilePopup.active) {
      contributorPopup.close();
    }
  };

  const claimCredentials = async () => {
    const payload: IVerifiableCredential = {
      issuanceDate: new Date().toISOString(),
      badges: [
        {
          provider: activeDaoName,
          badgePhoto: '',
          credential: {
            type: ['VerifiableCredential'],
            proof: {
              jws: '',
              created: new Date().toISOString(),
              proofPurpose: 'assertionMethod',
            },
            issuer: 'Samudai',
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            issuanceDate: new Date().toISOString(),
            credentialSubject: {
              task: task.title + '/ ' + task.description,
              project: project.title + '/ ' + project.description,
              bounty: '',
              Clan: '',
              skill: task.tags || [],
              timeSpent: '',
              '@context': [
                {
                  hash: 'https://schema.org/Text',
                  provider: 'https://schema.org/Text',
                },
              ],
            },
          },
        },
      ],
    };
    try {
      let chainId: number = await providerEth!
        .getNetwork()
        .then((network) => network.chainId);
      if (chainId !== 1) {
        await window.ethereum!.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
        const signer = providerEth?.getSigner();
        const ceramic = await ceramicInit(signer!);
        const res = await claimVC(
          ceramic!,
          streamId,
          payload,
          getMemberId(),
          task?.task_id!
        );
        console.log(res);
        setShowClaim(false);
        setLoad(false);
        toast('Success', 5000, 'Successfull', '')();
      } else {
        const signer = providerEth?.getSigner();
        const ceramic = await ceramicInit(signer!);
        const res = await claimVC(
          ceramic!,
          streamId,
          payload,
          getMemberId(),
          task?.task_id!
        );
        console.log(res);
        setShowClaim(false);
        setLoad(false);
        toast('Success', 5000, 'Successfull', '')();
      }
    } catch (err: any) {
      setLoad(false);
      toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
    }
  };

  // const handlePayment = async () => {
  //   try {
  //     const sdk = new Gnosis(providerEth!, task?.payout?.[0]?.provider?.chain_id!);
  //     const res = (await sdk.createSingleGnosisTx(
  //       task?.payout?.[0]?.receiver_address!,
  //       task?.payout?.[0]?.payout_amount?.toString()!,
  //       task?.payout?.[0]?.provider?.address!,
  //       address!,
  //       task?.payout?.[0]?.token_address!!
  //         ? task?.payout?.[0]?.token_address!!
  //         : undefined
  //     )) as unknown as GnosisTypes.SafeTransactionResponse;

  //     const payload = {
  //       payment: {
  //         sender: task?.payout?.[0]?.provider?.address!,
  //         receiver: task?.payout?.[0]?.receiver_address?.[0]!, //TODO fetch UUID of receive from backend
  //         value: {
  //           currency: task?.payout?.[0]?.payout_currency!,
  //           amount: task?.payout?.[0]?.payout_amount!.toString()!,
  //           contract_address: task?.payout?.[0]?.token_address! || '',
  //         },
  //         dao_id: activeDao!,
  //         transaction_hash: res?.safeTxHash,
  //         payment_type: 'gnosis',
  //         initiated_at: new Date().toISOString(),
  //         created_by: getMemberId(),
  //         status: 'pending',
  //         chain_id: task?.payout?.[0]?.provider?.chain_id!,
  //       },
  //     };
  //     await addPaymentTrigger(payload).unwrap();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const statusName = status.find((val) => val.id === task?.col);

  return (
    <React.Fragment>
      <Popup className={styles.root}>
        <div className={clsx(styles.main, styles[toCamelCase('review')])}>
          <header className={styles.head}>
            <h3 className={styles.headTitle}>Task Details</h3>
            {!!task1 &&
              task1?.payout?.length! > 0 &&
              statusName?.name === 'done' &&
              access && (
                <Button
                  color="green"
                  onClick={() => {
                    payPopUp.open();
                    // handlePayment();
                  }}
                >
                  Pay
                </Button>
              )}
            {statusName?.name === 'done' && showClaim && (
              <Button
                color="green"
                disabled={load}
                onClick={() => {
                  setLoad(true);
                  claimCredentials();
                }}
              >
                Claim verifiable credentials
              </Button>
            )}

            {statusName?.name !== 'done' && (
              <button className={styles.headBtn} onClick={editPopup.open}>
                <PenIcon />
              </button>
            )}
          </header>
          <p className={styles.name}>{task.title}</p>
          {/* Task Info */}
          <TaskInfo
            // category={task?.}
            deadline={!!task?.deadline ? task.deadline : null}
            status={statusName?.name || ''}
            createdBy={task?.created_by_member}
          />
          {!!task.github_pr?.html_url && (
            <>
              <h4 className={styles.subtitle}>Github Pull Request</h4>
              <p className={styles.description}>
                <span
                  style={{ color: '#aed4ff', cursor: 'pointer' }}
                  onClick={() => window.open(task?.github_pr?.html_url, '_blank')}
                >
                  {task.github_pr?.title}
                </span>

                {/* <Linkify properties={{ target: '_blank' }}>{task.description}</Linkify> */}
              </p>
            </>
          )}
          <h4 className={styles.subtitle}>Description</h4>
          <p className={styles.description}>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="blank" href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              {task.description}
            </Linkify>
            {/* <Linkify properties={{ target: '_blank' }}>{task.description}</Linkify> */}
          </p>
          {/* Comments */}
          <div className={styles.comments}>
            <div className={styles.commentsHead}>
              <h4 className={styles.subtitle}>Comments</h4>
              <button
                className={styles.commentsAllBtn}
                onClick={setShowComments.bind(null, !showComments)}
              >
                {showComments ? 'Hide All' : 'See All'}
              </button>
            </div>
            <TaskComments
              showComments={showComments}
              comments={task.comments}
              taskId={task?.task_id!}
              getTaskDeatils={getTaskDeatils}
            />
          </div>
          {/* Tags */}
          {!!task.tags && task.tags?.length > 0 && (
            <>
              <h4 className={styles.subtitle}>Tags</h4>
              <div className={styles.labels}>
                <ul className={styles.labelsList}>
                  {task.tags?.map((label) => (
                    <UserSkill className={styles.labelsItem} skill={label} />
                  ))}
                  <li className={styles.labelsAdd}>
                    <PlusIcon />
                    <span>Add tech stack</span>
                  </li>
                </ul>
              </div>
            </>
          )}
          {/* Contributors */}
          <h4 className={clsx(styles.subtitle, styles.gray)}>Contributors</h4>
          <div className={styles.contributors}>
            <Members
              className={styles.contributorsList}
              users={task?.assignees}
              max={5}
            />
            <Button
              color="orange"
              className={styles.contributorsBtn}
              onClick={contributorPopup.open}
            >
              <PlusIcon />
              <span>Edit</span>
            </Button>
          </div>
          {/* Manager */}
          {project?.poc_member && (
            <div className={styles.manager}>
              <UserInfo className={styles.managerInfo} data={project.poc_member} />
              <button className={styles.managerBtn}>
                <img src="/img/icons/user-edit.svg" alt="user-edit" />
                <span>Point of contact</span>
              </button>
            </div>
          )}
          {/* Sub Tasks */}
          <div className={styles.task}>
            <h4 className={styles.subtitle}>Sub Tasks</h4>
            <p className={styles.taskCount}>{task?.subtasks?.length || 0}</p>
            {/* <Checkbox className={styles.taskCheckbox} active /> */}
          </div>
          {/* <TaskSubtasks
            subtasks={task?.subtasks}
            id={task?.task_id!}
            projectId={project.project_id!}
            getTaskDeatils={getTaskDeatils}
          /> */}
          {/* Attachments */}
          <h4 className={styles.attachmentsTitle}>
            <AttachmentIcon />
            <p className={styles.subtitle}>Attachments</p>
            <strong>{task?.files?.length}</strong>
          </h4>
          <TaskAttachments task={task} getTaskDeatils={getTaskDeatils} />
        </div>
      </Popup>
      <TaskContainer
        active={contributorPopup.active}
        onClose={handleCloseContributor}
        className={styles.addContributor}
      >
        <AddContributor
          onShowProfile={handleClickShowProfile}
          user={task.assignees}
          task={task}
          getTaskDetails={getTaskDeatilsWC}
          onClose={contributorPopup.close}
        />
      </TaskContainer>
      <TaskContainer
        active={profilePopup.active}
        onClose={profilePopup.close}
        className={styles.userProfile}
      >
        <UserProfileDetails profile={profile} />
      </TaskContainer>
      <PopupBox active={editPopup.active} onClose={editPopup.close}>
        <TaskDetailsEdit
          onClose={editPopup.close}
          project={project}
          task={task}
          status={status}
        />
      </PopupBox>
      <PopupBox active={payPopUp.active} onClose={payPopUp.close}>
        <ProjectPay onClose={payPopUp.close} task={task1} />
      </PopupBox>
    </React.Fragment>
  );
};

export default TaskDetails;
