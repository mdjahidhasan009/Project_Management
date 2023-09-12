import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import loginAnimation from "../../assets/gif/login.json";
import LottieAnimation from "../../components/LottieAnimation";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH} from "../../utils/validators";
import {useForm} from "../../hooks/form-hook";
import {useHttpClient} from "../../hooks/http-hook";
import Input from "../../components/shared/FormElements/Input";
import {PropTypes} from "prop-types";
import { login, register, loadUser } from "../../actions/auth-action";
import {connect} from "react-redux";

function Login({ login, register , isAuthenticated , loadUser, user, token }) {
    const { sendRequest } = useHttpClient();
    const history = useHistory();
    const [ formState, inputHandler, setFormData ] = useForm(
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

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            await login(formState.inputs.email.value, formState.inputs.password.value, sendRequest);
            await loadUser(sendRequest);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(user) {
            history.push('/dashboard');
        }
    }, [user])

    return (
        <section className="bg-default min-h-screen text-white-light flex items-center justify-between px-24 lg:overflow-hidden md:overflow-hidden overflow-y-auto">
            <div>
                <div>
                    <h2 className="text-3xl font-medium font-sans">
                        <span className="text-orange-500">Sign up or login</span> to continue
                    </h2>

                    <p className="mt-3">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </p>
                </div>

                <main className="mt-10 mx-0">
                    <form onSubmit={authSubmitHandler} className="flex flex-col items-center justify-center gap-3">
                        <Input
                            element="input"
                            elementTitle="email"
                            type="email"
                            placeholder="Email"
                            validators={[VALIDATOR_EMAIL()]}
                            errorText="Please enter a valid email address."
                            styleClass="w-96 h-12 rounded-lg border-2 border-orange-500 active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                            onInput={inputHandler}
                        />

                        <Input
                            element="input"
                            placeholder="Password"
                            elementTitle="password"
                            type="password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter at least 6 character."
                            styleClass="w-96 h-12 rounded-lg border-2 border-orange-500 active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                            onInput={inputHandler}
                        />

                        <button
                            type="submit"
                            className="w-96 h-12 rounded-lg bg-orange-500">
                            Login
                        </button>

                        <div className="w-full flex flex-col gap-1 px-1">
                            <div className="w-full flex items-center justify-between gap-4 px-1">
                                <p>New to our site?</p>
                                <Link to="/auth/get-started" className="hover:text-orange-500 hover:underline decoration-orange-500">Sign up</Link>
                            </div>

                            <div className="w-full flex items-center justify-between gap-4 px-1">
                                <p>Forgot password?</p>
                                <Link to="/auth/reset-password" className="hover:text-orange-500 hover:underline decoration-orange-500">Reset password</Link>
                            </div>
                        </div>
                    </form>
                </main>
            </div>

            <div className="lg:w-[40vw]">
                <LottieAnimation animationData={loginAnimation} />
            </div>
        </section>
    );
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token
})

export default connect(mapStateToProps, { login, register, loadUser })(Login);