import AgoraRTC from 'agora-rtc-sdk-ng';
import $ from 'jquery';

var client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

var localTracks = {
    videoTrack: null,
    screenTrack: null,
    audioTrack: null
};

async function shareScreen() {

    [localTracks.screenTrack] = await Promise.all([
        AgoraRTC.createScreenVideoTrack({ encoderConfig: { mode: "rtc", codec: "v8" } }, "disable")
    ]);
    localTracks.screenTrack.on("track-ended", handleTrackEnded);
    localTracks.screenTrack.play("screen-player");
}

function handleTrackEnded() {

    var track = localTracks["screenTrack"];
    if (track) {
        track.stop();
        track.close();
        localTracks["screenTrack"] = undefined;
    }
    $("#local-screen-name").text("");
    client.unpublish(track);
    console.log("handleTrackEnded");
}

export default shareScreen;

























