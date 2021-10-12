import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import AgoraRTC  from 'agora-rtc-sdk-ng';
import { onLocalTrack, onLeaveLocalTrack, onLocalShare, offLocalShare, useSharing, dontUseSharing, setTracks, setCurrentTrack, setDeleteTrack } from './reducer/actions/track';

export default function RTCClient(client) {
  const channelName = useSelector(state => state.channelReducer.channelName);
  const { audioId, cameraId, resolution } = useSelector(state => state.deviceReducer);
  const { localVideo, localAudio, localClient, shareClient, shareTrack } = useSelector(state => state.trackReducer);

  const dispatch = useDispatch();

  async function createLocalTracks() {
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, AGC: true, ANS: true, audioId: audioId });
    const cameraTrack = await AgoraRTC.createCameraVideoTrack({ cameraId: cameraId, encoderConfig: resolution});
    dispatch(onLocalTrack(cameraTrack, microphoneTrack, client));

    return [microphoneTrack, cameraTrack];
  }

  async function join() {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();
    const uid = await client.join(process.env.REACT_APP_AGORA_APP_ID, channelName, null);

    dispatch(setCurrentTrack(uid, microphoneTrack, cameraTrack));
    dispatch(setTracks(uid, microphoneTrack, cameraTrack));
    await client.publish([microphoneTrack, cameraTrack]);
  }

  async function leave(video, audio, userClient) {
    if(shareClient){
      LeaveShareScreen(shareClient, shareTrack);
    }

    if (audio) {
      audio.stop();
      audio.close();
    }
    if (video) {
      video.stop();
      video.close();
    }

    dispatch(onLeaveLocalTrack(userClient.uid));

    await userClient?.leave();
  }

  function LeaveShareScreen(screenClient, screenTrack) {
    const screenUid = screenClient.uid;

    screenClient.unpublish(screenTrack);
    screenTrack.stop();
    screenTrack.close();

    screenClient.leave();
    dispatch(useSharing());
    dispatch(offLocalShare(screenUid));
  }

  async function share() {
    if(shareClient){
      LeaveShareScreen(shareClient, shareTrack);
    }else{
      const screenClient = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });
      await screenClient.join(process.env.REACT_APP_AGORA_APP_ID, channelName, null);

      const screenTrack = await AgoraRTC.createScreenVideoTrack({encoderConfig: resolution});
      await screenClient.publish(screenTrack);
      dispatch(onLocalShare(screenClient, screenTrack));

      screenTrack.on("track-ended", (user) => {
        dispatch(dontUseSharing());
        LeaveShareScreen(screenClient, screenTrack);
      })
      return screenTrack;
    }
    
  }

  useEffect(() => {
    if (!client) return;

    if(localClient){
      leave(localVideo, localAudio, localClient).then(() => {
        join();
      });
    }else{
      join();
    }
    
    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      
      if(mediaType == "video"){
        dispatch(setTracks(user.uid, user.audioTrack, user.videoTrack));
      }
    }
    const handleUserUnpublished = (user) => {
      //setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserJoined = (user) => {
      //setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserLeft = (user) => {
      dispatch(setDeleteTrack(user.uid));
    }
    const handleConnectionStateChange = (curState, prevState) => {

    }

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);
    client.on('connection-state-change', handleConnectionStateChange);
    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.off('connection-state-change', handleConnectionStateChange)
    };
  }, [client]);

  return {
    share,
    leave
  };
}