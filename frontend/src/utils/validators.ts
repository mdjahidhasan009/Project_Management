const VALIDATOR_TYPE_REQUIRE: string = 'REQUIRE';
const VALIDATOR_TYPE_NOT_REQUIRE: string = 'NOT_REQUIRE';
const VALIDATOR_TYPE_MINLENGTH: string = 'MINLENGTH';
const VALIDATOR_TYPE_EMAIL: string = 'EMAIL';
const VALIDATOR_TYPE_LINK: string = 'LINK';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_NOT_REQUIRE = () => ({ type: VALIDATOR_TYPE_NOT_REQUIRE });
export const VALIDATOR_MINLENGTH = (val: number) => ({
    type: VALIDATOR_TYPE_MINLENGTH,
    val: val
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_LINK = () => ({ type: VALIDATOR_TYPE_LINK });

export const validate = (value: string, validators: { type: string, val: number }[]): boolean => {
    let isValid = true;
    let isRequired = false;
    for (const validator of validators) {
        if(validator.type === VALIDATOR_TYPE_NOT_REQUIRE) {
            isValid = isValid && true;
            isRequired = true;
        }
        if (validator.type === VALIDATOR_TYPE_REQUIRE) {
            isValid = isValid && value.trim().length > 0;
        }
        if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
            isValid = isValid && value.trim().length >= validator.val;
        }
        if (validator.type === VALIDATOR_TYPE_EMAIL) {
            isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
        }
        if (validator.type === VALIDATOR_TYPE_LINK) {
            isValid = isValid && /^(http|https):\/\/[^ "]+$/.test(value);
        }
    }

    if(isRequired && value === "") isValid = true;
    return isValid;
};


export type TValidatorType =
    | { type: typeof VALIDATOR_TYPE_REQUIRE }
    | { type: typeof VALIDATOR_TYPE_NOT_REQUIRE }
    | { type: typeof VALIDATOR_TYPE_MINLENGTH; val: number }
    | { type: typeof VALIDATOR_TYPE_EMAIL }
    | { type: typeof VALIDATOR_TYPE_LINK };