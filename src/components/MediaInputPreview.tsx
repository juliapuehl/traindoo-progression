import {ImageSearch, PhotoCamera} from '@mui/icons-material';
import {CSSProperties} from 'react';
import {white} from '../styles/colors';

type Props = {
  title: string;
};

export const MediaInputPreview = (props: Props) => {
  return (
    <div style={styles.container}>
      <div style={styles.text}>{props.title}</div>
      <div style={styles.icons}>
        <>
          <div style={styles.iconContainer}>
            <ImageSearch style={styles.icon} />
          </div>
          <div style={styles.iconContainer}>
            <PhotoCamera style={styles.icon} />
          </div>
        </>
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  icons: CSSProperties;
  text: CSSProperties;
  icon: CSSProperties;
  iconContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  icon: {
    color: white,
    height: 24,
  },
  iconContainer: {
    height: 50,
    width: 50,
    display: 'flex',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
