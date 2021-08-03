import { CHANNEL_ENTER } from '../actions/channel'

const initState = {
    channelName: ''
}

const channelReducer = (state = initState, action) => {
    switch(action.type) {
        case CHANNEL_ENTER:
            return {...state, channelName: action.channelName}
        default:
            return state
    }
}

export default channelReducer;