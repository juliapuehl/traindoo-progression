import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from '@mui/material';
import {CSSProperties, Fragment, useState} from 'react';
import {useSelector} from 'react-redux';
import {getCurrentAthlete} from '../../store/athleteSlice';
import {background_color_dark, dark_gray, white} from '../../styles/colors';
import {useInactivityTracking} from './model/useInactivityTracking';
import {ProgressionTableHead} from './ProgressionTableHead';
import {ProgressionTableValueRow} from './ProgressionTableValueRow';
import {ProgressionTableWeekdayRow} from './ProgressionTableWeekdayRow';

type Props = {
  progressionData: any;
  setAllAccepted: (value: boolean) => void;
  changeProgressionData: (index: number, newData: any) => void;
};

export const ProgressionTableComponent = (props: Props) => {
  useInactivityTracking();

  const currentAthleteData = useSelector(getCurrentAthlete);
  const [acceptAllClicked, setAcceptAllClicked] = useState<boolean>();
  const [acceptedProgressionData, setAcceptedProgressionData] = useState<any[]>(
    new Array(props.progressionData?.length).fill(false),
  );

  const isDayEqual = (currentDay, previousDay) => {
    if (previousDay) {
      if (currentDay === previousDay) {
        return true;
      } else {
        return false;
      }
      // if current day is first day = previous day is undefined
    } else {
      return false;
    }
  };

  const handleChangeAccepted = (index: number) => {
    acceptedProgressionData[index] = !acceptedProgressionData[index];
    setAcceptedProgressionData(acceptedProgressionData);
    const allTrue = acceptedProgressionData.every(
      (element) => element === true,
    );
    props.setAllAccepted(allTrue);
  };

  const acceptAll = () => {
    setAcceptedProgressionData(
      new Array(props.progressionData.length).fill(true),
    );
    props.setAllAccepted(true);
    setAcceptAllClicked(true);
  };

  const generateRows = () => {
    return props.progressionData?.map((row, index) => {
      const sameDay = isDayEqual(
        row.day,
        props.progressionData[index - 1]?.day ?? '',
      );
      return (
        <Fragment key={'ProgressionTableValueRow' + index}>
          {!sameDay ? <ProgressionTableWeekdayRow dayName={row.day} /> : null}
          {
            <ProgressionTableValueRow
              acceptAllBtnClicked={acceptAllClicked}
              index={index}
              progressionDataRow={row}
              setAccepted={() => handleChangeAccepted(index)}
              accepted={acceptedProgressionData[index]}
              changeProgressionData={(newData: any) =>
                props.changeProgressionData(index, newData)
              }
            />
          }
        </Fragment>
      );
    });
  };

  return (
    <Box style={styles.container}>
      <TableContainer component={Paper} style={styles.table}>
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <ProgressionTableHead
              progressionData={props.progressionData}
              onAcceptAllClicked={acceptAll}
              avatarUrl={currentAthleteData.athlete.profilePicture}
              athleteName={
                currentAthleteData.firstName + ' ' + currentAthleteData.lastName
              }
            ></ProgressionTableHead>
          </TableHead>
          <TableBody>{generateRows()}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

type Styles = {
  container: CSSProperties;
  text: CSSProperties;
  table: CSSProperties;
  dayRow: CSSProperties;
};

const styles: Styles = {
  container: {
    marginTop: 4,
    backgroundColor: background_color_dark,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 80,
    boxShadow: '0 1px 2px',
  },
  text: {
    color: white,
    paddingRight: 25,
  },
  table: {
    borderRadius: '0.5rem',
    maxHeight: 600,
    backgroundColor: dark_gray,
  },
  dayRow: {
    maxHeight: 20,
    padding: 16,
  },
};
