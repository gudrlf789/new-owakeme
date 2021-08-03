import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux'
import ChannelUserList from '../subcomponents/channelUserList';
import Chatting from '../subcomponents/chatting';
import SettingDevice from '../subcomponents/settingDevice';
import { IonIcon } from '@ionic/react'
import { peopleOutline, chatboxEllipsesOutline, gridOutline, settingsOutline } from 'ionicons/icons';

function NavBar() {

    const channelName = useSelector(state => state.channelReducer.channelName)
    const userName = useSelector(state => state.userReducer.userName)


    return (
        <div className="row_nav_container">
            <div className="navigaitner">
                <div id="connect_user_list">
                    <IonIcon icon={peopleOutline} />
                </div>
                <div id="chat">
                    <IonIcon icon={chatboxEllipsesOutline} />
                </div>
                <div id="view_grid">
                    <IonIcon icon={gridOutline} />
                </div>
                <div id="setting">
                    <IonIcon icon={settingsOutline} />
                </div>
            </div>
            
            {/* <ChannelUserList /> */}
                
            {/* <Chatting userName={props.userName} channelName={props.channelName} /> */}

            <SettingDevice />
            
        </div>
    )
}

export default NavBar
