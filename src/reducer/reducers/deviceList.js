import { useState, useEffect } from 'react'
import { SET_DEVICE_LIST } from '../actions/deviceList'
import AgoraRTC from 'agora-rtc-sdk-ng'

const initState = {
    deviceList: []
}

const deviceReducer = (state = initState, action) => {
    switch(action.type) {
        case SET_DEVICE_LIST:
            return {
                ...state,
                deviceList: action.deviceList
            };
        default:
            return state;
    }
}

export default deviceReducer;