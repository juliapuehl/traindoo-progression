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

export const DashboardElementTextCards = (props: Props) => {
  const {data, questionId, categoryId, startDate, endDate} = props;
  const translateQuestion = useCheckTranslateQuestion();
  const question = translateQuestion(categoryId, questionId);
  return (
    <div style={styles.container}>
      <div style={styles.question}>{question.name}</div>
      <div style={styles.cardContainer}>
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
              <div style={styles.card} key={entry.name}>
                <div style={styles.dateCentered}>
                  {moment(entry.name).format('dd, L').slice(0, 9)}
                </div>
                <div style={styles.answer}>{entry[questionId]}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  question: CSSProperties;
  card: CSSProperties;
  dateCentered: CSSProperties;
  answer: CSSProperties;
  cardContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {display: 'flex', flexDirection: 'row', flex: 2},
  question: {
    ...sharedStyle.textStyle.title2,
    marginBottom: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'white',
    padding: 7,
    margin: 5,
  },
  dateCentered: {
    marginBottom: 5,
    ...sharedStyle.textStyle.title2,
  },
  answer: {
    alignSelf: 'center',
    ...sharedStyle.textStyle.title1,
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};
