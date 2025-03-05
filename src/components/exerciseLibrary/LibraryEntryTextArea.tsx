import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties, useEffect, useState} from 'react';
import {light_gray, ultra_dark_gray, white} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';

const useStyles = makeStyles({
  root: {
    '&::placeholder': {
      color: white,
      opacity: 0.4,
      ...sharedStyle.textStyle.primary_white_capital,
    },
  },
});

type Props = {
  changeValue: (newText: string) => void;
  initialText: string;
  style?: CSSProperties;
  title?: string;
};

export const LibraryEntryTextArea = (props: Props) => {
  const classes = useStyles();

  const [text, setText] = useState(props.initialText);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (text !== props.initialText) {
      setText(props.initialText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialText]);
  const changeValue = (newText: string) => {
    if (newText !== props.initialText) {
      props.changeValue(newText);
    }
  };

  return (
    <div style={styles.container}>
      <div style={sharedStyle.textStyle.title2}>{props.title}</div>
      <textarea
        className={classes.root}
        placeholder={props.title}
        style={
          edit
            ? {
                ...styles.input,
                ...styles.inputEdit,
                ...props.style,
              }
            : {
                ...styles.input,
                ...props.style,
              }
        }
        value={text}
        onChange={(event) => setText(event.target.value)}
        onFocus={() => {
          setEdit(true);
        }}
        onBlur={(event) => {
          changeValue(event.target.value);
          setEdit(false);
        }}
      />
    </div>
  );
};

type Style = {
  input: CSSProperties;
  inputEdit: CSSProperties;
  container: CSSProperties;
};

const styles: Style = {
  container: {
    flex: 1,
  },
  input: {
    ...sharedStyle.textStyle.primary_white_capital,
    padding: 8,
    backgroundColor: light_gray,
    borderRadius: 8,
    outline: 'none',
    resize: 'none',
    width: '100%',
    minWidth: 300,
    minHeight: 150,
    marginTop: 16,
  },
  inputEdit: {
    backgroundColor: light_gray,
    borderWidth: 2,
    borderColor: ultra_dark_gray,
  },
};
