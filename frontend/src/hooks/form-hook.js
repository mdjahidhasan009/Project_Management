import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true; //For overall form validity. First assume that true means valid.
            for(const elementTitle in state.inputs) {
                //When switch form signup to signin then will be first and last name field and value will be undefined
                //which will lead to error so it should be pass
                if(!state.inputs[elementTitle]) continue;
                // console.log(elementTitle + elementTitle.input + elementTitle.isValid);
                // console.log(action)
                if(elementTitle === action.elementTitle) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[elementTitle].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.elementTitle] : { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
        case 'SET_DATA':
            return {
                ...state,
                inputs: action.inputs,
                isValid: action.formIsValid
            };
        default:
            return state;
    }
};

export const useForm = (initialInputs, initialValidity) => {
    // console.log(initialInputs);
    // console.log(initialValidity);
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialValidity
    });

    const inputHandler = useCallback(async (elementTitle, value, isValid) => {
        // console.log(`${elementTitle} |${value}| ${isValid}`)
        await dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            elementTitle: elementTitle
        })
        // console.log(`${elementTitle} |${value}| ${isValid}`)
        // if(elementTitle === '')
        // console.log(formState);
    }, []);

    const setFormData = useCallback(async (inputData, formValidity) => {
        // console.log(inputData)
        // console.log(formValidity)
        await dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
        // console.log(formState);
    }, []);

    return [ formState, inputHandler, setFormData ];
}
