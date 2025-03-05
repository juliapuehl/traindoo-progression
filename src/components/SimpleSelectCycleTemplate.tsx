import {Close} from '@mui/icons-material';
import {FormControl, InputLabel} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties} from 'react';
import {v4 as uuidv4} from 'uuid';
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
  noDeleteIndex?: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      // marginTop: -8,
    },
    // selected: { marginTop: 0 },
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

export const SimpleSelectCycleTemplate = (props: Props) => {
  console.log(props.value);
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
  const noDeleteIndex = props.noDeleteIndex ?? -1;
  return (
    <FormControl
      fullWidth
      style={{...styles.form, ...props.style}}
      margin="dense"
    >
      <InputLabel
        className={classes.label}
        style={styles.label}
        id="demo-simple-select-label"
      >
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
          <MenuItem
            key={uuidv4()}
            value={item.value}
            onClick={() => {
              handleOnClick(item);
            }}
            style={styles.item}
            className={classes.menuItem}
          >
            {item.label}
            {props.onDelete &&
              index > noDeleteIndex &&
              props.value !== item.value && (
                <IconWithTooltip
                  key={'delete' + index}
                  muiIcon={Close}
                  onClick={() => handleDelete(index)}
                />
              )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type Styles = {
  form: CSSProperties;
  label: CSSProperties;
  select: CSSProperties;
  item: CSSProperties;
};

const styles: Styles = {
  form: {
    marginBottom: 32,
  },
  label: {
    color: white,
  },
  select: {
    color: white,
    alignItems: 'flex-end',
    height: 40,
  },
  item: {display: 'flex', justifyContent: 'space-between'},
};
