import { LOG_IN } from '../constants/action-types';

const initialState = {
    isLoggedIn: null
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case LOG_IN:
            // console.log("inside LOG_IN reducer")
            return Object.assign({}, state, {
                isLoggedIn: action.payload
            });
        default:
            return state;
    }
}