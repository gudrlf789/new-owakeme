import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
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

import ChannelUserList from "../components/channelUserList";
import Chatting from "../components/chatting";
import useRouter from "../utils/use-router";
import shareScreen from "./../components/shareScreen";

import "../assets/css/channel.css";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    /* height: '100%', */
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const Room = () => {
  const classes = useStyles();
  const routerCtx = useRouter();
  const [useMic, setUseMic] = useState(true);
  const [useVideocam, setUseVideocam] = useState(true);
  const [useChannelUserListPage, setUseChannelUserListPage] = useState(false);
  const [useChattingPage, setUseChattingPage] = useState(false);
  const [usePageGrid, setUsePageGrid] = useState(false);
  const [useSettingPage, setUseSettingPage] = useState(false);

  const {
    localScreenTrack,
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
    channelName,
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

  const onLeaveChannel = () => {
    leave();
    routerCtx.history.push({ pathname: "/" });
  };

  const onSelectPage = (pagename) => {
    switch (pagename) {
      case "channelUserList":
        setUseChannelUserListPage(!useChannelUserListPage);
        break;
      case "chattingPage":
        setUseChattingPage(!useChattingPage);
        break;
      case "pageGrid":
        setUsePageGrid(!usePageGrid);
        break;
      case "settingPage":
        setUseSettingPage(!useSettingPage);
        break;
      default:
        setUseChannelUserListPage(false);
        setUseChattingPage(false);
        setUsePageGrid(false);
        setUseSettingPage(false);
        break;
    }
  };

  const item = (anchor) => (
    <div className="nav__overray__box" role="presentation">
      <Chatting userName={userName} channelName={channelName} />
    </div>
  );

  return (
    <>
      <div class="container">
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
            <div
              className="view"
              style={{ width: "30vw", height: "50vh" }}
            ></div>
            <div
              className="view"
              style={{ width: "30vw", height: "50vh" }}
            ></div>
            <div
              className="view"
              style={{ width: "30vw", height: "50vh" }}
            ></div>
            <div
              className="view"
              style={{ width: "30vw", height: "50vh" }}
            ></div>

            <div
              id="screen-player"
              style={{ width: "30%", height: "50%" }}
            ></div>
          </div>
        </div>

        <div class="bottom_container">
          <div class="view_mic">
            {useMic ? (
              <IonIcon icon={micOutline} onClick={onMic} />
            ) : (
              <IonIcon icon={micOffOutline} onClick={onMic} />
            )}
          </div>
          <div class="view_video">
            {useVideocam ? (
              <IonIcon icon={videocamOutline} onClick={onVideocam} />
            ) : (
              <IonIcon icon={videocamOffOutline} onClick={onVideocam} />
            )}
          </div>
          <div class="view_share" onClick={shareScreen}>
            <IonIcon icon={shareOutline} />
          </div>
          <div class="view_out">
            <IonIcon icon={logOutOutline} onClick={onLeaveChannel} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
