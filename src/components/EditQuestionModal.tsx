import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {v4 as uuid4} from 'uuid';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {
  getCategoryQuestionNames,
  getDailyDashboardColorInfo,
  getUserId,
  webSettingsLayoutQuery,
} from '../logic/firestore';
import {addQuestionToCheck} from '../store/checkEditorSlice';
import {RootState} from '../store/store';
import {
  light_gray,
  primary_green,
  red,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {
  CheckQuestionInputType,
  CheckQuestionTemplate,
} from '../traindoo_shared/types/Check';
import {UnitIdType} from '../traindoo_shared/units/UnitTypes';
import {
  useGetUnitValueBackend,
  useGetUnitValueFrontend,
} from '../traindoo_shared/units/useUnits';
import {questionTypeArray} from '../types/Check';
import {generateColorDifferentFrom} from '../utils/colorFunctions';
import {addCheckQuestionToCategoryLibrary} from '../utils/editingCheckHelper';
import BasicTextField from './BasicTextField';
import Button from './Button';
import {CheckEditorButtonSurveyQuestion} from './check_editor/CheckEditorButtonSurveyQuestion';
import {CheckEditorNumericInputQuestion} from './check_editor/CheckEditorNumericInputQuestion';
import {CheckEditorQuestionPreview} from './check_editor/CheckEditorQuestionPreview';
import {CheckEditorSurveyQuestion} from './check_editor/CheckEditorSurveyQuestion';
import {TraindooColorPicker} from './check_editor/TraindooColorPicker';
import SimpleSelect from './SimpleSelect';

const style = {
  maxHeight: '90vh',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '80%',
  bgcolor: sidebar_color_dark,
  border: '2px solid #000',
  overflow: 'hidden',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  padding: 0,
  paddingBottom: 4,
};

type Props = {
  open: boolean;
  handleClose: () => void;
  athleteUserId?: string;
  questionId?: string;
  categoryId: string;
  checkId: string;
  indexNewQuestion?: number;
  type: 'daily' | 'weekly' | 'generic';
};

export const EditQuestionModal = (props: Props) => {
  const addQuestionToTemplate = useSelector(addQuestionToCheck);
  const getUnitValueBackend = useGetUnitValueBackend();
  const getUnitValueFrontend = useGetUnitValueFrontend();
  const translateQuestion = useCheckTranslateQuestion();
  const questionInfo = translateQuestion(props.categoryId, props.questionId);

  const [questionName, setQuestionName] = useState(questionInfo?.name ?? '');
  const [questionNameErrorText, setQuestionNameErrorText] = useState('');
  const [question, setQuestion] = useState(questionInfo?.question ?? '');
  const [questionErrorText, setQuestionErrorText] = useState('');
  const [questionType, setQuestionType] = useState(questionInfo?.type ?? '');
  const [unitType, setUnitType] = useState(questionInfo?.unit ?? '');
  const [placeholder, setPlaceholder] = useState(
    questionInfo?.placeholder ?? '',
  );
  const [answers, setAnswers] = useState(questionInfo?.answers ?? ['', '']);
  const [defaultValue, setDefaultValue] = useState(
    getUnitValueFrontend(questionInfo?.unit, questionInfo?.defaultValue) ?? '',
  );
  const questionNames = useSelector((state: RootState) =>
    getCategoryQuestionNames(state, props.categoryId, true),
  );

  const questionColors = useSelector(getDailyDashboardColorInfo);
  const currentColor = questionColors[props.questionId];
  const [color, setColor] = useState(
    currentColor ?? generateColorDifferentFrom(questionColors),
  );

  useEffect(() => {
    if (props.open) {
      if (currentColor) {
        setColor(currentColor);
      } else {
        setColor(generateColorDifferentFrom(questionColors));
      }
    }
  }, [props.open, currentColor, questionColors]);

  useEffect(() => {
    setQuestionName(questionInfo?.name ?? '');
    setQuestion(questionInfo?.question ?? '');
    setQuestionType(questionInfo?.type ?? '');
    setUnitType(questionInfo?.unit ?? '');
    setPlaceholder(questionInfo?.placeholder ?? '');
    setAnswers(questionInfo?.answers ?? ['', '']);
    setDefaultValue(
      getUnitValueFrontend(questionInfo?.unit, questionInfo?.defaultValue) ??
        '',
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionInfo, props.open]);

  const firestore = useFirestore();
  const userId = useSelector(getUserId);

  const editingQuestion = props.questionId ? true : false;

  const changeQuestionName = (newQuestionName: string) => {
    const noSpecialChar = /^[A-Za-z0-9-äöüÄÖÜ]+$/;
    if (questionInfo?.name) {
      setQuestionNameErrorText(t('CHECKEDITOR_ERROR_QUESTION_ID'));
      setTimeout(() => {
        setQuestionNameErrorText('');
      }, 3000);
    } else if (!noSpecialChar.test(newQuestionName) && newQuestionName !== '') {
      setQuestionNameErrorText(t('CHECKEDITOR_ERROR_SPECIAL_CHARACTERS'));
    } else if (newQuestionName.length > 20) {
      setQuestionNameErrorText(t('CHECKEDITOR_ERROR_LENGTH_20'));
    } else {
      setQuestionNameErrorText('');
      setQuestionName(newQuestionName);
    }
  };
  const changeQuestion = (newQuestionName: string) => {
    if (newQuestionName.length > 100) {
      setQuestionErrorText(t('CHECKEDITOR_ERROR_LENGTH_100'));
    } else {
      setQuestionErrorText('');
      setQuestion(newQuestionName);
    }
  };

  const buttonDisabled = () => {
    if (questionName && question && questionType) {
      return questionType === 'survey' && answers.includes('');
    }
    return true;
  };

  const uploadColor = (questionId: string) => {
    firestore.update(webSettingsLayoutQuery(userId), {
      ['dailyCheckLayout.questionColors.' + questionId]: color,
    });
  };

  const addQuestion = () => {
    if (!props.questionId && questionNames.includes(questionName)) {
      setQuestionNameErrorText(t('CHECKEDITOR_ERROR_QUESTION_TAKEN'));
      return;
    }
    const newQuestionId = props.questionId ?? uuid4();
    const changeObject: CheckQuestionTemplate = {
      name: questionName,
      id: newQuestionId,
      question: question,
      type: questionType as CheckQuestionInputType,
    };
    switch (questionType) {
      case 'survey':
        changeObject.answers = answers;
        uploadColor(newQuestionId);
        break;
      case 'buttonSurvey':
        changeObject.answers = answers;
        uploadColor(newQuestionId);
        break;
      case 'input':
        if (defaultValue) {
          changeObject.defaultValue = parseFloat(
            String(getUnitValueBackend(defaultValue, unitType)),
          );
        }
        if (unitType) {
          changeObject.unit = unitType as UnitIdType;
        }
        uploadColor(newQuestionId);
        break;
      case 'comment':
        if (placeholder) {
          changeObject.placeholder = placeholder;
        }
        break;
      case 'longText':
        if (placeholder) {
          changeObject.placeholder = placeholder;
        }
        break;
      default:
        break;
    }
    addCheckQuestionToCategoryLibrary(
      props.categoryId,
      changeObject,
      userId,
      firestore,
    );
    if (!editingQuestion) {
      addQuestionToTemplate(
        props.checkId,
        props.categoryId,
        newQuestionId,
        props.indexNewQuestion,
        userId,
        firestore,
        props.type,
      );
    }
    props.handleClose();
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={styles.scrollView}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            color={white}
          >
            {editingQuestion
              ? t('CHECKEDITOR_QUESTION_EDIT')
              : t('CHECKEDITOR_QUESTION_CREATE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="body2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {editingQuestion
              ? t('CHECKEDITOR_QUESTION_EDIT_INFORMATION')
              : t('CHECKEDITOR_QUESTION_CREATE_INFORMATION')}
          </Typography>
          <BasicTextField
            disabled={editingQuestion}
            label={t('CHECKEDITOR_QUESTION_ID')}
            onChange={changeQuestionName}
            value={questionName}
            error={questionNameErrorText !== ''}
            errorText={questionNameErrorText}
            tooltip={t('CHECKEDITOR_QUESTION_ID_INFORMATION')}
          />
          <BasicTextField
            label={t('CHECKEDITOR_QUESTION')}
            onChange={changeQuestion}
            value={question}
            error={questionErrorText ? true : false}
            errorText={questionErrorText}
            tooltip={t('CHECKEDITOR_QUESTION_INFO')}
          />
          <SimpleSelect
            onChange={setQuestionType}
            items={questionTypeArray.map((element) => {
              return {label: t(element.name), value: element.type};
            })}
            value={questionType}
            label={t('CHECKEDITOR_QUESTION_TYPE')}
            tooltip={t('CHECKEDITOR_QUESTION_TYPE_INFORMATION')}
          />
          {questionType === 'input' && (
            <CheckEditorNumericInputQuestion
              defaultValue={defaultValue}
              setDefaultValue={setDefaultValue}
              unitType={unitType}
              setUnitType={setUnitType}
            />
          )}
          {questionType === 'survey' && (
            <CheckEditorSurveyQuestion
              answers={answers}
              setAnswers={setAnswers}
            />
          )}
          {questionType === 'buttonSurvey' && (
            <CheckEditorButtonSurveyQuestion
              answers={answers}
              setAnswers={setAnswers}
            />
          )}
          {(questionType === 'comment' || questionType === 'longText') && (
            <BasicTextField
              style={styles.placeholder}
              onChange={setPlaceholder}
              value={placeholder}
              label={t('CHECKEDITOR_COMMENT_PLACEHOLDER')}
            />
          )}
          {questionType && (
            <CheckEditorQuestionPreview
              categoryId={props.categoryId}
              questionName={questionName}
              question={question}
              questionType={questionType as CheckQuestionInputType}
              defaultValue={Number(defaultValue)}
              unit={unitType as UnitIdType}
              placeholder={placeholder}
              answers={answers}
            />
          )}
          {questionType === 'input' ||
          questionType === 'survey' ||
          questionType === 'buttonSurvey' ? (
            <TraindooColorPicker
              color={color}
              setColor={setColor}
              title={t('CHECKEDITOR_QUESTION_COLOR')}
            />
          ) : (
            <></>
          )}
        </div>
        <div style={styles.buttonContainer}>
          <Button
            style={styles.cancel}
            disabled={buttonDisabled()}
            onClick={addQuestion}
            text={
              editingQuestion
                ? t('CHECKEDITOR_QUESTION_CONFIRM_SAVE')
                : t('CHECKEDITOR_QUESTION_CONFIRM')
            }
          />
          <Button
            color={light_gray}
            style={styles.confirm}
            onClick={() => {
              props.handleClose();
            }}
            text={t('CHECKEDITOR_QUESTION_CANCEL')}
          />
        </div>
      </Box>
    </Modal>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
  delete: CSSProperties;
  selectContainer: CSSProperties;
  scrollView: CSSProperties;
  nameTextField: CSSProperties;
  name: CSSProperties;
  headline: CSSProperties;
  text: CSSProperties;
  colorButton: CSSProperties;
  placeholder: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    bottom: 0,
    display: 'flex',
    paddingBottom: 32,
    zIndex: 1,
    width: '100%',
    background:
      'linear-gradient(rgba(41, 45, 57, 0), rgba(41, 45, 57, 0.5),rgba(41, 45, 57, 1) ,rgba(41, 45, 57,1)',
  },
  selectContainer: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirm: {
    color: white,
    background: ultra_light_gray,
  },
  delete: {
    color: white,
    background: red,
  },
  cancel: {
    color: white,
    background: primary_green,
  },
  scrollView: {
    padding: 32,
    paddingBottom: 100,
    overflow: 'auto',
    maxHeight: '90vh',
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    width: 280,
    marginTop: 2,
    marginLeft: 8,
  },
  nameTextField: {
    maxHeight: 120,
    overflow: 'auto',
  },
  headline: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 16,
  },
  colorButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  placeholder: {
    marginTop: 16,
  },
};
