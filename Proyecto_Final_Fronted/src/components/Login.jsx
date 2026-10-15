import { useState } from "react";
import React from "react";
import { Input } from "./Input";
import { useLogin } from '../shared/hooks/useLogin';
import {
    validatePassword,
    validatePasswordMessage,
    validateEmail,
    emailValidationMessage
} from "../shared/validators";

export const Login = () => {
    const { login, isLoading } = useLogin();

    const [formState, setFormState] = useState({
        email: {
            value: '',
            isValid: '',
            showError: '',
        },
        password: {
            value: '',
            isValid: '',
            showError: ''
        }
    });

    const handleInputValueChange = (value, field) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                value
            }
        }));
    }

    const handleInputValidationOnBlur = (value, field) => {
        let isValid = false;
        switch (field) {
            case 'email':
                isValid = validateEmail(value);
                break;
            case 'password':
                isValid = validatePassword(value);
                break;
            default:
                break;
        }
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                isValid,
                showError: !isValid
            }
        }));
    }

    const handleLogin = (event) => {
        event.preventDefault();
        login(formState.email.value, formState.password.value);
    }

    const isSubmitButtonDisable = isLoading ||
        !formState.email.isValid ||
        !formState.password.isValid;

    const primaryOrange = 'bg-orange-500 hover:bg-orange-600 transition duration-300';
    const whiteCard = 'bg-white shadow-2xl';

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-500">
            <div className={`w-full max-w-md p-8 rounded-xl ${whiteCard}`}>
                <form className="space-y-6">
                    <Input
                        field='email'
                        label='Email'
                        value={formState.email.value}
                        onChangeHandler={handleInputValueChange}
                        type='text'
                        onBlurHandler={handleInputValidationOnBlur}
                        showErrorMessage={formState.email.showError}
                        validationMessage={emailValidationMessage}
                    />
                    <Input
                        field='password'
                        label='Password'
                        value={formState.password.value}
                        onChangeHandler={handleInputValueChange}
                        type='password'
                        onBlurHandler={handleInputValidationOnBlur}
                        showErrorMessage={formState.password.showError}
                        validationMessage={validatePasswordMessage}
                    />
                </form>
                <button
                    onClick={handleLogin}
                    disabled={isSubmitButtonDisable}
                    className={`
                            w-full py-3 mt-4 text-white font-bold rounded-lg 
                            ${primaryOrange} 
                            focus:outline-none focus:ring-4 focus:ring-orange-300 
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transform active:scale-[0.98] transition duration-150 ease-in-out
                        `}
                >
                    Log in
                </button>
            </div>
        </div>
    );
}