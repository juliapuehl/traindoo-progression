import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId, webSettingsLayoutQuery} from '../logic/firestore';
import {getDashboardCategoryName} from '../utils/DefaultDashboardLayout';
import BasicTextField from './BasicTextField';
import {DashboardTimeFramePicker} from './DashboardTimeFramePicker';
import {KeyWordDropdown} from './KeyWordDropdown';
import {QuestionKeyDropdown} from './QuestionKeyDropdown';

type Props = {
  startDate: string;
  endDate: string;
  elementKey: string;
  timeFrame: string;
  checkKeys?: Array<{categoryId: string; questionId: string}>;
  questionId?: string;
  editable: boolean;
  name: string;
  type: string;
};

export const DashboardElementValueControl = (props: Props) => {
  const {
    startDate,
    endDate,
    elementKey,
    timeFrame,
    checkKeys,
    editable,
    name,
    questionId,
    type,
  } = props;
  const [elementName, setElementName] = useState(
    getDashboardCategoryName(name),
  );
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const handleNameChange = (newText: string) => {
    if (newText.length > 40) {
      return;
    }
    setElementName(newText);
  };
  const setNewName = () => {
    if (elementName !== getDashboardCategoryName(name)) {
      firestore.update(webSettingsLayoutQuery(userId), {
        ['dailyCheckLayout.elements.' + elementKey + '.name']: elementName,
      });
    }
  };
  return editable ? (
    <div style={styles.container}>
      <BasicTextField
        style={styles.nameField}
        label={t('DASHBOARD_ELEMENT_NAME')}
        onChange={handleNameChange}
        onBlur={setNewName}
        value={elementName}
      />
      {(type === 'graph' || type === 'table' || type === 'media') && (
        <KeyWordDropdown
          checkKeys={checkKeys}
          currentGraphKey={elementKey}
          type={type}
        />
      )}
      {type === 'text' && (
        <QuestionKeyDropdown
          currentGraphKey={elementKey}
          questionKey={questionId}
        />
      )}
      <DashboardTimeFramePicker
        startDate={startDate}
        endDate={endDate}
        elementKey={elementKey}
        timeFrame={timeFrame}
      />
    </div>
  ) : (
    <></>
  );
};

type Styles = {
  nameField: CSSProperties;
  container: CSSProperties;
};

const styles: Styles = {
  nameField: {
    width: 300,
    marginBottom: 4,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'end',
    justifyContent: 'space-between',
  },
};
