import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from 'store/features/user/async';
import { useTypedDispatch } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import './Login.scss';

const log = 'SamudaiFren';
const pass = 'JAISAMUDAI';

require('dotenv').config();

const Login: React.FC = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (process.env.REACT_APP_ENV === 'local') {
            dispatch(fetchUser());
            localStorage.setItem('access_token', Date.now().toString());
            navigate('/signup');
        }
        const loginValue = login.trim();
        const passwordValue = password.trim();

        if (loginValue === '' || passwordValue === '') {
            toast(
                'Attention',
                5000,
                'Invalid Credentials',
                `Please try again or Try the Product without credentials in "Try Now"`
            )();
            return;
        }

        if (loginValue === log && passwordValue === pass) {
            dispatch(fetchUser());
            localStorage.setItem('access_token', Date.now().toString());
            navigate('/signup');
        } else {
            toast(
                'Attention',
                5000,
                'Invalid Credentials',
                `Please try again or Try the Product without credentials in "Try Now"`
            )();
            setPassword('');
        }
    };

    return (
        <div className="temp-login" data-analytics-page="login">
            <form className="temp-login__block" onSubmit={onSubmit}>
                <h2 className="team-login__title">Samudai Beta</h2>
                <Input
                    className="temp-login__input"
                    value={login}
                    placeholder="Login"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                />
                <Input
                    className="temp-login__input"
                    value={password}
                    placeholder="Password"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <div style={{ display: 'flex' }}>
                    {
                        <Button
                            color="green"
                            className="team-login__btn"
                            type="submit"
                            data-analytics-click="team_login_btn"
                        >
                            <span>LOGIN</span>
                        </Button>
                    }
                    <div className="team-login__or">
                        <span style={{ color: 'white', margin: '0 10px' }}>or</span>
                    </div>
                    {
                        <Button
                            color="orange"
                            className="team-login__btn"
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(`https://try.samudai.xyz`, '_blank', 'noreferrer');
                            }}
                            data-analytics-click="try_samudai_now_btn"
                        >
                            <span>TRY NOW</span>
                        </Button>
                    }
                </div>
                {/* <Button className="team-login__btn" type="submit">
          <span>LOGIN</span>
        </Button> */}
            </form>
        </div>
    );
};

export default Login;
