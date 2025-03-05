import {Close} from '@mui/icons-material';
import {ImageListItem} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {ultra_dark_gray} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {WebMediaContent} from '../../traindoo_shared/types/ExerciseLibrary';
import IconWithTooltip from '../IconWithTooltip';

type Props = {
  photo: WebMediaContent;
  deleteImage: () => void;
};
export const LibraryEntryImageComponent = (props: Props) => {
  const [fullScreen, setFullScreen] = useState(false);
  const fullStyle = fullScreen
    ? ({
        ...styles.imageContainer,
        height: '100vh',
        width: '100vw',
      } as CSSProperties)
    : styles.imageContainer;
  const fullImageStyle = fullScreen
    ? ({
        ...styles.image,
        maxHeight: '100vh',
        maxWidth: '100vw',
      } as CSSProperties)
    : styles.image;
  return (
    <div style={styles.imageButtonGroup}>
      <IconWithTooltip
        style={styles.deleteStyle}
        muiIcon={Close}
        onClick={() => props.deleteImage()}
      />
      <ImageListItem style={fullStyle}>
        <img
          onClick={() => {
            setFullScreen(!fullScreen);
          }}
          style={fullImageStyle}
          src={props.photo.link}
          loading="lazy"
        />
        {/* <LibraryEntryTextArea
              placeholder={'Bild Beschreibung'}
              initialText={photo.description}
              changeValue={() => {
              }}
            /> */}
      </ImageListItem>
    </div>
  );
};

type Style = {
  image: CSSProperties;
  imageContainer: CSSProperties;
  imageList: CSSProperties;
  newButton: CSSProperties;
  deleteStyle: CSSProperties;
  imageButtonGroup: CSSProperties;
};
const styles: Style = {
  imageContainer: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    width: 400,
  },
  image: {
    maxWidth: 350,
    maxHeight: 350,
    marginBottom: 16,
    objectFit: 'contain',
  },
  imageList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  newButton: {
    ...sharedStyle.textStyle.primary_white_capital,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  deleteStyle: {
    color: 'white',
  },
  imageButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    padding: 16,
    background: ultra_dark_gray,
    borderRadius: 16,
    margin: 8,
  },
};
