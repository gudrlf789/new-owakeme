export const SET_LOCAL_TRACK = 'SET_LOCAL_TRACK';
export const SET_LEAVE_LOCAL_TRACK = 'SET_LEAVE_LOCAL_TRACK';
export const SET_ON_LOCAL_SHARE = 'SET_ON_LOCAL_SHARE';
export const SET_OFF_LOCAL_SHARE = 'SET_OFF_LOCAL_SHARE';
export const SET_USE_SHARING = 'SET_USE_SHARING';
export const SET_DONT_USE_SHARING = 'SET_DONT_USE_SHARING';
export const SET_TRACKS = 'SET_TRACKS';
export const SET_CURRENT_TRACK = 'SET_CURRENT_TRACK';
export const SET_DELETE_TRACK = 'SET_DELETE_TRACK';

export const onLocalTrack = (videoTrack, audioTrack, client) => {
    return {
        type: SET_LOCAL_TRACK,
        localVideo: videoTrack,
        localAudio: audioTrack,
        localClient: client
    }
}

export const onLeaveLocalTrack = (uid) => {
    return {
        type: SET_LEAVE_LOCAL_TRACK,
        uid: uid
    }
}

export const onLocalShare = (shareClient, shareTrack) => {
    return {
        type: SET_ON_LOCAL_SHARE,
        shareClient: shareClient,
        shareTrack: shareTrack
    }
}

export const offLocalShare = (uid) => {
    return {
        type: SET_OFF_LOCAL_SHARE,
        uid: uid
    }
}

export const useSharing = () => {
    return {
        type: SET_USE_SHARING
    }
}

export const dontUseSharing = () => {
    return {
        type: SET_DONT_USE_SHARING
    }
}

export const setTracks = (uid, audioTrack, videoTrack) => {
    return {
        type: SET_TRACKS,
        uid: uid,
        audioTrack: audioTrack,
        videoTrack: videoTrack
    }
}

export const setCurrentTrack = (uid, audioTrack, videoTrack) => {
    return {
        type: SET_CURRENT_TRACK,
        uid: uid,
        audioTrack: audioTrack,
        videoTrack: videoTrack
    }
}

export const setDeleteTrack = (uid) => {
    return {
        type: SET_DELETE_TRACK,
        uid: uid
    }
}