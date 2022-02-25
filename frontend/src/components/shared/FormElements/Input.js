import React, { useReducer, useEffect } from 'react';

import { validate } from '../../../utils/validators';
import './Input.css';

const inputReducer = (state, action) => {
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

const Input = props => {
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

    const changeHandler = event => {
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

    let element = null;
    if(props.element === 'input')
        element =
            <input
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
                id={props.elementTitle}
                cols={props.cols || 30}
                rows={props.rows || 10}
                onChange={changeHandler}
                onBlur={clickHandler}
                value={inputState.value}
            />
    return <div className={`form-control ${!inputState.isValid && inputState.isClicked && 'form-control--invalid'}`}>
        {props.label && <label htmlFor={props.elementTitle}>{props.label}</label>}
        {element}
        {!inputState.isValid && inputState.isClicked && <p>{props.errorText}</p>}
    </div>
}

export default Input;
