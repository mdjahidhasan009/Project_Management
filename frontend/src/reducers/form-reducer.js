import { useReducer } from 'react'
let initialState = null;
export function initFormReducer(initialInputs, initialValidity) {
    // const  [ formState, dispatch ] = useReducer(formReducer, {
    initialState = {
        inputs: initialInputs,
        isValid: initialValidity
    }
    // });
}

export function getFormState() {
    return initialState;
}

export default function (state = initialState, action) {
    // const { type, payload } = state;

    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
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
                inputs: action.inputs,
                isValid: action.isValid
            };
        case 'INITIALIZE_FORM_STATE':
            return {
                inputs: action.inputs,
                isValid: action.isValid
            }
        default:
            return state;
    }
};



// export const useForm = (initialInputs, initialValidity) => {
//     export default  [formState, dispatch] = useReducer(formReducer, {
//         inputs: initialInputs,
//         isValid: initialValidity
//     });
// }
