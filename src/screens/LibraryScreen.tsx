import {CSSProperties} from 'react';
import {Outlet} from 'react-router-dom';
import LibraryCategorySelector from '../components/exerciseLibrary/LibraryCategorySelector';

export const LibraryScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  return (
    <div style={styles.container}>
      <LibraryCategorySelector />
      <Outlet />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  contentContainer: CSSProperties;
};

const styles: Styles = {
  container: {display: 'flex', flexDirection: 'column'},
  contentContainer: {
    marginLeft: 216,
    marginRight: 16,
    marginTop: 16,
    flex: 1,
    borderRadius: 10,
    overflow: 'auto',
  },
};
