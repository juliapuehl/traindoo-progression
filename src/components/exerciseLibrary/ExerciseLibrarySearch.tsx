//@ts-nocheck
import {Autocomplete, TextField} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getExerciseLibrary} from '../../store/reduxFirestoreLibraryGetter';
import {light_gray} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {LibraryAddModal} from './LibraryAddModal';

type Props = {
  exerciseName?: string;
  handleChange?: (value: string) => void;
  handleRename?: (value: string) => void;
  changeSelectedExercise?: (value: string) => void;
  style?: CSSProperties;
  textFieldStyle?: CSSProperties;
  intercomTarget?: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    menuItem: {
      padding: 8,
      ...sharedStyle.textStyle.title1,

      '&:hover': {
        borderRadius: 10,
        backgroundColor: light_gray,
      },
    },
  }),
);

export const ExerciseLibrarySearch = (props: Props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [value, setValue] = useState<string>(
    props.exerciseName ? props.exerciseName : '',
  );

  useEffect(() => {
    if (value !== props.exerciseName) {
      setValue(props.exerciseName ? props.exerciseName : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.exerciseName]);

  const library = useSelector(getExerciseLibrary);

  const searchStrings = library
    ? [
        t('LIBRARY_ADD_EXERCISE_BUTTON'),
        ...Object.values(library)
          .sort((a, b) =>
            a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
          )
          .filter((entry) => {
            if (entry?.archived) {
              return false;
            }
            return entry?.name !== props.exerciseName;
          })
          .map((entry) => entry?.name),
      ]
    : [t('LIBRARY_ADD_EXERCISE_BUTTON')];

  const handleChange = (newName: string) => {
    if (newName === t('LIBRARY_ADD_EXERCISE_BUTTON')) {
      setOpen(true);
    } else {
      setValue(newName);

      if (searchStrings.includes(newName)) {
        if (newName !== props.exerciseName) {
          props.handleChange(newName.trim());
        }
      } else {
        setOpen(true);
      }
    }
  };

  const handleRename = (newName: string) => {
    if (newName !== props.exerciseName) {
      props.handleRename(newName.trim());
    }
  };

  return (
    <>
      <Autocomplete
        isOptionEqualToValue={() => true}
        style={props.style}
        disableClearable
        popupIcon={''}
        value={value ? value : props.exerciseName ? props.exerciseName : ''}
        options={searchStrings}
        onChange={(event, newValue) => handleChange(newValue)}
        renderInput={(params) => (
          <TextField
            style={props.textFieldStyle}
            multiline
            {...params}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              classes: {
                input: classes.menuItem,
              },
            }}
            className={classes.menuItem + ' ' + props.intercomTarget}
            data-intercom-target={props.intercomTarget}
            placeholder={t('LIBRARY_SEARCH_PLACEHOLDER')}
          />
        )}
      />
      <LibraryAddModal
        handleClose={() => setOpen(false)}
        open={open}
        handleRename={handleRename}
        setNewExercise={(newName: string) =>
          props.changeSelectedExercise(newName)
        }
      />
    </>
  );
};
