import {CSSProperties, useEffect, useState} from 'react';
import {animated, useSpring} from 'react-spring';
import logo from '../assets/AppIcon.png';
import {primary_green} from '../styles/colors';

const LoadingScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  const [flip, set] = useState(false);
  const [animation, animationControl] = useSpring(() => ({
    to: {width: 430, height: 430},
    from: {width: 400, height: 400},
    reset: true,
    reverse: flip,
    delay: 0,
    config: {mass: 100, tension: 110, friction: 0},
    onRest: () => set(!flip),
  }));
  useEffect(() => {
    return () => {
      animationControl.stop();
    };
  }, [animationControl]);
  return (
    <div style={styles.container}>
      <div>
        <div style={styles.imageContainer}>
          <animated.img src={logo} style={animation} alt="Traindoo Logo" />
        </div>

        {/* <div style={styles.textContainer}>
          <div style={styles.headline}>{'TRAINDOO'}</div>
        </div> */}
      </div>
    </div>
  );
};

export default LoadingScreen;
type Styles = {
  container: CSSProperties;
  imageContainer: CSSProperties;
  textContainer: CSSProperties;
  headline: CSSProperties;
};

const styles: Styles = {
  container: {
    height: '100vH',
    width: '100vW',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  imageContainer: {
    height: 500,
    width: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    // backgroundColor: 'white',
  },
  textContainer: {
    width: '100%',
    textAlign: 'center',
  },
  headline: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 80,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: primary_green,
  },
};
