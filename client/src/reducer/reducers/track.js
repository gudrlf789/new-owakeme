import { SET_LOCAL_TRACK, SET_LEAVE_LOCAL_TRACK, SET_ON_LOCAL_SHARE, SET_OFF_LOCAL_SHARE, SET_USE_SHARING,
    SET_DONT_USE_SHARING, SET_TRACKS, SET_CURRENT_TRACK, SET_DELETE_TRACK } from '../actions/track'

const initState = {
   localVideo: undefined,
   localAudio: undefined,
   localClient: undefined,
   shareClient: undefined,
   shareTrack: undefined,
   sharing: true,
   isLocal: false,
   tracks: [],
   currentTrack: []
}

const trackReducer = (state = initState, action) => {
   switch(action.type) {
       case SET_LOCAL_TRACK:
           return {
               ...state,
               localAudio: action.localAudio,
               localVideo: action.localVideo,
               localClient: action.localClient,
               isLocal: true
           };
       case SET_LEAVE_LOCAL_TRACK:
           return {
               ...state,
               localAudio: undefined,
               localVideo: undefined,
               localClient: undefined,
               isLocal: false,
               tracks : [],
               currentTrack: []
           }
       case SET_ON_LOCAL_SHARE:
           return {
               ...state,
               shareClient: action.shareClient,
               shareTrack: action.shareTrack
           }
       case SET_OFF_LOCAL_SHARE:
           return {
               ...state,
               shareClient: undefined,
               shareTrack: undefined,
               tracks : state.tracks.filter(tracks => tracks.uid != action.uid)
           }
       case SET_USE_SHARING:
           return {
               ...state,
               sharing: true
           }
       case SET_DONT_USE_SHARING:
           return {
               ...state,
               sharing: false
           }
       case SET_TRACKS:
           return {
               ...state,
               tracks: [...state.tracks, {
                   audioTrack: action.audioTrack,
                   videoTrack: action.videoTrack,
                   uid: action.uid
               }]
           }
       case SET_CURRENT_TRACK:
           return {
               ...state,
               currentTrack: [{
                   audioTrack: action.audioTrack,
                   videoTrack: action.videoTrack,
                   uid: action.uid
               }]
           }
       case SET_DELETE_TRACK:
           return {
               ...state,
               tracks : state.tracks.filter(tracks => tracks.uid != action.uid)
           }
       default:
           return {
               ...state
           }
   }
}

export default trackReducer;