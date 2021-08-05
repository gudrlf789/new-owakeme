import React, { useRef, useEffect } from "react";

export default function StreamPlayer(props) {
  const container = useRef(null);
  useEffect(() => {
    if (!container.current) return;
    props.videoTrack?.play(container.current);

    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
    props.audioTrack?.play();

    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);

  return (
    <>
      <div
        ref={container}
        style={{ width: "480px", height: "320px" }}
        //muted="true"
      ></div>
    </>
  );
}
