import {Comment} from '@mui/icons-material';
import {Popover} from '@mui/material';
import React, {CSSProperties, useEffect, useState} from 'react';
import {
  light_gray,
  primary_green,
  ultra_dark_gray,
  ultra_light_gray,
} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  title: string;
  text: string;
  description: string;
  handleClose?: (text: string) => void;
  justDisplay?: boolean;
  style?: CSSProperties;
};

export const CommentPopover = (props: Props) => {
  const [inputValue, setInputValue] = useState(props.text);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [textOnClick, setTextOnClick] = useState('');

  useEffect(() => {
    setInputValue(props.text);
  }, [props.text]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (textOnClick !== inputValue && props.handleClose) {
      props.handleClose(inputValue);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div style={props.style}>
      <IconWithTooltip
        active={inputValue !== undefined && inputValue !== ''}
        style={styles.remarkIcon}
        styleActive={styles.remarkIconGreen}
        eventClick={handleClick}
        muiIcon={Comment}
        description={props.description}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={styles.popOver}>
          <div style={styles.headline}>{props.title}</div>
          {props.justDisplay ? (
            <div style={styles.textDisplay}>{inputValue}</div>
          ) : (
            <textarea
              placeholder={'Feedback'}
              style={styles.input}
              value={inputValue}
              onFocus={(event) => {
                setTextOnClick(event.target.value);
              }}
              onChange={(event) => setInputValue(event.target.value)}
            />
          )}
        </div>
      </Popover>
    </div>
  );
};

type Styles = {
  main: CSSProperties;
  remarkIcon: CSSProperties;
  input: CSSProperties;
  popOver: CSSProperties;
  headline: CSSProperties;
  remarkIconGreen: CSSProperties;
  textDisplay: CSSProperties;
};

const styles: Styles = {
  main: {},
  remarkIcon: {
    color: ultra_light_gray,
    height: 24,
  },
  remarkIconGreen: {
    color: primary_green,
    height: 24,
  },
  input: {
    ...sharedStyle.textStyle.regular,
    flexGrow: 1,
    flex: 1,
    margin: 8,
    backgroundColor: light_gray,
    border: 'none',
    width: 400,
    minHeight: 400,
    outline: 'none',
    resize: 'none',
    padding: 8,
    borderRadius: 8,
  },
  textDisplay: {
    ...sharedStyle.textStyle.regular,
    flexGrow: 1,
    flex: 1,
    border: 'none',
    width: 400,
    minHeight: 100,
    outline: 'none',
    resize: 'none',
    padding: 8,
    borderRadius: 8,
  },
  popOver: {
    background: ultra_dark_gray,
  },
  headline: {
    ...sharedStyle.textStyle.title2,
    padding: 16,
    width: 400,
    textAlign: 'center',
  },
};
