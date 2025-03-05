import {Close} from '@mui/icons-material';
import {FormControl, InputLabel} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties} from 'react';
import {
  light_gray,
  primary_green,
  ultra_dark_gray,
  white,
} from '../styles/colors';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  items: Array<{label: string; value: any}>;
  label?: string;
  onChange?: (_: string) => void;
  value?: string;
  style?: CSSProperties;
  native?: boolean;
  placeholder?: string;
  onDelete?: (_: number) => void;
  onClick?: (_: string) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      marginTop: -8,
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
      flex: 1,
      '&:hover': {
        backgroundColor: light_gray,
      },
    },
  }),
);

const SimpleSelectDelete = (props: Props) => {
  const classes = useStyles();

  const handleChange = (event: SelectChangeEvent) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };
  const handleDelete = (index: number) => {
    if (props.onDelete) {
      props.onDelete(index);
    }
  };
  const handleOnClick = (item: any) => {
    if (props.onClick) {
      props.onClick(item.value);
    }
  };
  const labelClass = props.value ? classes.content : classes.label;

  return (
    <FormControl
      fullWidth
      style={{...styles.form, ...props.style}}
      margin="dense"
    >
      <InputLabel className={labelClass} id="demo-simple-select-label">
        {props.label}
      </InputLabel>
      <Select
        value={props.value}
        variant="filled"
        fullWidth
        className={classes.select}
        inputProps={{
          classes: {
            icon: classes.icon,
            root: classes.root,
          },
        }}
        style={styles.select}
        MenuProps={{
          classes: {paper: classes.menu},
        }}
        onChange={handleChange}
      >
        {props.items.map((item, index) => (
          <div style={styles.item} key={'simpleSelectDelete' + index}>
            <MenuItem
              value={item.value}
              onClick={() => {
                handleOnClick(item);
              }}
              className={classes.menuItem}
            >
              {item.label}
            </MenuItem>
            {props.onDelete && index > 0 && (
              <IconWithTooltip
                muiIcon={Close}
                onClick={() => handleDelete(index)}
              />
            )}
          </div>
        ))}
      </Select>
    </FormControl>
  );
};

type Styles = {
  form: CSSProperties;
  select: CSSProperties;
  item: CSSProperties;
};

const styles: Styles = {
  form: {
    marginBottom: 32,
  },
  select: {
    color: white,
    alignItems: 'flex-end',
    height: 40,
  },
  item: {display: 'flex', justifyContent: 'space-between'},
};
export default SimpleSelectDelete;
