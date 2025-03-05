import {Delete, Edit} from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {getDashboardCategoryName} from '../utils/DefaultDashboardLayout';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  startDate: string;
  endDate: string;
  name: string;
  editable: boolean;
  setEditable: (editable: boolean) => void;
  removeElement: () => void;
};

export const DashboardElementHeadline = (props: Props) => {
  const {startDate, endDate, removeElement, name, editable, setEditable} =
    props;

  const changeEditable = () => {
    setEditable(!editable);
  };
  return (
    <div style={styles.headline}>
      {startDate ? (
        <div style={styles.timeSpan}>
          {startDate !== ''
            ? moment(startDate).format('L').slice(0, 6) +
              moment(startDate).format('YY')
            : t('DASHBOARD_TIMEPERIOD_BEGINNING')}
          {' - '}
          {endDate !== ''
            ? moment(endDate).format('L').slice(0, 6) +
              moment(endDate).format('YY')
            : t('DASHBOARD_TIMEPERIOD_TODAY')}
        </div>
      ) : (
        <div style={styles.timeSpan}>{t('DASHBOARD_TIMEPERIOD_ALLTIME')}</div>
      )}
      {!editable && (
        <div style={styles.name}>{getDashboardCategoryName(name)}</div>
      )}
      <div style={styles.icons}>
        <IconWithTooltip
          muiIcon={editable ? CheckIcon : Edit}
          style={styles.icon}
          onClick={changeEditable}
          description={
            editable
              ? t('DASHBOARD_ELEMENT_CONFIRM')
              : t('DASHBOARD_ELEMENT_EDIT')
          }
        />

        <IconWithTooltip
          muiIcon={Delete}
          style={styles.icon}
          onClick={removeElement}
          description={t('DASHBOARD_ELEMENT_DELETE')}
          intercomTarget="dashboard-delete-button"
        />
      </div>
    </div>
  );
};

type Styles = {
  headline: CSSProperties;
  icons: CSSProperties;
  icon: CSSProperties;
  timeSpan: CSSProperties;
  name: CSSProperties;
};

const styles: Styles = {
  headline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: white,
  },
  timeSpan: {
    ...sharedStyle.textStyle.title2,
  },
  icons: {display: 'flex', flexDirection: 'row'},
  icon: {marginLeft: 16, color: white},
  name: {...sharedStyle.textStyle.title1},
};
