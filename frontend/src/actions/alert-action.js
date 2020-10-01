import { v4 as uuid}  from 'uuid';
import {
    SET_ALERT,
    REMOVE_ALERT
} from './types';

//Global alert action for whole application
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid();
    console.log('alert set' + msg);
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
}
