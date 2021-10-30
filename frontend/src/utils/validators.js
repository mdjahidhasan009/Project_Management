const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_NOT_REQUIRE = 'NOT_REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_LINK = 'LINK';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_NOT_REQUIRE = () => ({ type: VALIDATOR_TYPE_NOT_REQUIRE });
export const VALIDATOR_MINLENGTH = val => ({
    type: VALIDATOR_TYPE_MINLENGTH,
    val: val
});
export const VALIDATOR_EMAIL = (val) => ({ type: VALIDATOR_TYPE_EMAIL, val: val });
export const VALIDATOR_LINK = (val) => ({ type: VALIDATOR_TYPE_LINK, val: val });

export const validate = (value, validators) => {
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
            isValid = isValid && /^(ftp|http|https):\/\/[^ "]+$/.test(value);
        }
    }

    if(isRequired && value === "") isValid = true;
    return isValid;
};
