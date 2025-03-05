import {Add, Close} from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useCallback, useState} from 'react';
import {ultra_dark_gray} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import IconWithTooltip from '../IconWithTooltip';
import {ReactPlayerContainer} from '../ReactPlayerContainer';
import {LibraryAddVideoModal} from './LibraryAddVideoModal';
import {useExerciseLibraryVideoConnect} from './model/useExerciseLibraryVideoConnect';

type Props = {
  exerciseName: string;
};

export const LibraryEntryVideosComponent = ({exerciseName}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<string[]>([]);
  const handleCloseModal = () => {
    if (modalOpen) {
      setModalOpen(false);
    }
  };
  const {videos, addVideo, deleteVideo} =
    useExerciseLibraryVideoConnect(exerciseName);
  const handleLoading = useCallback(
    (add: boolean) => {
      if (add) {
        const newLoading = loading.concat(exerciseName);
        setLoading(newLoading);
      } else {
        const newLoading = loading.splice(loading.indexOf(exerciseName), 1);
        setLoading(newLoading);
      }
    },
    [loading, exerciseName],
  );

  return (
    <div style={styles.container}>
      <div style={sharedStyle.textStyle.title2}>
        {t('LIBRARY_ENTRY_VIDEOS')}
      </div>
      <div style={styles.videoList}>
        {loading.includes(exerciseName) && (
          <div style={styles.videoContainer}>
            <CircularProgress color="primary" />
          </div>
        )}
        {videos?.map((video, index) =>
          // <ReactPlayer key={'video' + index} url={video.link} light />
          {
            if (video.link.includes('firebase')) {
              return (
                <div style={styles.videoButtonGroup} key={'video' + index}>
                  <IconWithTooltip
                    style={styles.deleteStyle}
                    muiIcon={Close}
                    onClick={() => deleteVideo(index)}
                  />
                  <div style={styles.videoContainer}>
                    <video style={styles.video} muted controls src={video.link}>
                      {t('LIBRARY_ENTRY_VIDEOS_ERROR')}
                    </video>
                  </div>
                </div>
              );
            } else {
              return (
                <div style={styles.videoButtonGroup} key={'video' + index}>
                  <IconWithTooltip
                    style={styles.deleteStyle}
                    muiIcon={Close}
                    onClick={() => deleteVideo(index)}
                  />
                  <div style={styles.videoContainer}>
                    <ReactPlayerContainer
                      style={styles.video}
                      url={video.link}
                    />
                  </div>
                </div>
              );
            }
          },
        )}
        <div style={styles.newButton} onClick={() => setModalOpen(true)}>
          {t('LIBRARY_ENTRY_VIDEOS_ADD')}
          <IconWithTooltip muiIcon={Add} onClick={() => setModalOpen(true)} />
        </div>
      </div>
      <LibraryAddVideoModal
        handleClose={handleCloseModal}
        open={modalOpen}
        setLoading={handleLoading}
        handleConfirm={(newValue) => {
          addVideo(newValue);
        }}
      />
    </div>
  );
};

type Style = {
  video: CSSProperties;
  videoContainer: CSSProperties;
  videoList: CSSProperties;
  newButton: CSSProperties;
  videoButtonGroup: CSSProperties;
  deleteStyle: CSSProperties;
  container: CSSProperties;
};
const styles: Style = {
  container: {
    marginTop: 16,
  },
  videoList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 360,
    width: 360,
  },
  video: {
    maxWidth: 350,
    maxHeight: 350,
  },
  newButton: {
    ...sharedStyle.textStyle.primary_white_capital,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    width: 400,
  },
  videoButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    padding: 16,
    background: ultra_dark_gray,
    borderRadius: 16,
    margin: 8,
  },
  deleteStyle: {
    color: 'white',
  },
};
