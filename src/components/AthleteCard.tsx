import {Settings} from '@mui/icons-material';
import {CardActions, Chip, Grid} from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../logic/firestore';
import {dark_gray, ultra_light_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {
  AthleteActiveState,
  AthleteTagType,
  UserType,
} from '../traindoo_shared/types/User';
import {setAthleteTotalCycles} from '../utils/editingAthleteHelper';
import {deleteTagFromAthlete} from '../utils/editingUserHelper';
import {getWeekdayForIndex} from '../utils/helper';
import {AthleteStateSettingsPopover} from './AthleteStateSettingsPopover';
import Avatar from './Avatar';
import IconWithTooltip from './IconWithTooltip';
import {InactiveAthletePopover} from './InactiveAthletePopover';
import {NewAthletePopover} from './NewAthletePopover';
import {PendingAthletePopover} from './PendingAthletePopover';

type Props = {
  showTags?: boolean;
  onClick?: (_?: number) => void;
  style?: CSSProperties;
  withCyclePopover?: boolean;
  athlete: UserType;
  athleteState: AthleteActiveState;
  athleteTags?: AthleteTagType[];
};

const AthleteCard = (props: Props) => {
  const {
    id,
    planningStartDate,
    firstName,
    lastName,
    currentCycle,
    currentWeek,
    startDayInWeek,
  } = props.athlete;
  const athleteTags = props.athleteTags ?? [];
  const athleteId = id;
  const avatarUrl = props.athlete?.athlete.profilePicture;
  const competitionDate = props.athlete?.athlete.competitionDate;
  const fullName = firstName + ' ' + lastName;
  const firestore = useFirestore();
  const [openCyclePopover, setOpenCyclePopover] = useState(false);
  const [athleteStateOpen, setAthleteStateOpen] = useState(false);
  const [openInactivePopover, setOpenInactivePopover] = useState(false);
  const [openPendingPopover, setOpenPendingPopover] = useState(false);
  const userId = useSelector(getUserId);

  const setCycleConfirm = (cycle: number) => {
    setOpenCyclePopover(false);
    setAthleteTotalCycles(athleteId, cycle, firestore);
    props.onClick(cycle);
  };
  const athletePending = props.athleteState === 'pending';
  const athleteInactive = props.athleteState !== 'active';

  const trainingEndDate = moment(planningStartDate)
    .add(6, 'days')
    .startOf('day');

  const handleTagDelete = (tag: AthleteTagType) => {
    deleteTagFromAthlete(tag, userId, athleteId, firestore);
  };

  const handleOnClick = () => {
    if (athletePending) {
      setOpenPendingPopover(true);
    } else if (athleteInactive) {
      setOpenInactivePopover(true);
    } else if (props.withCyclePopover) {
      setOpenCyclePopover(!openCyclePopover);
    } else {
      props.onClick();
    }
  };

  return (
    <div
      style={{
        ...props.style,
        ...styles.root,
        ...{height: 'inherit', backgroundColor: 'red'},
      }}
    >
      <Card style={styles.container}>
        <CardActionArea onClick={handleOnClick}>
          <CardContent>
            <div style={styles.card}>
              <Avatar src={avatarUrl} />
              <div style={styles.cardTextArea}>
                <span style={sharedStyle.textStyle.primary_white_capital}>
                  {fullName}
                </span>
                <span style={styles.content}>
                  {t('ATHLETES_CARD_INFO', {
                    current_cycle: currentCycle ? currentCycle : '-',
                    current_week: currentWeek ? currentWeek : '-',
                    start_day: getWeekdayForIndex(startDayInWeek),
                  })}
                </span>
                {athleteInactive ? (
                  <></>
                ) : (
                  <>
                    {competitionDate &&
                      moment(competitionDate).isSameOrAfter(
                        moment(),
                        'day',
                      ) && (
                        <span style={styles.content}>
                          {t('ATHLETES_NEXT_COMPETITION_DATE', {
                            date: moment(competitionDate).format('L'),
                          })}
                        </span>
                      )}
                    <span style={styles.content}>
                      {planningStartDate
                        ? t('ATHLETES_END_LAST_PLAN', {
                            date: moment(trainingEndDate).format('L'),
                          })
                        : t('ATHLETES_END_LAST_PLAN_UNDEFINED')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </CardActionArea>
        {!athleteInactive && props.showTags && (
          <CardActions>
            <Grid style={styles.tagContainer}>
              {athleteTags?.map((element, index) => (
                <Chip
                  key={'tag' + index + ' ' + athleteId}
                  label={element.title}
                  onDelete={
                    index > 0 ? () => handleTagDelete(element) : undefined
                  }
                  variant="outlined"
                  style={{...styles.tag}}
                  sx={{
                    ...sharedStyle.textStyle.primary_white_capital,
                    ...element.style,
                  }}
                />
              ))}
            </Grid>
          </CardActions>
        )}
      </Card>
      <NewAthletePopover
        confirm={(value) => setCycleConfirm(value)}
        athleteUserId={athleteId}
        handleClose={() => {
          setOpenCyclePopover(false);
        }}
        open={openCyclePopover}
      />
      <InactiveAthletePopover
        athleteUserId={athleteId}
        handleClose={() => {
          setOpenInactivePopover(false);
        }}
        open={openInactivePopover}
      />
      <PendingAthletePopover
        athleteUserId={athleteId}
        handleClose={() => {
          setOpenPendingPopover(false);
        }}
        open={openPendingPopover}
      />
      <AthleteStateSettingsPopover
        handleClose={() => {
          setAthleteStateOpen(false);
        }}
        open={athleteStateOpen}
        athleteUserId={athleteId}
      />
      {props.showTags && !athleteInactive && (
        <IconWithTooltip
          onClick={() => {
            setAthleteStateOpen(true);
          }}
          muiIcon={Settings}
          active={false}
          style={styles.icon}
          description={t('ATHLETES_CARD_STATE_ICON')}
        />
      )}
    </div>
  );
};

type Styles = {
  root: CSSProperties;
  content: CSSProperties;
  card: CSSProperties;
  cardTextArea: CSSProperties;
  icon: CSSProperties;
  container: CSSProperties;
  label: CSSProperties;
  tagContainer: CSSProperties;
  tag: CSSProperties;
};

const styles: Styles = {
  label: {color: white, marginBottom: 4},
  tag: {color: white, marginBottom: 4, borderWidth: 0},
  tagContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  root: {
    width: 380,
    borderRadius: 8,
    overflow: 'visible',
    position: 'relative',
  },
  content: {
    marginTop: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextArea: {
    marginLeft: 8,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
    padding: 0,
    right: 8,
    top: 8,
    color: 'white',
  },
  container: {
    flexGrow: 1,
    color: ultra_light_gray,
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 8,
    height: '100%',
  },
};

export default AthleteCard;
