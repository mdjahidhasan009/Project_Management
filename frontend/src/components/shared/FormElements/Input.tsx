import React, {useReducer, useEffect, ChangeEvent, JSX} from 'react';

import { validate } from '../../../utils/validators';

type TInputState = {
    value: string;
    isClicked: boolean;
    isValid: boolean;
};

type TInputAction =
    | { type: 'CHANGE'; val: string; validators: any[] }
    | { type: 'CLICKED' };

type TInputProps = {
    element: 'input' | 'textarea' | 'select';
    elementTitle: string;
    onInput: (id: string, value: string, isValid: boolean) => void;
    validators: any[];
    errorText: string;
    initialValue?: string;
    initialValidity?: boolean;
    styleClass?: string;
    label?: string;
    type?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
}

const inputReducer = (state: TInputState, action: TInputAction): TInputState => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'CLICKED':
            return {
                ...state,
                isClicked: true
            };
        default:
            return state;
    }
}

const Input: React.FC<TInputProps> = props => {
    const [ inputState, dispatch ] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isClicked: false,
        isValid: props.initialValidity || false
    });

    const { elementTitle, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(elementTitle, value, isValid); //
        // eslint-disable-next-line
    }, [elementTitle, value, isValid]);

    const changeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        });
    };

    const clickHandler = () => {
        dispatch({
            type: 'CLICKED'
        })
    };

    let element: JSX.Element | null = null;

    if(props.element === 'input')
        element =
            <input
                className={props?.styleClass || ''}
                id={props.elementTitle}
                type={props.type}
                placeholder={props.placeholder}
                onChange={changeHandler}
                onBlur={clickHandler}  //When loose focus means after click on the field click other place except input field
                value={inputState.value}
            />
    else if(props.element === 'select')
        element =
            <select
                className={props?.styleClass || ''}
                id={props.elementTitle}
                onChange={changeHandler}
                onBlur={clickHandler}
                value={inputState.value}
            >
                <option value="1">CEO</option>
                <option value="2">Project Manger</option>
                <option value="3">Team Leader</option>
                <option value="4">Senior Software Developer</option>
                <option value="5">Software Developer</option>
                <option value="6">Junior Software Developer</option>
                <option value="7">Intern</option>
            </select>
    else element =
            <textarea
                className={props?.styleClass || ''}
                id={props.elementTitle}
                cols={props.cols || 30}
                rows={props.rows || 10}
                onChange={changeHandler}
                onBlur={clickHandler}
                value={inputState.value}
            />
    return <div className={`w-full ${!inputState.isValid && inputState.isClicked && 'form-control--invalid'}`}>
        {props.label && <label htmlFor={props.elementTitle}>{props.label}</label>}
        {element}
        {!inputState.isValid && inputState.isClicked && <p className="mt-2 text-red-500">{props.errorText}</p>}
    </div>
}

export default Input;
