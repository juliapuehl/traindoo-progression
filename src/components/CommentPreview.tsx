import {CSSProperties} from 'react';

type Props = {
  description?: string;
  placeholder?: string;
  categoryName?: string;
};

export const CommentPreview = (props: Props) => {
  return (
    <>
      <div style={styles.text}>{props.description}</div>
      <div style={styles.innerContainer}>
        <div style={styles.input}>{props.placeholder}</div>
        <div style={styles.border} />
      </div>
    </>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  input: CSSProperties;
  text: CSSProperties;
  border: CSSProperties;
  title: CSSProperties;
  outestContainer: CSSProperties;
};

const styles: Styles = {
  title: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
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
  outestContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
    marginBottom: 5,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  },
  border: {
    backgroundColor: '#484848',
    opacity: 20,
    height: 2,
    marginTop: 5,
  },
  input: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    height: 25,
    color: 'rgba(255, 255, 255, 0.3)',
  },
};
