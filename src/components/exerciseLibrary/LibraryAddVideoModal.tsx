import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {red} from '@mui/material/colors';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirebase} from 'react-redux-firebase';
import {getUserId} from '../../logic/firestore';
import {primary_green, sidebar_color_dark, white} from '../../styles/colors';
import {WebMediaContent} from '../../traindoo_shared/types/ExerciseLibrary';
import {getYouTubeId} from '../../utils/helper';
import BasicTextField from '../BasicTextField';
import ButtonCustom from '../Button';

type Props = {
  handleClose: () => void;
  open: boolean;
  setLoading: (_: boolean) => void;
  handleConfirm: (newValue: WebMediaContent) => void;
};

export const LibraryAddVideoModal = (props: Props) => {
  const [videoLink, setVideoLink] = useState('');
  const [video, setVideo] = useState<any>();
  const [error, setError] = useState('');
  // const [description, setDescription] = useState('Test');
  const firebase = useFirebase();
  const userId = useSelector(getUserId);
  const handleConfirm = async (uploadVideo: any) => {
    const name = moment().toISOString();
    if (uploadVideo) {
      try {
        handleClose();
        props.setLoading(true);
        const url = `user/${userId}/exerciseLibrary/videos/${name}`;
        const task = firebase.storage().ref(url).put(uploadVideo);

        task.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (e) => {
            // Handle unsuccessful uploads
            console.warn(e);
            props.setLoading(false);
          },
          () => {
            firebase
              .storage()
              .ref(url)
              .getDownloadURL()
              .then((downloadURL) => {
                props.handleConfirm({
                  link: downloadURL,
                  name: name,
                });
                props.setLoading(false);
              });
          },
        );
      } catch (e) {
        console.warn(e);
      }
    } else if (videoLink) {
      const isYouTubeLink = getYouTubeId(videoLink)?.isYouTube;
      if (!isYouTubeLink) {
        setError(t('LIBRARY_ENTRY_VIDEOS_MODAL_YOUTUBE_ERROR'));
        setTimeout(() => {
          setError('');
        }, 4000);
      } else {
        props.handleConfirm({link: videoLink, name: name});
        handleClose();
      }
    }
  };
  const handleClose = () => {
    setVideo(undefined);
    setVideoLink('');
    props.handleClose();
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.headline}
          >
            {t('LIBRARY_ENTRY_VIDEOS_MODAL_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {t('LIBRARY_ENTRY_VIDEOS_MODAL_TEXT')}
          </Typography>
          <BasicTextField
            label={t('LIBRARY_ENTRY_VIDEOS_MODAL_PLACEHOLDER')}
            onChange={setVideoLink}
            disabled={video !== undefined}
          />
          <input
            type="file"
            onChange={(e) => {
              setVideo(e.target.files[0]);
            }}
            accept="video/mp4,video/x-m4v,video/*"
            style={styles.videoInput}
            disabled={videoLink !== ''}
          />
          {error && (
            <Typography
              id="modal-modal-title"
              variant="subtitle2"
              component="h2"
              textAlign="center"
              style={styles.text}
              color={red}
            >
              {error}
            </Typography>
          )}

          <div style={styles.buttonContainer}>
            <ButtonCustom
              text={t('LIBRARY_ENTRY_VIDEOS_MODAL_CONFIRM')}
              onClick={() => handleConfirm(video)}
              color={primary_green}
              style={styles.button}
              disabled={!video && !videoLink}
            />
            <ButtonCustom
              text={t('LIBRARY_ENTRY_VIDEOS_MODAL_CANCEL')}
              onClick={() => props.handleClose()}
              color={primary_green}
              style={styles.button}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  modal: CSSProperties;
  button: CSSProperties;
  buttonContainer: CSSProperties;
  headline: CSSProperties;
  text: CSSProperties;
  videoInput: CSSProperties;
};

const styles: Styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: sidebar_color_dark,
    border: '2px solid #000',
    borderRadius: 8,
    boxShadow: '2px 2px 1px rgba(0, 0, 0, 0.2)',
    maxWidth: 400,
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    maxWidth: 200,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
  },
  headline: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 16,
  },
  videoInput: {color: white, marginBottom: 32},
};
