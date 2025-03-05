import {CSSProperties} from 'react';
import {medium_gray} from '../styles/colors';

type Props = {
  placeholder?: string;
  value?: string;
  description?: string;
  categoryName?: string;
};

export const LongTextInputPreview = (props: Props) => {
  return (
    <>
      <div style={styles.subtitle}>{props.description}</div>
      <div style={styles.input}>{props.placeholder}</div>
    </>
  );
};

type Style = {
  container: CSSProperties;
  input: CSSProperties;
  outestContainer: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
};
const styles: Style = {
  container: {
    background: 'linear-gradient(#2D3636, #323839)',
    width: 400,
    borderRadius: 8,
    marginTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  input: {
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',

    backgroundColor: medium_gray,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  outestContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  subtitle: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
};
