import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import AgoraRTC, {
  IAgoraRTCClient, IAgoraRTCRemoteUser, MicrophoneAudioTrackInitConfig, CameraVideoTrackInitConfig, IMicrophoneAudioTrack, ICameraVideoTrack, ILocalVideoTrack, ILocalAudioTrack
} from 'agora-rtc-sdk-ng';

export default function RTCClient(client) {

  let { channelName, userName } = useParams();

  const [localVideoTrack, setLocalVideoTrack] = useState(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState(undefined);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);

  async function createLocalTracks(audioConfig, videoConfig) {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  async function join() {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();
    await client.join(process.env.REACT_APP_AGORA_APP_ID, channelName, null);
    await client.publish([microphoneTrack, cameraTrack]);

    setJoinState(true);
  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
  }
  
  useEffect(() => {
    if (!client) return;
    join().then(() => {
      setRemoteUsers(client.remoteUsers);
    });

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.

      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserUnpublished = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserJoined = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserLeft = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    channelName,
    userName
  };
}