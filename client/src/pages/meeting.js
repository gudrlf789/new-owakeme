import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, useMediaQuery } from '@material-ui/core';
import StreamPlayer from '../components/streamPlayer';
import AgoraRTC from 'agora-rtc-sdk-ng';
import RTCClient from '../rtc-client';
import { IonIcon } from '@ionic/react'
import { micOutline, micOffOutline, videocamOutline, videocamOffOutline, shareOutline, logOutOutline, codeOutline } from 'ionicons/icons'
import useRouter from '../utils/use-router';
import axios from 'axios';
import { userLogOut } from '../reducer/actions/user';
import { dontUseSharing, setCurrentTrack } from '../reducer/actions/track';
import "../assets/css/meeting.css";
import "../assets/css/navigator.css";
import new_owake_logo_white from "../assets/img/new_owake_logo_white.svg";
import setting from '../assets/img/settings.svg';

const Room = () => {
  const routerCtx = useRouter();
  const { sharing, tracks, currentTrack } = useSelector(state => state.trackReducer);
  const [useMic, setUseMic] = useState(true);
  const [useVideocam, setUseVideocam] = useState(true);
  const [useSetting, setUseSetting] = useState(false);
  const [mainTrack, setMainTrack] = useState([]);
  const dispatch = useDispatch();

  const client = useMemo(() => {
    return AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });
  }, [])

  const {
    share, leave
  } = RTCClient(client);
  
  let otherTracks = useMemo(() => {
    if(mainTrack.length > 0){
      return tracks.filter(tracks => tracks.uid != mainTrack[0].uid);
    }
    return tracks.filter(tracks => tracks.uid != currentTrack[0].uid);
  }, [currentTrack, tracks, mainTrack]);
  
  const onMic = useCallback(() => {
    setUseMic(!useMic)
    currentTrack[0].audioTrack.setMuted(useMic)
  }, [useMic, currentTrack])

  const onVideocam = useCallback(() => {
    setUseVideocam(!useVideocam)
    currentTrack[0].videoTrack.setMuted(useVideocam)
  }, [useVideocam, currentTrack]);

  const onShareScreen = async function() {
    dispatch(dontUseSharing());
    await share();
  }

  const onLeaveChannel = useCallback(() => {
    leave(currentTrack[0].videoTrack, currentTrack[0].audioTrack, client);
    dispatch(userLogOut());
    routerCtx.history.push({ pathname: '/' });
  }, [tracks]);

  const onUseSetting = useCallback(() => {
    setUseSetting(!useSetting);
  }, [useSetting]);

  const onChangeMainTrack = useCallback((uid) => {
    setMainTrack(tracks.filter(tracks => tracks.uid == uid));
  }, [mainTrack, tracks]);

  const toggleMenu = useCallback(() => {
    let toggle = document.querySelector('.toggle');
    let navigation = document.querySelector('.navigation');
    let main = document.querySelector('.main');

    toggle.classList.toggle('active');
    navigation.classList.toggle('active');
    main.classList.toggle('active');
  }, [])
  
  window.onunload = function() {
    onLeaveChannel();
    return "";
  };	    	

  return (
    <div className="container">
      <div className="navigation">
        <ul>
          <li>
            <span className="title"><img src={new_owake_logo_white} alt="" /></span>
          </li>
          {otherTracks.length > 0 ? 
              otherTracks.map((user, index) => (
                <li>
                  <StreamPlayer audioTrack={user.audioTrack} videoTrack={user.videoTrack} uid={user.uid} showUid={true} key={index} onChangeMainTrack={onChangeMainTrack} />
                </li>
              ))
              :
              <></>
            }
        </ul>
      </div>

      <div className="main">
        <div className="topbar">
          <div class="toggle" onClick={toggleMenu}>
            <IonIcon className="codeOutline" icon={codeOutline}></IonIcon>
          </div>
          
          <div className="setting">
            <img src={setting} alt="" onClick={onUseSetting} />
          </div>
        </div>

        <div className="track">
          <div className="videoTrack">
            {mainTrack.length > 0 ?
              <StreamPlayer videoTrack={mainTrack[0].videoTrack} uid={mainTrack[0].uid} showUid={true} onChangeMainTrack={onChangeMainTrack} />
              :
              currentTrack.length > 0 ?
                <StreamPlayer videoTrack={currentTrack[0].videoTrack} uid={currentTrack[0].uid} showUid={true} onChangeMainTrack={onChangeMainTrack} />
                :
                <></>
            }
          </div>
        </div>

        <div className="cardBox">
          <div className="card">
            {useMic ? <IonIcon icon={micOutline} onClick={onMic}></IonIcon> : <IonIcon icon={micOffOutline} onClick={onMic}></IonIcon>}
            <p>MIC</p>
          </div>
          <div className="card">
            {useVideocam ? <IonIcon icon={videocamOutline} onClick={onVideocam}></IonIcon> : <IonIcon icon={videocamOffOutline} onClick={onVideocam}></IonIcon>}
            <p>CAM</p>
          </div>
          <div className="card">
            {sharing ? <IonIcon icon={shareOutline} onClick={onShareScreen}></IonIcon> : <IonIcon icon={shareOutline} onClick={onShareScreen}></IonIcon>}
            <p>SHARE SCREEN</p>
          </div>
          <div className="card">
            <IonIcon icon={logOutOutline} onClick={onLeaveChannel}></IonIcon>
            <p>LEAVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;