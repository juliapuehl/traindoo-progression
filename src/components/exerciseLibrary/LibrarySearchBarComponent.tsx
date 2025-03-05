import {Checkbox, FormControlLabel} from '@mui/material';
import {withStyles} from '@mui/styles';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {light_gray, primary_green} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {ExerciseLibraryType} from '../../traindoo_shared/types/ExerciseLibrary';
import BasicTextField from '../BasicTextField';
import {SearchBarAddButton} from '../SearchBarAddButton';
import {SearchBarEntry} from '../SearchBarEntry';

type Props = {
  initialValue?: string;
  library: ExerciseLibraryType;
  setSelectedExercise: (exercise: string) => void;
};

const checkBoxStyles = () => ({
  root: {
    '&$checked': {
      color: primary_green,
    },
  },
  checked: {},
});

export const LibrarySearchBar = (props: Props) => {
  const screenHeight = useWindowDimensions()?.height;
  const [searchText, setSearchText] = useState(
    props.initialValue ? props.initialValue : '',
  );
  const [showArchived, setShowArchived] = useState(false);

  const library = props.library;

  const searchEntries = library
    ? Object.values(library)
        .filter((element) => {
          if (
            element.name &&
            element.name?.toUpperCase().includes(searchText.toUpperCase())
          ) {
            if (showArchived) {
              return true;
            } else {
              return !element.archived;
            }
          } else {
            return false;
          }
        })
        .sort((a, b) => {
          if (a.archived && !b.archived) {
            return 1;
          } else if (!a.archived && b.archived) {
            return -1;
          } else {
            return a.name?.toLowerCase().localeCompare(b.name?.toLowerCase());
          }
        })
        .map((exercise, index) => {
          let name = exercise.name;
          if (exercise.archived) {
            name = t('LIBRARY_ENTRY_ARCHIVED_TITLE', {
              exercise_name: exercise.name,
            });
          }
          return (
            <SearchBarEntry
              key={name + index}
              title={name}
              onClick={() => {
                props.setSelectedExercise(exercise.name);
              }}
            />
          );
        })
    : [];

  const StyledCheckbox = withStyles(checkBoxStyles)(Checkbox);

  return (
    <div style={styles.container}>
      <SearchBarAddButton
        title={t('LIBRARY_SEARCH_ADD_BUTTON')}
        onCreate={(newName: string) => {
          props.setSelectedExercise(newName);
        }}
        style={styles.addButton}
        intercomTarget="library-add-exercise-button"
      />
      <BasicTextField
        label={t('LIBRARY_SEARCH_TITLE')}
        onChange={setSearchText}
        style={styles.searchBar}
      />
      <FormControlLabel
        control={
          <StyledCheckbox
            checked={showArchived}
            onChange={() => setShowArchived(!showArchived)}
          />
        }
        label={t('LIBRARY_SHOW_ARCHIVED_CHECKBOX')}
        style={styles.checkbox}
      />

      <div style={{...styles.results, ...{height: screenHeight - 180}}}>
        {searchEntries}
      </div>
    </div>
  );
};

type Style = {
  container: CSSProperties;
  entryStyle: CSSProperties;
  addButton: CSSProperties;
  results: CSSProperties;
  searchBar: CSSProperties;
  checkbox: CSSProperties;
};

const styles: Style = {
  container: {
    background: light_gray,
    width: 200,
    position: 'absolute',
  },
  entryStyle: {
    ...sharedStyle.textStyle.primary_white_capital,
    display: 'flex',
    flex: 1,
  },
  addButton: {
    width: '100%',
    height: 60,
  },
  results: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  searchBar: {marginBottom: 0},
  checkbox: {
    marginLeft: 4,
  },
};
