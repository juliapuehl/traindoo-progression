import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AthletesCardSection} from '../components/AthletesCardSection';
import {FilterSelector} from '../components/FilterSelector';
import {getAthleteIds} from '../logic/firestore';
import {resetAthleteTagFilter} from '../store/athleteSlice';

export const AthletesScreen = () => {
  const athleteIds = useSelector(getAthleteIds);
  const dispatch = useDispatch();
  const [filterText, setFilterText] = useState('');

  Intercom('update', {
    vertical_padding: 20,
  });

  useEffect(() => {
    dispatch(resetAthleteTagFilter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (athleteIds !== undefined) {
      const data = {
        hasAthletesInDashboard: athleteIds.length > 0,
      };
      Intercom('trackEvent', 'Athletes-Screen-Rendered', data);
    }
  }, [athleteIds]);

  return (
    <>
      <FilterSelector filterText={filterText} setFilterText={setFilterText} />

      <AthletesCardSection
        filterText={filterText}
        setFilterText={setFilterText}
      />
    </>
  );
};
