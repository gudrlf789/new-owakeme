import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import StreamPlayer from "../components/streamPlayer";
import AgoraRTC from "agora-rtc-sdk-ng";
import RTCClient from "../rtc-client";
import { IonIcon } from "@ionic/react";
import {
  clipboardOutline,
  peopleOutline,
  chatboxEllipsesOutline,
  gridOutline,
  settingsOutline,
  micOutline,
  micOffOutline,
  videocamOutline,
  videocamOffOutline,
  shareOutline,
  logOutOutline,
} from "ionicons/icons";

/** Icons */
import GroupIcon from "@material-ui/icons/Group";
import ChatIcon from "@material-ui/icons/Chat";
import SettingsIcon from "@material-ui/icons/Settings";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";

/** Navigation Action */
import Drawer from "@material-ui/core/Drawer";

import Chatting from "../components/chatting";
import useRouter from "../utils/use-router";
import shareScreen from "./../components/shareScreen";

import "../assets/css/channel.css";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const Room = () => {
  const routerCtx = useRouter();
  const [useMic, setUseMic] = useState(true);
  const channelName = useSelector((state) => state.channelReducer.channelName);
  const [useVideocam, setUseVideocam] = useState(true);

  const {
    localScreenTrack,
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
    userName,
  } = RTCClient(client);

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  AgoraRTC.getCameras()
    .then((e) => {
      console.log(e);
    })
    .catch((err) => {
      console.log(err);
    });

  const onMic = () => {
    setUseMic(!useMic);
    localAudioTrack.setMuted(useMic);
  };

  const onVideocam = () => {
    setUseVideocam(!useVideocam);
    localVideoTrack.setMuted(useVideocam);
  };

  const onLeaveChannel = useCallback(() => {
    leave();
    routerCtx.history.push({ pathname: "/" });
  });

  const item = (anchor) => (
    <div className="nav__overray__box" role="presentation">
      <Chatting userName={userName} channelName={channelName} />
    </div>
  );

  return (
    <div className="container">
      <div class="nav_container">
        <div class="top_navbar">
          <div class="channel_name">{channelName}</div>
          <div class="channel_clipboard">
            <IonIcon icon={clipboardOutline} />
          </div>
        </div>

        <div class="right_navbar">
          <div id="connect_user_list">
            <GroupIcon className="nav__icon" />
          </div>
          <div id="chat">
            {["right"].map((anchor) => (
              <React.Fragment key={anchor}>
                <ChatIcon
                  className="nav__icon"
                  onClick={toggleDrawer(anchor, true)}
                />
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {item(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>
          <div id="view_grid">
            <ViewCompactIcon className="nav__icon" />
          </div>
          <div id="setting">
            <SettingsIcon className="nav__icon" />
          </div>
        </div>
      </div>

      <div class="view_container">
        <div className="video__box">
          <div className="video__view">
            <StreamPlayer
              audioTrack={localAudioTrack}
              videoTrack={localVideoTrack}
            />
          </div>
          {remoteUsers.map((user) => (
            <div className="video__remote__view" key={user.uid}>
              <StreamPlayer
                audioTrack={user.audioTrack}
                videoTrack={user.videoTrack}
              />
            </div>
          ))}

          <div id="screen__player"></div>
        </div>
      </div>

      <div className="bottom_container">
        <div className="view_mic">
          {useMic ? (
            <IonIcon icon={micOutline} onClick={onMic} />
          ) : (
            <IonIcon icon={micOffOutline} onClick={onMic} />
          )}
        </div>

        <div className="view_video">
          {useVideocam ? (
            <IonIcon icon={videocamOutline} onClick={onVideocam} />
          ) : (
            <IonIcon icon={videocamOffOutline} onClick={onVideocam} />
          )}
        </div>
        <div className="view_share">
          <IonIcon icon={shareOutline} onClick={shareScreen} />
        </div>
        <div className="view_out">
          <IonIcon icon={logOutOutline} onClick={onLeaveChannel} />
        </div>
      </div>
    </div>
  );
};

export default Room;
