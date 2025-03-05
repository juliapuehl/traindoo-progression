import {PhotoCamera} from '@mui/icons-material';
import {CSSProperties, useState} from 'react';
import {Lightbox} from 'react-modal-image';
import {primary_green, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  url?: string;
  date?: string;
  description?: string;
  style?: CSSProperties;
};

export const DailyMediaAthleteValue = (props: Props) => {
  const [showImage, setShowImage] = useState(false);
  const open = () => {
    setShowImage(true);
  };
  const close = () => {
    setShowImage(false);
  };
  return (
    <div style={styles.container}>
      {props.url ? (
        <IconWithTooltip
          active={props.url !== undefined && props.url !== ''}
          style={styles.iconGreen}
          eventClick={open}
          muiIcon={PhotoCamera}
          description={props.description}
        />
      ) : (
        <div style={styles.noContent}>-</div>
      )}

      {showImage && (
        <Lightbox
          medium={props.url}
          large={props.url}
          alt={props.description}
          onClose={close}
        />
      )}
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  noContent: CSSProperties;
  iconGreen: CSSProperties;
};

const styles: Styles = {
  iconGreen: {
    color: primary_green,
    height: 24,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  noContent: {
    color: white,
    ...sharedStyle.textStyle.regular,
  },
};
