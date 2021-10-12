import React, { useRef, useEffect, useCallback } from "react";

const StreamPlayer = ({ audioTrack, videoTrack, uid, showUid, onChangeMainTrack }) => {
  const container = useRef(null);
  
  useEffect(() => {
    if (!container.current) return;
    videoTrack?.play(container.current);

    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack]);
  useEffect(() => {
    audioTrack?.play();

    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack]);

  const changeCurrentTrack = useCallback(() => {
    onChangeMainTrack(uid);
  }, [uid]);

  return (
    <div
      className="view__container"
      ref={container}
      onClick={changeCurrentTrack}
    >
        {showUid && 
          <div className="stream__container">
            <div className='stream-uid'>UID: {uid}</div>
          </div>
        }
    </div>
  );
};

export default React.memo(StreamPlayer);
