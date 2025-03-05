import {CSSProperties, useState} from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {LibraryEntryComponent} from './LibraryEntryComponent';
import {LibrarySearchBar} from './LibrarySearchBarComponent';
import {useExerciseLibraryDataConnect} from './model/useExerciseLibraryDataConnect';

export const ExerciseLibraryComponent = () => {
  const library = useExerciseLibraryDataConnect();
  const screenHeight = useWindowDimensions()?.height;
  const [exerciseName, setExerciseName] = useState('');
  return (
    <div style={styles.container}>
      <LibrarySearchBar
        library={library}
        initialValue={exerciseName}
        setSelectedExercise={(key) => setExerciseName(key)}
      />
      <div style={{...styles.contentContainer, ...{height: screenHeight - 80}}}>
        <LibraryEntryComponent
          exerciseName={exerciseName}
          changeSelectedExercise={setExerciseName}
        />
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  contentContainer: CSSProperties;
};

const styles: Styles = {
  container: {display: 'flex', flexDirection: 'row'},
  contentContainer: {
    marginLeft: 216,
    marginRight: 16,
    marginTop: 16,
    flex: 1,
    borderRadius: 10,
    overflow: 'auto',
  },
};
