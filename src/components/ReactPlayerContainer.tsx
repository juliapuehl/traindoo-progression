import React, {CSSProperties, useState} from 'react';
import ReactPlayer from 'react-player';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  style: CSSProperties;
  url: string;
};
export const ReactPlayerContainer = (props: Props) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div style={sharedStyle.textStyle.primary_white_capital}>
        Url does not contain video
      </div>
    );
  } else {
    return (
      <ReactPlayer
        style={props.style}
        url={props.url}
        onError={() => setError(true)}
      />
    );
  }
};
