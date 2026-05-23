import React from 'react';

type SecureVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export default function SecureVideo(props: SecureVideoProps) {
  return (
    <video
      {...props}
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      draggable={false}
      onContextMenu={(event) => {
        event.preventDefault();
        props.onContextMenu?.(event);
      }}
    />
  );
}
