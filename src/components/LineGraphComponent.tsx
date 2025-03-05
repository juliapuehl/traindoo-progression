import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import regression from 'regression';
import {primary_green} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  data: any;
  dataNames: string[];
  width: string | number;
  height: string | number;
  legend?: boolean;
};

export const LineGraphComponent = (props: Props) => {
  let firstRegressionPoint;
  let secondRegressionPoint;
  if (props.data && props.data[0]) {
    const valueName = Object.keys(props.data[0])[1];
    const regressionData = props.data.map((element, index) => [
      index,
      parseFloat(element[valueName]),
    ]);
    const regressionResult = regression.linear(regressionData);
    firstRegressionPoint = regressionResult.predict(regressionData[0][0]);
    secondRegressionPoint = regressionResult.predict(
      regressionData[regressionData.length - 1][0],
    );
  }
  const minRegression =
    firstRegressionPoint && secondRegressionPoint
      ? Math.min(...[firstRegressionPoint[1], secondRegressionPoint[1]])
      : undefined;
  const maxRegression =
    firstRegressionPoint && secondRegressionPoint
      ? Math.max(...[firstRegressionPoint[1], secondRegressionPoint[1]])
      : undefined;
  if (props.data && props.data[0]) {
    return (
      <ResponsiveContainer width={props.width} height={props.height}>
        <LineChart data={props.data} margin={{top: 8, bottom: 8}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value: number): string => {
              const hasDecimals = value % 1 > 0;
              if (Math.abs(value) >= 1000) {
                // cut off irrelevant decimals to save space
                return value.toFixed(0);
              } else if (hasDecimals) {
                if (Math.abs(value) < 10) {
                  // small number --> plenty of space to show some decimals
                  return value.toFixed(2);
                } else {
                  return value.toFixed(1);
                }
              }
              // use toString(), since it doesn't print decimal point for whole numbers
              return value.toString();
            }}
            type="number"
            domain={[
              (dataMin) =>
                firstRegressionPoint && dataMin > minRegression
                  ? minRegression
                  : dataMin,
              (dataMax) =>
                secondRegressionPoint && dataMax < maxRegression
                  ? maxRegression
                  : dataMax,
            ]}
          />
          <Tooltip />
          {props.legend && <Legend />}

          {props.dataNames.map((name) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={primary_green}
              strokeWidth={1.5}
            />
          ))}
          {firstRegressionPoint && (
            <ReferenceLine
              stroke={'yellow'}
              strokeDasharray="20 10"
              strokeWidth={1.5}
              segment={[
                // {x: props.data[0].name, y: 1200},
                // {
                //   x: props.data[props.data.length - 1].name,
                //   y: 2000,
                // },
                {x: props.data[0].name, y: firstRegressionPoint[1]},
                {
                  x: props.data[props.data.length - 1].name,
                  y: secondRegressionPoint[1],
                },
              ]}
            />
          )}
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
        {t('PLANNING_GRAPH_NO_VALUES')}
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
