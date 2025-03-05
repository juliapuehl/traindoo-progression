import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {getAthleteStates, getTrainerCode} from '../logic/firestore';
import {
  getAllAthletes,
  getAthleteTagFilter,
  getCurrentAthleteId,
  setCurrentAthleteId,
} from '../store/athleteSlice';
import {
  setIndexSelectedCycle,
  setSelectedTrainingIndex,
} from '../store/trainingSlice';
import {white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {AthleteActiveState, UserType} from '../traindoo_shared/types/User';
import {getAthleteStandardTag} from '../utils/helper';
import AthleteCard from './AthleteCard';
import {FullScreenLoading} from './FullScreenLoading';

type Props = {
  filterText: string;
  setFilterText: (text: string) => void;
};

export const AthletesCardSection = (props: Props) => {
  const athleteData = useSelector(getAllAthletes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const athleteStates = useSelector(getAthleteStates);
  const tagFilter = useSelector(getAthleteTagFilter);
  const trainerCode = useSelector(getTrainerCode);
  const selectedAthleteId = useSelector(getCurrentAthleteId);

  const onCardClick = (athlete: UserType) => {
    return (cycle?: number) => {
      if (selectedAthleteId !== athlete?.id) {
        dispatch(setCurrentAthleteId(athlete?.id));
        dispatch(setIndexSelectedCycle(cycle ? cycle : athlete.currentCycle));
        dispatch(setSelectedTrainingIndex(athlete.currentWeek));
      }

      navigate('/trainings');
    };
  };

  const getAthleteTags = (athlete: UserType) => {
    let athleteTags =
      athleteStates && athleteStates[athlete?.id]?.tags
        ? athleteStates[athlete.id]?.tags
        : [];
    athleteTags = athleteTags
      ? [getAthleteStandardTag(athlete.planningStartDate)].concat(athleteTags)
      : [getAthleteStandardTag(athlete.planningStartDate)];
    return athleteTags;
  };

  const getDisplayCard = (athlete: UserType) => {
    const athleteTags = getAthleteTags(athlete);
    if (tagFilter && tagFilter.length > 0 && athleteTags) {
      const intersection = athleteTags.filter((element) =>
        tagFilter.includes(element.title),
      );
      if (intersection.length === 0) {
        return {filteredCard: false, athleteTags};
      }
    }
    return {filteredCard: true, athleteTags};
  };

  const generateCards = (
    localAthleteData: {state: AthleteActiveState; data: UserType}[],
  ) => {
    const filteredCards = [];
    const unfilteredCards = [];
    const inactiveAthletes = [];
    const pendingAthletes = [];
    localAthleteData.forEach((athleteObject) => {
      const athlete = athleteObject.data;
      if (!athlete) return;
      if (
        props.filterText &&
        !(athlete.firstName + athlete.lastName)
          .toLowerCase()
          .includes(props.filterText.toLowerCase())
      )
        return;
      const athleteState = athleteObject.state ?? 'pending';
      const athleteInactive = athleteState !== 'active';
      const onClick = onCardClick(athlete);
      const {filteredCard, athleteTags} = getDisplayCard(athlete);

      const activeStyle =
        filteredCard && !athleteInactive ? {} : {opacity: 0.6};
      const card = (
        <AthleteCard
          showTags
          key={athlete?.id}
          onClick={(cycle) => onClick(cycle)}
          style={{...styles.cardStyle, ...activeStyle}}
          withCyclePopover={
            moment(athlete.dateRegistered).isAfter(1640809266516) &&
            !athlete.athlete?.registrationFlags?.currentCycleSetByTrainer
          }
          athleteState={athleteState}
          athlete={athlete}
          athleteTags={athleteTags}
        />
      );
      if (athleteState !== 'noTrainer') {
        if (athleteState === 'pending') {
          pendingAthletes.push(card);
        } else if (athleteInactive) {
          inactiveAthletes.push(card);
        } else {
          if (filteredCard) {
            filteredCards.push(card);
          } else {
            unfilteredCards.push(card);
          }
        }
      }
    });

    return {filteredCards, unfilteredCards, inactiveAthletes, pendingAthletes};
  };

  if (athleteData === undefined) {
    return <FullScreenLoading />;
  } else if (athleteData && athleteData?.length > 0) {
    const {filteredCards, unfilteredCards, inactiveAthletes, pendingAthletes} =
      generateCards(athleteData);
    return (
      <>
        {pendingAthletes.length > 0 && (
          <div style={{...sharedStyle.textStyle.title2, ...styles.title}}>
            {t('ATHLETE_PENDING_TITLE')}
          </div>
        )}
        <div style={styles.list}>{pendingAthletes}</div>
        {pendingAthletes.length > 0 && <div style={styles.separatorInactive} />}
        <div style={{...sharedStyle.textStyle.title2, ...styles.title}}>
          {t('ATHLETE_ACTIVE_TITLE')}
        </div>
        <div style={styles.list}>{filteredCards}</div>
        {unfilteredCards.length > 0 && <div style={styles.separator} />}
        <div style={styles.list}>{unfilteredCards}</div>
        {inactiveAthletes.length > 0 && (
          <>
            <div style={styles.separatorInactive} />
            <div style={{...sharedStyle.textStyle.title2, ...styles.title}}>
              {t('ATHLETE_INACTIVE_TITLE')}
            </div>
          </>
        )}
        <div style={styles.list}>{inactiveAthletes}</div>
      </>
    );
  } else {
    return (
      <div style={styles.textContainer}>
        <div style={{...sharedStyle.textStyle.title1, ...styles.text}}>
          {t('ATHLETES_DASHBOARD_WELCOME')}
        </div>
        <div style={{...sharedStyle.textStyle.regular, ...styles.text}}>
          {t('ATHLETES_DASHBOARD_NO_TRAINER')}
        </div>
        <div
          style={{
            ...sharedStyle.textStyle.primary_white_capital,
            ...styles.text,
          }}
          className="trainerCode"
          data-intercom-target="trainerCode"
        >
          {t('ATHLETES_DASHBOARD_CODE') + ' ' + trainerCode}
        </div>
      </div>
    );
  }
};

type Styles = {
  list: CSSProperties;
  cardStyle: CSSProperties;
  text: CSSProperties;
  textContainer: CSSProperties;
  separator: CSSProperties;
  container: CSSProperties;
  title: CSSProperties;
  separatorInactive: CSSProperties;
};

const styles: Styles = {
  list: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: 8,
    margin: 16,
  },
  cardStyle: {
    marginRight: 8,
    marginLeft: 8,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
  },
  text: {
    maxWidth: 650,
  },
  separator: {
    height: 1,
    border: 0,
    borderBottom: 2,
    borderStyle: 'dashed',
    borderColor: white,
    opacity: 0.6,
    margin: 32,
  },
  separatorInactive: {
    height: 1,
    border: 0,
    borderBottom: 2,
    borderStyle: 'dashed',
    borderColor: white,
    marginLeft: 32,
    marginRight: 32,
    marginTop: 32,
    marginBottom: 16,
  },
  container: {
    marginTop: 32,
  },
  title: {
    marginLeft: 32,
  },
};
