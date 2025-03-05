import {Close} from '@mui/icons-material';
import {
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {t} from 'i18n-js';
import _ from 'lodash';
import {CSSProperties, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
import {getAthleteStates, getTrainerTags, getUserId} from '../logic/firestore';
import {getAthleteTagFilter, setAthleteTagFilter} from '../store/athleteSlice';
import {
  light_gray,
  primary_green,
  ultra_dark_gray,
  white,
} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {deleteAthleteTag} from '../utils/editingUserHelper';
import {getStandardTags} from '../utils/helper';
import {AddTagModal} from './AddTagModal';
import BasicTextField from './BasicTextField';
import IconWithTooltip from './IconWithTooltip';

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

type Props = {
  filterText: string;
  setFilterText: (text: string) => void;
};
export const FilterSelector = (props: Props) => {
  const classes = useStyles();

  const [openTagModal, setOpenTagModal] = useState(false);
  const trainerTags = useSelector(getTrainerTags);
  const checkedIndices = useSelector(getAthleteTagFilter);
  const userId = useSelector(getUserId);
  const athleteStates = useSelector(getAthleteStates);

  const firestore = useFirestore();

  const dispatch = useDispatch();
  const tagItems = trainerTags
    ? trainerTags.concat(Object.values(getStandardTags()))
    : Object.values(getStandardTags());
  const items = [t('TAG_SELECTOR_ADD'), t('ATHLETES_FILTER_SELECT_ALL')].concat(
    tagItems?.map((el) => el.title),
  );

  const handleCheck = (tagName: string) => {
    if (tagName === t('TAG_SELECTOR_ADD')) {
      setOpenTagModal(true);
      return;
    }
    const findIndex = checkedIndices?.indexOf(tagName);
    if (tagName === t('ATHLETES_FILTER_SELECT_ALL')) {
      if (!checkedIndices || !checkedIndices?.includes(tagName)) {
        dispatch(setAthleteTagFilter(items));
      } else {
        dispatch(setAthleteTagFilter([]));
      }
      return;
    }
    if (findIndex === undefined) {
      dispatch(setAthleteTagFilter([tagName]));
    } else if (findIndex === -1) {
      const newFilterArray = _.cloneDeep(checkedIndices);
      newFilterArray.push(tagName);
      dispatch(setAthleteTagFilter(newFilterArray));
    } else {
      const newFilterArray = checkedIndices.filter(
        (element) => element !== tagName,
      );
      dispatch(setAthleteTagFilter(newFilterArray));
    }
  };

  const activeTags = tagItems?.filter((element) =>
    checkedIndices?.includes(element.title),
  );

  const handleDelete = (index) => {
    // Minus two because of SELECT ALL and TAG_SELECTOR_ADD
    if (index > 0) {
      const deleteTag = Object.values(trainerTags)[index - 2];
      if (deleteTag) {
        if (deleteTag !== undefined) {
          deleteAthleteTag(deleteTag, userId, athleteStates, firestore);
        }
      }
    }
  };

  const handleFilterText = (text: string) => {
    if (text === '') props.setFilterText(undefined);
    props.setFilterText(text);
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterContainer}>
        <FormControl fullWidth style={styles.form} margin="dense">
          <InputLabel className={classes.label} id="demo-simple-select-label">
            {t('ATHLETES_FILTER_TITLE')}
          </InputLabel>

          <Select
            variant="filled"
            fullWidth
            className={classes.select}
            inputProps={{
              classes: {
                icon: classes.icon,
                root: classes.root,
              },
            }}
            value={[]}
            multiple
            style={styles.select}
            MenuProps={{
              classes: {paper: classes.menu},
            }}
          >
            {items.map((item, index) => (
              <div style={styles.item} key={'filter' + uuidv4()}>
                <MenuItem
                  value={item}
                  className={classes.menuItem}
                  onClick={() => handleCheck(item)}
                >
                  {index > 0 && (
                    <Checkbox
                      key={'checkbox' + index}
                      checked={
                        checkedIndices ? checkedIndices?.includes(item) : false
                      }
                    />
                  )}
                  <ListItemText key={'ListItemText' + index} primary={item} />
                </MenuItem>
                {index > 1 && index < items.length - 4 && (
                  <IconWithTooltip
                    description={t('ATHLETES_FILTER_DELETE')}
                    key={'IconWithTooltip' + index}
                    muiIcon={Close}
                    onClick={() => handleDelete(index)}
                  />
                )}
              </div>
            ))}
          </Select>
        </FormControl>
        <BasicTextField
          style={styles.textField}
          label={t('ATHLETES_FILTER_TEXT')}
          value={props.filterText}
          onChange={handleFilterText}
        />
      </div>

      <Grid style={styles.tagContainer}>
        {activeTags?.map((element, index) => (
          <Chip
            key={'tag' + index}
            label={element.title}
            variant="outlined"
            style={{...styles.tag}}
            onDelete={() => {
              handleCheck(element.title);
            }}
            sx={{
              ...sharedStyle.textStyle.primary_white_capital,
              ...element.style,
            }}
          />
        ))}
      </Grid>
      <AddTagModal
        open={openTagModal}
        handleClose={() => setOpenTagModal(false)}
      />
    </div>
  );
};

type Styles = {
  form: CSSProperties;
  tag: CSSProperties;
  select: CSSProperties;
  tagContainer: CSSProperties;
  container: CSSProperties;
  item: CSSProperties;
  textField: CSSProperties;
  filterContainer: CSSProperties;
};

const styles: Styles = {
  form: {
    width: 380,
  },
  select: {
    color: white,
    alignItems: 'flex-end',
    height: 40,
  },
  tag: {
    color: white,
    marginBottom: 4,
    borderWidth: 0,
    marginLeft: 2,
    marginRight: 2,
  },
  tagContainer: {
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
  },
  container: {
    alignItems: 'center',
    margin: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {display: 'flex', justifyContent: 'space-between'},
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    width: '100%',
    flexWrap: 'wrap',
    gap: 8,
  },
  textField: {
    marginTop: 8,
    maxWidth: 400,
  },
};
