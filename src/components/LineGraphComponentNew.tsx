import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {graphColors} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  data: any;
  width: string | number;
  height: string | number;
  legend?: boolean;
  colorArray: Array<string>;
  dataNames: Array<string>;
};

export const LineGraphComponentNew = (props: Props) => {
  if (props.data && props.data[0]) {
    const dataNames = props.dataNames;
    return (
      <ResponsiveContainer width={props.width} height={props.height}>
        <LineChart
          data={props.data.map((element) => {
            return {...element, name: moment(element.name).format('L')};
          })}
          margin={{top: 8, bottom: 8}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Legend />
          {dataNames
            ? dataNames.map((key, index) => (
                <Line
                  key={'element.name' + index}
                  type="monotone"
                  dataKey={key}
                  stroke={props.colorArray[index] ?? graphColors[index]}
                  strokeWidth={1.5}
                  isAnimationActive={false}
                />
              ))
            : undefined}
        </LineChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <div
        style={{
          ...styles.container,
          ...{width: props.width, height: props.height},
          ...sharedStyle.textStyle.title2,
        }}
      >
        {t('DASHBOARD_CHECKKEYS_NODATA')}
      </div>
    );
  }
};

type Styles = {
  container: CSSProperties;
};

const styles: Styles = {
  container: {justifyContent: 'center', alignItems: 'center', display: 'flex'},
};
