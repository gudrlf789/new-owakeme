import { CHANNEL_CHATTING } from '../actions/chatting';

const initState = {
    messageStore: {
        channel: '',
        userNames: [],
        messages: [],
        messageTimes: [],
        tracks: []
    }
}

const chattingReducer = (state = initState, action) => {
    switch(action.type) {
        case CHANNEL_CHATTING:
            return {...state, messageStore: { 
                channel: action.channelName
                , userNames: [...state.messageStore.userNames, action.userName]
                , messages: [...state.messageStore.messages, action.message] 
                , messageTimes: [...state.messageStore.messageTimes, action.messageTime]
                , tracks: [...state.messageStore.tracks, action.track]
            }}
        default:
            return state
    }
}

export default chattingReducer;