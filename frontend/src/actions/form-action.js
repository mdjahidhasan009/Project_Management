import { useCallback } from 'react'

export const inputHandler = (elementTitle, value, isValid) => dispatch => {
    dispatch({
        type: 'INPUT_CHANGE',
        value: value,
        isValid: isValid,
        elementTitle: elementTitle
    })
};

// export const inputHandler = useCallback((elementTitle, value, isValid) => dispatch => {
//     dispatch({
//         type: 'INPUT_CHANGE',
//         value: value,
//         isValid: isValid,
//         elementTitle: elementTitle
//     })
// }, []);

export const setFormData = (inputData, formValidity) => dispatch => {
    dispatch({
        type: 'SET_DATA',
        inputs: inputData,
        formIsValid: formValidity
    })
};

// export const setFormData = useCallback((inputData, formValidity) => dispatch => {
//     dispatch({
//         type: 'SET_DATA',
//         inputs: inputData,
//         formIsValid: formValidity
//     })
// }, []);
export const addFormState = (initialInputs, initialValidity) => dispatch => {
    console.log('in from action')
    dispatch({
        type: 'INITIALIZE_FORM_STATE',
        inputs: initialInputs,
        isValid: initialValidity
    })
};
