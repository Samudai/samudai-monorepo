import { PrivyLogin } from './utils';
import css from './onboarding.module.scss';
import EyeIcon from 'ui/SVG/EyeIcon';
import { IconsList } from 'components/@pages/new-discovery';

const profiles = [
    'img/profiles/pp1.jpeg',
    'img/profiles/pp2.jpeg',
    'https://cdn.samudai.xyz/images/Frame%201321315308.png',
    'https://cdn.samudai.xyz/images/Frame%201321315309.png',
    'img/profiles/pp3.png',
    'img/profiles/pp4.jpeg',
    'https://cdn.samudai.xyz/images/Frame%201321315311.png',
    'img/profiles/pp5.jpeg',
];

const ConnectWalletComp: React.FC = () => {
    // const { isConnected } = useAccount();
    // const { data: walletClient, isError, isLoading } = useWalletClient({ chainId: 1 });
    // const dispatch = useTypedDispatch();
    // const navigate = useNavigate();
    // const { loginUtil } = samudaiLogin();

    // const ConnectWalletHandler = async (provider: ethers.providers.Web3Provider) => {
    //     localStorage.removeItem('discord bot');
    //     try {
    //         const signer = provider.getSigner();
    //         const accounts = await signer.getAddress();
    //         const semail = localStorage.getItem('semail') as string | undefined;
    //         await loginUtil(
    //             accounts,
    //             10,
    //             provider,
    //             signer,
    //             undefined,
    //             undefined,
    //             undefined,
    //             semail
    //         );
    //         localStorage.removeItem('semail');
    //     } catch (err) {
    //         console.error(err);
    //         navigate(`/login`);
    //     }
    // };

    // useEffect(() => {
    //     if (isConnected && walletClient) {
    //         console.log(isError, isLoading, walletClient);
    //         const provider = walletClient && walletClientToSigner(walletClient);
    //         console.log(provider);
    //         provider && ConnectWalletHandler(provider!);
    //     }
    // }, [isConnected, walletClient]);

    // console.log(isConnected, walletClient);

    return (
        <>
            <div className={css.connect_wrapper}>
                <div className={css.connect_title}>SIGN UP OR LOGIN</div>
                <div className={css.connect_subtitle}>Glad you’re here!</div>
                {/* <LoginComp /> */}
                <PrivyLogin />
                <div className={css.connect_message}>
                    <EyeIcon />
                    <span>We will never do anything without your approval.</span>
                </div>
            </div>
            <div className={css.divider} />
            <div className={css.connect_wrapper}>
                <IconsList
                    className={css.connect_footer_members}
                    values={profiles}
                    length={600}
                    maxShow={8}
                />
                <span className={css.connect_footer_text}>
                    Join 500+ others contributors and admins
                </span>
            </div>
        </>
    );
};

export default ConnectWalletComp;
