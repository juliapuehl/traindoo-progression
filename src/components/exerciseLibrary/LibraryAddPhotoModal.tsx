import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import imageCompression from 'browser-image-compression';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirebase} from 'react-redux-firebase';
import {getUserId} from '../../logic/firestore';
import {primary_green, sidebar_color_dark, white} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {WebMediaContent} from '../../traindoo_shared/types/ExerciseLibrary';
import ButtonCustom from '../Button';

type Props = {
  handleClose: () => void;
  open: boolean;
  handleConfirm: (newValue: WebMediaContent) => void;
};

export const LibraryAddPhotoModal = (props: Props) => {
  const [image, setImage] = useState<any>();
  const [status, setStatus] = useState('');
  // const [description, setDescription] = useState('Test');
  const firebase = useFirebase();
  const userId = useSelector(getUserId);

  const handleUpload = async () => {
    setStatus(t('LIBRARY_ENTRY_IMAGES_MODAL_UPLOAD_LOADING'));
    if (image) {
      const file = await compressImage(image);
      const name = moment().toISOString();
      if (file) {
        setStatus(t('LIBRARY_ENTRY_IMAGES_MODAL_UPLOAD_UPLOAD'));
        const url = `user/${userId}/exerciseLibrary/images/${name}`;
        await firebase.storage().ref(url).put(file);
        const downloadUrl = await firebase.storage().ref(url).getDownloadURL();
        props.handleConfirm({
          link: downloadUrl,
          name: name,
        });
        setStatus('');
      } else {
        setStatus('');
      }
    } else {
      setStatus('');
    }
    setImage(undefined);
  };

  const compressImage = async (imageFile) => {
    setStatus(t('LIBRARY_ENTRY_IMAGES_MODAL_UPLOAD_COMPRESSING'));
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (progress) => {
        setStatus(
          t('LIBRARY_ENTRY_IMAGES_MODAL_UPLOAD_COMPRESSING_STATE', {
            progress: progress,
          }),
        );
      },
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            textAlign="center"
            style={styles.headline}
            color={white}
          >
            {t('LIBRARY_ENTRY_IMAGES_MODAL_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            style={styles.text}
            color={white}
          >
            {t('LIBRARY_ENTRY_IMAGES_MODAL_TEXT')}
          </Typography>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            accept="image/*"
            style={styles.imageInput}
          />
          {status && <div style={styles.status}>{status}</div>}
          {!status && (
            <div style={styles.buttonContainer}>
              <ButtonCustom
                text={t('LIBRARY_ENTRY_IMAGES_MODAL_CONFIRM')}
                onClick={handleUpload}
                color={primary_green}
                style={styles.button}
                disabled={image === undefined}
              />
              <ButtonCustom
                text={t('LIBRARY_ENTRY_IMAGES_MODAL_CANCEL')}
                onClick={() => props.handleClose()}
                color={primary_green}
                style={styles.button}
              />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  modal: CSSProperties;
  button: CSSProperties;
  status: CSSProperties;
  buttonContainer: CSSProperties;
  headline: CSSProperties;
  text: CSSProperties;
  imageInput: CSSProperties;
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
  status: {
    ...sharedStyle.textStyle.title2,
    height: 35.7,
    margin: 8,
    marginBottom: 32,
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
  imageInput: {color: white, marginBottom: 32},
};
