import {Add} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {sharedStyle} from '../../styles/sharedStyles';
import IconWithTooltip from '../IconWithTooltip';

import {LibraryAddPhotoModal} from './LibraryAddPhotoModal';
import {LibraryEntryImageComponent} from './LibraryEntryImageComponent';
import {useExerciseLibraryImageConnect} from './model/useExerciseLibraryImageConnect';

type Props = {
  exerciseName: string;
};

export const LibraryEntryImagesContainerComponent = ({exerciseName}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const {images, addImage, removeImage} =
    useExerciseLibraryImageConnect(exerciseName);
  return (
    <div style={styles.container}>
      <div style={sharedStyle.textStyle.title2}>{t('LIBRARY_IMAGES')}</div>
      <div style={styles.imageList}>
        {images?.map((photo, index) => (
          <LibraryEntryImageComponent
            key={'photo' + index}
            photo={photo}
            deleteImage={() => removeImage(index)}
          />
        ))}
        <div style={styles.newButton} onClick={() => setModalOpen(true)}>
          {t('LIBRARY_IMAGES_ADD')}
          <IconWithTooltip muiIcon={Add} onClick={() => setModalOpen(true)} />
        </div>
        <LibraryAddPhotoModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          handleConfirm={(newValue) => {
            setModalOpen(false);
            addImage(newValue);
          }}
        />
      </div>
    </div>
  );
};

type Style = {
  imageList: CSSProperties;
  newButton: CSSProperties;
  container: CSSProperties;
};
const styles: Style = {
  container: {
    marginTop: 16,
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
    justifyContent: 'center',
    height: 400,
    width: 400,
  },
};
