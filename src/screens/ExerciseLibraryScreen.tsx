import {ExerciseLibraryComponent} from '../components/exerciseLibrary/ExerciseLibraryComponent';

export const ExerciseLibraryScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  return <ExerciseLibraryComponent />;
};
