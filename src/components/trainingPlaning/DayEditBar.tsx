import {
  ContentCopy,
  ContentPaste,
  Delete,
  LibraryAdd,
} from '@mui/icons-material/';
import {Alert} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {SessionNote} from '../../atoms/exercise_planning/SessionNote';
import {
  dark_gray,
  light_gray,
  primary_green,
  ultra_light_gray,
} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {AlertPopover} from '../AlertPopover';
import FillFromTemplate from '../FillFromTemplate';
import IconWithTooltip from '../IconWithTooltip';
import SessionInfoText from '../SessionInfoText';
import {useDayCopyConnect} from './model/day/useDayCopyConnect';
import {useDayDeleteConnect} from './model/day/useDayDeleteConnect';
import {useDayNameConnect} from './model/day/useDayNameConnect';
import {useDayPasteConnect} from './model/day/useDayPasteConnect';
import {useDayTemplateConnect} from './model/day/useDayTemplateConnect';

type Props = {
  hisData?: boolean;
  intercomTarget?: string;
};

export const DayEditBar = (props: Props) => {
  const {showInsert, dayIsCopied, insertCopy, copyName} = useDayPasteConnect();
  const copyDay = useDayCopyConnect();
  const deleteDay = useDayDeleteConnect();

  const {
    deleteTemplate,
    templateOverview,
    createTemplate,
    createTemplateLoading,
    pasteTemplate,
    pasteTemplateLoading,
  } = useDayTemplateConnect();
  const {firestoreDayName, saveDayName} = useDayNameConnect();
  const [dayName, setDayName] = useState(firestoreDayName);
  const [focusTextfield, setFocusTextfield] = useState(false);
  const [templateAdded, setTemplateAdded] = useState(false);
  const [showAlert, setShowAlert] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    setTemplateAdded(false);
    setDayName(firestoreDayName ?? '');
  }, [firestoreDayName]);

  const handleOnBlurDayName = (value: string) => {
    if (firestoreDayName !== value) {
      setTemplateAdded(false);
      saveDayName(value);
    }
  };

  const handleAddTemplate = () => {
    if (templateOverview?.find((template) => template.name === dayName)) {
      setShowAlert(t('PLANNING_DAY_TEMPLATE_ALERT_RENAME'));
      setTimeout(() => setShowAlert(''), 4000);
    } else if (!dayName || dayName === '') {
      setShowAlert(t('PLANNING_DAY_TEMPLATE_ALERT_NO_NAME'));
      setTimeout(() => setShowAlert(''), 4000);
    } else {
      setTemplateAdded(true);
      createTemplate();
    }
  };

  const insertDescription = t('PLANNING_DAY_ICON_INSERT', {
    day_name: copyName ?? '',
  });
  return (
    <div style={{...styles.list, ...styles.container}}>
      <div style={styles.leftContainer}>
        <textarea
          placeholder={t('PLANNING_DAY_NAME_PLACEHOLDER')}
          style={
            focusTextfield
              ? {
                  ...sharedStyle.textStyle.title1,
                  ...styles.input,
                  ...styles.inputEdit,
                }
              : {...sharedStyle.textStyle.title1, ...styles.input}
          }
          value={dayName ?? ''}
          onChange={(event) => setDayName(event.target.value)}
          onFocus={() => {
            setFocusTextfield(true);
          }}
          onBlur={(event) => {
            handleOnBlurDayName(event.target.value);
            setFocusTextfield(false);
          }}
          className={props.intercomTarget}
          data-intercom-target={props.intercomTarget}
        />
        <IconWithTooltip
          loading={createTemplateLoading}
          active={templateAdded}
          styleActive={styles.greenButton}
          style={styles.icon}
          onClick={handleAddTemplate}
          muiIcon={LibraryAdd}
          description={t('PLANNING_DAY_ICON_TEMPLATE_ADD')}
        />
        <FillFromTemplate
          deleteTemplate={deleteTemplate}
          loading={pasteTemplateLoading}
          pasteTemplate={pasteTemplate}
          elements={templateOverview}
        />
        <IconWithTooltip
          style={styles.greenButton}
          onClick={insertCopy}
          muiIcon={ContentPaste}
          description={insertDescription}
          hide={!showInsert}
        />
        {showAlert && <Alert severity="warning">{showAlert}</Alert>}
      </div>

      <div style={styles.rightOuterContainer}>
        <div style={styles.sessionInfoContainer}>
          <SessionInfoText />
          <SessionNote />
        </div>
        <div style={styles.rightContainer}>
          <IconWithTooltip
            active={dayIsCopied}
            style={styles.icon}
            styleActive={styles.greenButton}
            onClick={copyDay}
            muiIcon={ContentCopy}
            description={t('PLANNING_DAY_ICON_COPY')}
          />
          <IconWithTooltip
            style={styles.icon}
            onClick={() => {
              setShowDeleteAlert(true);
            }}
            muiIcon={Delete}
            description={t('PLANNING_DAY_ICON_DELETE')}
          />
          <AlertPopover
            open={showDeleteAlert}
            handleClose={() => setShowDeleteAlert(false)}
            confirm={deleteDay}
            abortText={t('PLANNING_DAY_DELETE_ALERT_CANCEL')}
            confirmText={t('PLANNING_DAY_DELETE_ALERT_CONFIRM')}
            headline={t('PLANNING_DAY_DELETE_ALERT_TITLE')}
            text={t('PLANNING_DAY_DELETE_ALERT_TEXT')}
          />
        </div>
      </div>
    </div>
  );
};

type Styles = {
  list: CSSProperties;
  rightContainer: CSSProperties;
  leftContainer: CSSProperties;
  icon: CSSProperties;
  input: CSSProperties;
  inputEdit: CSSProperties;
  greenButton: CSSProperties;
  container: CSSProperties;
  rightOuterContainer: CSSProperties;
  sessionInfoContainer: CSSProperties;
};

const styles: Styles = {
  greenButton: {
    color: primary_green,
    height: 24,
  },
  input: {
    paddingLeft: 8,
    backgroundColor: dark_gray,
    border: 'none',
    borderRadius: 8,
    width: 380,
    outline: 'none',
    resize: 'none',
    lineHeight: 1,
    paddingTop: 6,
    height: 30,
    marginRight: 8,
  },
  inputEdit: {
    backgroundColor: light_gray,
  },
  icon: {
    color: ultra_light_gray,
    height: 24,
  },
  list: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    borderColor: ultra_light_gray,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightOuterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: dark_gray,
    borderColor: ultra_light_gray,
  },
  sessionInfoContainer: {
    marginRight: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};
