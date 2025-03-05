import {TrendingDown, TrendingFlat, TrendingUp} from '@mui/icons-material';
import {Typography} from '@mui/material';
import {white} from '../styles/colors';

type Props = {
  //difference bt trained and instructed load
  trend: number;
};

export const ProgressionTrendLabel = (props: Props) => {
  return (
    <div>
      {props.trend > 0 ? (
        <>
          <TrendingUp
            sx={{color: 'rgba(1, 192, 140)', fontSize: 35}}
          ></TrendingUp>
          <Typography
            color={'rgba(1, 192, 140)'}
            fontSize={16}
            fontWeight={800}
          >
            {props.trend}
          </Typography>
        </>
      ) : props.trend < 0 ? (
        <>
          <TrendingDown
            sx={{color: 'rgba(252, 99, 61)', fontSize: 35}}
          ></TrendingDown>
          <Typography
            color={'rgba(252, 99, 61)'}
            fontSize={16}
            fontWeight={800}
          >
            {props.trend}
          </Typography>
        </>
      ) : (
        <>
          <TrendingFlat sx={{color: white, fontSize: 35}}></TrendingFlat>
          <Typography color={white} fontSize={16} fontWeight={800}>
            {props.trend}
          </Typography>
        </>
      )}
    </div>
  );
};
