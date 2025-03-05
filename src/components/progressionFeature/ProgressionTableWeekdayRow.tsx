import {TableCell, TableRow, Typography} from '@mui/material';
import {ultra_light_gray} from '../../styles/colors';

type Props = {
  dayName: string;
};

export const ProgressionTableWeekdayRow = (props: Props) => {
  return (
    <>
      <TableRow
        key={props.dayName}
        sx={{
          height: 20,
        }}
      >
        <TableCell
          sx={{
            borderBottom: 0,
          }}
        >
          <Typography
            fontWeight={'bold'}
            textTransform={'uppercase'}
            color={ultra_light_gray}
          >
            {props.dayName}
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
};
