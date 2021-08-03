import React from 'react';
import { useSelector } from 'react-redux';
import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

function SettingDevice() {
    const devices = useSelector(state => state.deviceReducer.deviceList)
    
    return (
        <div>
            <FormControl>
                <InputLabel>Video</InputLabel>
                <Select>
                    {devices.map((obj, index) => {
                        <MenuItem value={index}>{obj.label}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </div>
    )
}

export default SettingDevice
