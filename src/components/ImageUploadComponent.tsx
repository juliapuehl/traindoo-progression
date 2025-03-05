import Button from '@mui/material/Button';
import imageCompression from 'browser-image-compression';
import {t} from 'i18n-js';
import React, {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {
  getUserId,
  usersDataPublicProfileQuery,
  usersDataQuery,
} from '../logic/firestore';
import {primary_green, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

const ImageUploadComponent = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const [status, setStatus] = useState('');
  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleUpload = async (e) => {
    setStatus('Loading...');
    const path = `user/${userId}/profilePicture/${userId}-TrainerProfilePicture.png`;
    if (e.target?.files[0]) {
      const file = await compressImage(e.target.files[0]);
      if (file) {
        setStatus('Uploading');
        e.preventDefault();
        const ref = firebase.storage().ref(path);
        const uploadTask = ref.put(file);
        uploadTask.on('state_changed', console.log, console.error, () => {
          ref.getDownloadURL().then((url) => {
            firestore.update(usersDataPublicProfileQuery(userId), {
              'trainer.profilePicture': url,
            });
            firestore.update(usersDataQuery(userId), {
              'trainer.profilePicture': url,
            });
            setStatus('');
          });
        });
      } else {
        setStatus('');
      }
    } else {
      setStatus('');
    }
  };

  const compressImage = async (imageFile) => {
    setStatus('Compressing Image');

    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (progress) => {
        setStatus('Compressing ' + progress + '%');
      },
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        'compressedFile instanceof Blob',
        compressedFile instanceof Blob,
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
      ); // smaller than maxSizeMB

      return compressedFile;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  return (
    <>
      {!status && (
        <Button color="secondary" style={styles.button} onClick={handleClick}>
          {t('SETTINGS_UPLOAD_PROFILE_PIC')}
        </Button>
      )}
      {status && <div style={styles.status}>{status}</div>}
      <input
        type="file"
        accept="image/*"
        ref={hiddenFileInput}
        onChange={handleUpload}
        style={styles.displayNone}
      />
    </>
  );
};

type Style = {
  button: CSSProperties;
  displayNone: CSSProperties;
  status: CSSProperties;
};

const styles: Style = {
  button: {
    width: '100%',
    backgroundColor: primary_green,
    color: white,
    margin: 8,
    marginBottom: 32,
  },
  displayNone: {
    display: 'none',
  },
  status: {
    ...sharedStyle.textStyle.title2,
    height: 35.7,
    margin: 8,
    marginBottom: 32,
  },
};

export default ImageUploadComponent;
