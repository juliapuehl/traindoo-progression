import {FormControl, InputLabel, Tooltip} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {
  light_gray,
  primary_green,
  ultra_dark_gray,
  white,
} from '../styles/colors';

type Props = {
  items: Array<{label: string; value: any}>;
  label?: string;
  value?: string | string[];
  onChange?: (newValue: string) => void;
  style?: CSSProperties;
  native?: boolean;
  placeholder?: string;
  tooltip?: string;
  multiple?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      //marginTop: -8,
      color: white,
      '&.Mui-focused': {
        marginTop: 0,
        color: primary_green,
      },
    },
    content: {
      marginTop: 0,
      color: white,
      '&.Mui-focused': {
        marginTop: 0,
        color: primary_green,
      },
    },
    select: {
      '&:after': {
        borderColor: primary_green,
      },
      '&:not(.Mui-disabled):hover::before': {
        borderColor: primary_green,
      },
    },
    icon: {
      fill: white,
    },
    root: {
      color: white,
      height: 40,
    },
    menu: {
      color: white,
      backgroundColor: ultra_dark_gray,
    },
    menuItem: {
      '&:hover': {
        backgroundColor: light_gray,
      },
    },
  }),
);

const SimpleSelect = (props: Props) => {
  const classes = useStyles();
  const [focused, setFocused] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };
  const selectRef = useRef(null);
  const labelClass = props.value ? classes.content : classes.label;
  return (
    <Tooltip
      title={focused ? '' : props.tooltip ?? ''}
      placement="top-start"
      arrow
    >
      <FormControl
        fullWidth
        style={{...styles.form, ...props.style}}
        margin="dense"
      >
        <InputLabel className={labelClass} id="demo-simple-select-label">
          {props.label}
        </InputLabel>
        <Select
          multiple={props.multiple}
          inputRef={selectRef}
          value={props.value}
          variant="filled"
          fullWidth
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          className={classes.select}
          inputProps={{
            classes: {
              icon: classes.icon,
              root: classes.root,
            },
          }}
          onClose={() => {
            setTimeout(() => {
              try {
                // eslint-disable-next-line no-undef
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              } catch (error) {
                console.log(error);
              }
            }, 0);
          }}
          style={styles.select}
          MenuProps={{
            classes: {paper: classes.menu},
          }}
          onChange={handleChange}
        >
          {props.items.map((item) => (
            <MenuItem
              key={uuidv4()}
              value={item.value}
              className={classes.menuItem}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
};

type Styles = {
  form: CSSProperties;
  select: CSSProperties;
};

const styles: Styles = {
  form: {},
  select: {
    color: white,
    //alignItems: 'flex-end',
    height: 40,
  },
};
export default SimpleSelect;
