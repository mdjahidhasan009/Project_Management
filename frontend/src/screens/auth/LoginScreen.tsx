import React, {FC, FormEvent, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import loginAnimation from "../../assets/gif/login2.json";
import LottieAnimation from "../../components/LottieAnimation";
import {TValidatorType, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH} from "../../utils/validators";
import {TFormState, TInputHandler, TSetFormData, useForm} from "../../hooks/form-hook";
import {THttpClientHook, useHttpClient} from "../../hooks/http-hook";
import Input from "../../components/shared/FormElements/Input";
import { login, loadUser } from "../../redux/thunks/auth-thunks";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";


type InputElementConfig = {
    elementTitle: string;
    type: string;
    placeholder: string;
    validators: TValidatorType[];
    errorText: string;
}


type LoginRequestParams = {
    email: string;
    password: string;
    method: THttpClientHook['sendRequest'];
}

type LoadUserParams = {
    method: THttpClientHook['sendRequest'];
}

type LoginResult = {
    token: string;
    userId: string;
    success: boolean;
}

const LoginScreen: FC = () => {
    const { sendRequest } = useHttpClient();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const authSlice = useAppSelector(state => state.auth);

    ////TODO: will not use null as default value
    const user = authSlice.user || null;

    const [ formState, inputHandler, _setFormData ]: [TFormState, TInputHandler, TSetFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const inputElements: InputElementConfig[] = [
        { elementTitle: 'email', type: 'email', placeholder: 'Email', validators: [VALIDATOR_EMAIL()], errorText: 'Please enter a valid email address.' },
        { elementTitle: 'password', placeholder: 'Password', type: 'password', validators: [VALIDATOR_MINLENGTH(6)], errorText: 'Please enter at least 6 characters.' },
    ];

    const authSubmitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        try {
            const loginResult = await dispatch(login({
                email: formState.inputs.email.value,
                password: formState.inputs.password.value,
                method: sendRequest
            } as LoginRequestParams)).unwrap() as LoginResult | unknown; // Waits for login to succeed and unwraps the result
            ////TODO: will replace LoginResult | unknown with more precise type

            if (loginResult) {
                dispatch(loadUser({ method: sendRequest } as LoadUserParams)); // Dispatch loadUser after successful login
            }
        } catch (error: unknown) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(authSlice.isAuthenticated){
            navigate('/dashboard');
        }
    }, [user]);

    return (
        <section className="bg-default min-h-screen text-white-light flex flex-col lg:flex-row justify-between px-4 lg:pt-20 md:pt-20 pt-6 lg:overflow-hidden md:overflow-hidden overflow-y-auto">
            <div className="lg:w-1/2 md:w-full w-full flex flex-col items-center justify-start">
                <form onSubmit={authSubmitHandler} className="lg:w-96 md:w-96 w-full flex flex-col items-center gap-5">
                    <div className="lg:mb-5 md:mb-4 mb-3">
                        <h2 className="lg:text-3xl md:text-2xl text-2xl font-medium font-sans">
                            <span className="text-orange-500">Login</span> to continue
                        </h2>

                        <p className="mt-3">
                            Unlock a world of features by login now.
                        </p>
                    </div>

                    {inputElements?.map((inputProps, elementTitle) => (
                        <Input
                            key={elementTitle}
                            element="input"
                            {...inputProps}
                            styleClass="lg:w-96 md:w-96 w-full lg:h-10 md:h-8 h-6 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                            onInput={inputHandler}
                        />
                    ))}

                    <button
                        type="submit"
                        disabled={!formState?.isValid}
                        className="lg:w-96 md:w-96 w-full lg:h-10 md:h-8 h-8 rounded-[4px] bg-orange-500 font-semibold">
                        Login
                    </button>

                    <div className="lg:w-96 md:w-96 w-full flex flex-col gap-1 px-1 text-sm">
                        <div className="w-full flex items-center justify-between gap-4 px-1">
                            <p>New to our site?</p>
                            <Link to="/auth/get-started" className="hover:text-orange-500 hover:underline decoration-orange-500">Sign up</Link>
                        </div>
                    </div>
                </form>
            </div>

            <div className="lg:w-1/3 h-[50vh] lg:flex md:hidden hidden justify-start">
                <LottieAnimation animationData={loginAnimation} />
            </div>
        </section>
    );
}

export default LoginScreen;
