import {ArrowBackIosRounded} from '@mui/icons-material/';
import {Button, Step, StepLabel, Stepper} from '@mui/material';
import {t} from 'i18n-js';
import React, {CSSProperties} from 'react';
import ReactPlayer from 'react-player';
import {new_green, white} from '../styles/colors';

type Props = {
  handleClose: () => void;
  style: CSSProperties;
  steps: string[];
  descriptions: string[];
  videoIds: string[];
};

const videoWidth = 560;

// based on MUI template https://mui.com/material-ui/react-stepper/#horizontal-stepper
export const OnboardingVideoStepper = (props: Props) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === props.steps.length - 1) {
      setActiveStep(0);
      // set firestore flag so that Onboarding Videos are not shown on next login
      props.handleClose();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    /* row container with Stepper on left hand side & video + descriptive text on right hand side */
    <div style={{...props.style, ...styles.outerContainer}}>
      {/* column container for steps & Stepper navigation buttons, each has their sub-container */}
      <div style={styles.stepperBackground}>
        <div style={styles.stepsContainer}>
          <Stepper style={{}} activeStep={activeStep} orientation="vertical">
            {props.steps.map((label, index) => {
              const stepProps: {completed?: boolean} = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>
        <div style={styles.buttonContainer}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{mr: 1}}
          >
            <ArrowBackIosRounded style={{fontSize: 'medium'}} />
          </Button>
          <Button style={styles.nextButton} onClick={handleNext}>
            <div style={styles.nextButtonText}>
              {activeStep === props.steps.length - 1
                ? t('OVERLAY_ONBOARDING_CTA_FINAL')
                : t('OVERLAY_ONBOARDING_CTA')}
            </div>
          </Button>
        </div>
      </div>
      {/* column container for overlay's right hand side incl subheader, video & descriptive text */}
      <div style={styles.rightContainer}>
        <ReactPlayer
          style={{flex: 1}}
          width={'100%'}
          url={`https://www.youtube.com/embed/${props.videoIds[activeStep]}`}
          controls={true}
        />
        <div style={styles.description}>{props.descriptions[activeStep]}</div>
      </div>
    </div>
  );
};

type Styles = {
  outerContainer: CSSProperties;
  stepperBackground: CSSProperties;
  stepsContainer: CSSProperties;
  buttonContainer: CSSProperties;
  nextButton: CSSProperties;
  nextButtonText: CSSProperties;
  rightContainer: CSSProperties;
  description: CSSProperties;
};

const styles: Styles = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  stepperBackground: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: 275,
    marginRight: 20,
    backgroundColor: white,
    borderRadius: 10,
  },
  stepsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 35,
    paddingBottom: 15,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 15,
    marginBottom: 15,
  },
  nextButton: {
    width: 160,
    height: 50,
    backgroundColor: new_green,
    fontSize: 14,
    borderRadius: 25,
  },
  nextButtonText: {
    color: white,
  },
  rightContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    // maxWidth: videoWidth,
    marginTop: 20,
    color: white,
    fontSize: 15,
  },
};
