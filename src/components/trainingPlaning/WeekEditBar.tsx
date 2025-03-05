import {
  ContentCopy,
  ContentPaste,
  Delete,
  LibraryAdd,
} from '@mui/icons-material/';
import {Alert} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {
  dark_gray,
  light_gray,
  primary_green,
  ultra_light_gray,
} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {AlertPopover} from '../AlertPopover';
import {CommentPopover} from '../CommentPopover';
import FillFromTemplate from '../FillFromTemplate';
import IconWithTooltip from '../IconWithTooltip';
import {useCollectionTemplateConnect} from './model/collection/useCollectionTemplateConnect';
import {useCollectionTrainerFeedbackConnect} from './model/collection/useCollectionTrainerFeedbackConnect';
import {useWeekCopyConnect} from './model/collection/useWeekCopyConnect';
import {useWeekDeleteConnect} from './model/collection/useWeekDeleteConnect';
import {useWeekNameConnect} from './model/collection/useWeekNameConnect';
import {useWeekPasteConnect} from './model/collection/useWeekPasteConnect';

type Props = {
  hisData?: boolean;
  showDeleteCycleAlert: () => void;
  intercomTarget?: string;
};

const WeekEditBar = (props: Props) => {
  const {copyWeek} = useWeekCopyConnect();
  const {
    deleteTemplate,
    weekTemplates,
    createTemplate,
    createTemplateLoading,
    pasteTemplate,
    pasteTemplateLoading,
  } = useCollectionTemplateConnect();
  const {pasteLoading, showInsert, weekCopied, copyName, pasteWeek} =
    useWeekPasteConnect();
  const {deleteLoading, deleteWeek, displayCycleDeleteAlert} =
    useWeekDeleteConnect();
  const {fireCollectionFeedback, saveCollectionFeedback} =
    useCollectionTrainerFeedbackConnect();
  const {firWeekName, saveWeekName} = useWeekNameConnect();
  const [weekName, setWeekName] = useState(firWeekName);
  const [focusTextfield, setFocusTextfield] = useState(false);
  const [templateAdded, setTemplateAdded] = useState(false);
  const [showAlert, setShowAlert] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    setTemplateAdded(false);
    setWeekName(firWeekName ?? '');
  }, [firWeekName]);

  const handleOnBlurDayName = (value: string) => {
    if (firWeekName !== value) {
      setTemplateAdded(false);
      saveWeekName(value);
    }
  };

  const handleAddTemplate = () => {
    if (weekTemplates?.find((template) => template.name === weekName)) {
      setShowAlert(t('PLANNING_WEEK_ALERT_RENAME'));
    } else if (!weekName || weekName === '') {
      setShowAlert(t('PLANNING_WEEK_ALERT_NO_NAME'));
    } else {
      setTemplateAdded(true);
      createTemplate();
    }
    setTimeout(() => setShowAlert(''), 4000);
  };

  const handleAlertOpenTemplate = (msg: string) => {
    setShowAlert(msg);
    setTimeout(() => setShowAlert(''), 4000);
  };

  const handleDeleteWeek = () => {
    deleteWeek(props.showDeleteCycleAlert);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <textarea
          placeholder={t('PLANNING_WEEK_NAME_PLACEHOLDER')}
          style={
            focusTextfield
              ? {
                  ...sharedStyle.textStyle.title1,
                  ...styles.input,
                  ...styles.inputEdit,
                }
              : {...sharedStyle.textStyle.title1, ...styles.input}
          }
          value={weekName}
          onChange={(event) => setWeekName(event.target.value)}
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
          style={styles.icon}
          styleActive={styles.greenButton}
          onClick={handleAddTemplate}
          muiIcon={LibraryAdd}
          description={t('PLANNING_WEEK_ICON_TEMPLATE_ADD')}
        />
        <FillFromTemplate
          deleteTemplate={deleteTemplate}
          loading={pasteTemplateLoading}
          pasteTemplate={pasteTemplate}
          elements={weekTemplates}
          setAlert={handleAlertOpenTemplate}
        />
        <CommentPopover
          title={t('PLANNING_WEEK_PLACEHOLDER_FEEDBACK')}
          description={t('PLANNING_WEEK_ICON_FEEDBACK')}
          text={fireCollectionFeedback}
          handleClose={(text: string) => saveCollectionFeedback(text)}
        />

        <IconWithTooltip
          loading={pasteLoading}
          hide={!showInsert}
          style={styles.pasteButton}
          onClick={pasteWeek}
          muiIcon={ContentPaste}
          description={t('PLANNING_WEEK_ICON_INSERT', {
            week_name: copyName,
          })}
        />

        {showAlert && <Alert severity="warning">{showAlert}</Alert>}
      </div>
      <div style={{...styles.list, ...styles.rightOuterContainer}}>
        <div style={styles.rightContainer}>
          <IconWithTooltip
            style={styles.icon}
            styleActive={styles.greenButton}
            active={weekCopied}
            onClick={copyWeek}
            muiIcon={ContentCopy}
            description={t('PLANNING_WEEK_ICON_COPY')}
          />
          <IconWithTooltip
            loading={deleteLoading}
            style={styles.icon}
            onClick={() => setShowDeleteAlert(true)}
            muiIcon={Delete}
            description={t('PLANNING_WEEK_ICON_DELETE')}
          />
          <AlertPopover
            open={showDeleteAlert}
            handleClose={() => setShowDeleteAlert(false)}
            confirm={handleDeleteWeek}
            abortText={t('PLANNING_WEEK_DELETE_ALERT_CANCEL')}
            confirmText={t('PLANNING_WEEK_DELETE_ALERT_CONFIRM')}
            headline={t('PLANNING_WEEK_DELETE_ALERT_TITLE')}
            text={t('PLANNING_WEEK_DELETE_ALERT_TEXT')}
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
  pasteButton: CSSProperties;
  rightOuterContainer: CSSProperties;
  copySpinner: CSSProperties;
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
    marginRight: 8,
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
  pasteButton: {
    color: primary_green,
    height: 24,
  },
  container: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    borderColor: ultra_light_gray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightOuterContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  copySpinner: {
    marginRight: 16,
  },
};

export default WeekEditBar;
