import Button from '@mui/material/Button';
import {CSSProperties} from 'react';
import {primary_green, white} from '../styles/colors';

type Props = {
  color?: string;
  text: string;
  onClick: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  intercomTarget?: string;
};

const ButtonCustom = (props: Props) => {
  let style = {...props.style, ...styles.greenButton};
  if (props.color) {
    style = {...style, ...{backgroundColor: props.color}};
  }
  if (props.disabled) {
    style = {...style, opacity: 0.4};
  }
  return (
    <Button
      disabled={props.disabled}
      color="secondary"
      style={style}
      onClick={() => props.onClick()}
      data-intercom-target={props.intercomTarget}
      // Used for intercom targeting
      className={props.intercomTarget}
    >
      {props.text}
    </Button>
  );
};

type Styles = {
  greenButton: CSSProperties;
};

const styles: Styles = {
  greenButton: {
    backgroundColor: primary_green,
    color: white,
  },
};

export default ButtonCustom;
