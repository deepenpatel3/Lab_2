import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import studentProfileReducer from './studentProfileReducer';

const rootReducer = combineReducers({
    Login: loginReducer,
    StudentProfile: studentProfileReducer
})

export default rootReducer;


