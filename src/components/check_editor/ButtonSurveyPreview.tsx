import {CSSProperties, useState} from 'react';
import {dark_gray} from '../../styles/colors';
import Button from '../Button';

type Props = {
  title: string;
  values: string[];
};

export const ButtonSurveyPreview = (props: Props) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const generateButtons = () => {
    return props.values?.map((answerOption, index) => {
      const isInactive = index !== selectedIdx;
      return (
        <Button
          style={styles.button}
          color={isInactive && dark_gray}
          text={answerOption}
          key={index}
          onClick={() => setSelectedIdx(index)}
        />
      );
    });
  };

  return (
    <>
      <div style={styles.title}>{props.title}</div>
      <div style={styles.buttonContainer}>{generateButtons()}</div>
    </>
  );
};

type Styles = {
  title: CSSProperties;
  buttonContainer: CSSProperties;
  button: CSSProperties;
};

const styles: Styles = {
  title: {
    marginBottom: 15,
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  button: {
    height: 35,
    minWidth: 100,
    borderRadius: 16,
    marginBottom: 10,
  },
};
