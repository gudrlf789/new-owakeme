import { USER_LOG_IN } from '../actions/user';

const initState = {
    userName: '',
    userNameList: []
}

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case USER_LOG_IN:
            return {
                ...state,
                userName: action.userName
            };
        default:
            return state;
    }
}

export default userReducer;