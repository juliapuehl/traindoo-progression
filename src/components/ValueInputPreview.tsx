import {CSSProperties} from 'react';

type Props = {
  question?: string;
  valueTop?: string;
  value?: string;
};
export const ValueInputPreview = (props: Props) => {
  const bottomTextStyle = {opacity: 0.6};
  let fontSize = 20;
  const textLength = props.value?.length ?? 0;
  if (textLength > 5) {
    fontSize = 25 - textLength;
  }
  const fontStyle = fontSize > 4 ? {fontSize: fontSize} : {fontSize: 8};

  return (
    <>
      <div style={styles.contentContainer}>
        <div style={styles.text}>{props.question}</div>
        <div style={styles.valueContainer}>
          <div style={styles.valueTop}>{props.valueTop}</div>
          <div
            style={{...styles.valueCenter, ...bottomTextStyle, ...fontStyle}}
          >
            {props.value ?? ''}
          </div>
          <div style={styles.borderBottom} />
        </div>
      </div>
    </>
  );
};

type Styles = {
  valueContainer: CSSProperties;
  valueCenter: CSSProperties;
  valueTop: CSSProperties;
  borderBottom: CSSProperties;
  outerContainer: CSSProperties;
  innerContainer: CSSProperties;
  contentContainer: CSSProperties;
  text: CSSProperties;
  title: CSSProperties;
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
  contentContainer: {
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  innerContainer: {
    background: 'linear-gradient(#2D3636, #323839)',
    width: 400,
    borderRadius: 8,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  valueContainer: {
    height: 65,
    width: 64,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueCenter: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
    marginBottom: 3,
    height: 30,
    width: 70,
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  valueTop: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.87)',
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  borderBottom: {
    backgroundColor: '#CACACA',
    height: 2,
    width: '70%',
    borderRadius: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
};
