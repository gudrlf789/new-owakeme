export const USER_LOG_IN = 'USER_LOG_IN';

export const userLogIn = (userName) => {
    return {
        type: USER_LOG_IN,
        userName: userName
    };
};