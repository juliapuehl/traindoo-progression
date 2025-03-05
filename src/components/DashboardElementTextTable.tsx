import moment from 'moment';
import {CSSProperties} from 'react';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  data: any;
  questionId: string;
  categoryId: string;
  startDate: string;
  endDate: string;
};

export const DashboardElementTextTable = (props: Props) => {
  const {data, questionId, categoryId, startDate, endDate} = props;
  const translateQuestion = useCheckTranslateQuestion();
  const question = translateQuestion(categoryId, questionId);
  const isButtonSurvey = question.type === 'buttonSurvey';

  return (
    <div style={styles.container}>
      <div style={styles.question}>{question.name}</div>
      <table>
        <tbody>
          {data
            ?.filter(
              (element) =>
                (endDate === '' ||
                  moment(element.name).isSameOrBefore(moment(endDate))) &&
                (startDate === '' ||
                  moment(element.name).isSameOrAfter(moment(startDate))) &&
                element[questionId] !== '' &&
                element[questionId] !== undefined,
            )
            .sort((a, b) => moment(b.name).diff(moment(a.name)))
            .map((entry) => {
              return (
                <tr style={styles.innerContainer} key={entry.name}>
                  <th style={styles.date}>
                    {moment(entry.name).format('dd, L').slice(0, 9)}
                  </th>
                  <th style={sharedStyle.textStyle.title2}>
                    {isButtonSurvey
                      ? question?.answers[entry[questionId]] ?? '-'
                      : entry[questionId]}
                  </th>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  question: CSSProperties;
  date: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {textAlign: 'left'},
  question: {
    ...sharedStyle.textStyle.title2,
    marginBottom: 10,
  },
  date: {
    width: 100,
    marginRight: 10,
    marginBottom: 5,
    ...sharedStyle.textStyle.title2,
  },
};
