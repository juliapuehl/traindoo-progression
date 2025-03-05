import {CloseRounded} from '@mui/icons-material';
import {Button} from '@mui/material';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {sidebar_color_dark, white} from '../styles/colors';
import {OnboardingVideoStepper} from './OnboardingVideoStepper';

type Props = {
  open: boolean;
  close: () => void;
};

export const OnboardingOverlay = (props: Props) => {
  const handleClose = () => {
    props.close();
  };

  const onboardingSteps = [
    t('OVERLAY_ONBOARDING_TOPIC_1'),
    t('OVERLAY_ONBOARDING_TOPIC_2'),
    t('OVERLAY_ONBOARDING_TOPIC_3'),
    t('OVERLAY_ONBOARDING_TOPIC_4'),
    t('OVERLAY_ONBOARDING_TOPIC_5'),
  ];

  const onboardingDescriptions = [
    t('OVERLAY_ONBOARDING_DESCRIPTION_1'),
    t('OVERLAY_ONBOARDING_DESCRIPTION_2'),
    t('OVERLAY_ONBOARDING_DESCRIPTION_3'),
    t('OVERLAY_ONBOARDING_DESCRIPTION_4'),
    t('OVERLAY_ONBOARDING_DESCRIPTION_5'),
  ];

  const onboardingVideoIds = [
    t('OVERLAY_ONBOARDING_VIDEO_ID_1'),
    t('OVERLAY_ONBOARDING_VIDEO_ID_2'),
    t('OVERLAY_ONBOARDING_VIDEO_ID_3'),
    t('OVERLAY_ONBOARDING_VIDEO_ID_4'),
    t('OVERLAY_ONBOARDING_VIDEO_ID_5'),
  ];

  return (
    <Modal open={props.open} onClose={handleClose} sx={styles.modal}>
      <div style={styles.container}>
        <div style={styles.headerContainer}>
          <div style={styles.headerText}>{t('OVERLAY_ONBOARDING_TITLE')}</div>
          <Button onClick={handleClose}>
            <CloseRounded style={styles.closeButton} />
          </Button>
        </div>
        <OnboardingVideoStepper
          handleClose={handleClose}
          style={styles.stepper}
          steps={onboardingSteps}
          descriptions={onboardingDescriptions}
          videoIds={onboardingVideoIds}
        />
      </div>
    </Modal>
  );
};

type Styles = {
  modal: CSSProperties;
  container: CSSProperties;
  headerContainer: CSSProperties;
  headerText: CSSProperties;
  stepper: CSSProperties;
  closeButton: CSSProperties;
};

const styles: Styles = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    minWidth: 1000,
    width: '90%',
    minHeight: 700,
    height: '90%',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 80,
    background: sidebar_color_dark,
    borderRadius: 24,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    /* we set this value here and not set via container/paddingRight
     * because it differs from stepper's margin/padding (which is 80) */
    marginRight: 30,
    marginBottom: 25,
  },
  headerText: {
    fontSize: 34,
    color: white,
  },
  stepper: {
    flex: 1,
    marginRight: 80,
  },
  closeButton: {
    color: white,
  },
};
