import userReducer from './user'
import channelReducer from './channel'
import deviceReducer from './deviceList'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({ userReducer, channelReducer, deviceReducer });

export default rootReducer;