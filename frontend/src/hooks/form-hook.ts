import { useCallback, useReducer, Reducer } from 'react'

export type TInputState = {
    value: any;
    isValid: boolean;
}

export type TFormState = {
    inputs: {
        [key: string]: TInputState;
    };
    isValid: boolean;
}


export type TInputHandler = (
    elementTitle: string,
    value: any,
    isValid: boolean
) => Promise<void>;


export type TSetFormData = (
    inputData: { [key: string]: TInputState },
    formValidity: boolean
) => Promise<void>;

type TFormAction =
    | { type: 'INPUT_CHANGE'; elementTitle: string; value: any; isValid: boolean }
    | { type: 'SET_DATA'; inputs: { [key: string]: TInputState }; formIsValid: boolean };


const formReducer: Reducer<TFormState, TFormAction> = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true; //For overall form validity. First assume that true means valid.
            for(const elementTitle in state.inputs) {
                //When switch form signup to signin then will be first and last name field and value will be undefined
                //which will lead to error so it should be pass
                if(!state.inputs[elementTitle]) continue;
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

export const useForm = (
    initialInputs: { [key: string]: TInputState },
    initialValidity: boolean
): [TFormState, TInputHandler, TSetFormData] => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialValidity
    });

    const inputHandler: TInputHandler = useCallback(async (elementTitle, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            elementTitle: elementTitle
        })
    }, []);

    const setFormData: TSetFormData = useCallback(async (inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    }, []);

    return [ formState, inputHandler, setFormData ];
}
