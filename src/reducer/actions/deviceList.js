export const SET_DEVICE_LIST = 'SET_DEVICE_LIST';

export const setDeviceList = (devices) => {
    return {
        type: SET_DEVICE_LIST,
        deviceList: devices
    }
}