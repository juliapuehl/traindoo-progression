import {Check, Delete, Edit, PhotoCamera} from '@mui/icons-material';
import {Chip} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  useCheckTranslateCategoryName,
  useCheckTranslateQuestion,
} from '../hooks/useCheckTranslate';
import {
  getCheckSpecificCategory,
  getDailyDashboardColorInfo,
  getIndexNewCheckQuestion,
  getUserId,
} from '../logic/firestore';
import {
  removeCategoryFromCheck,
  removeQuestionFromCheck,
} from '../store/checkEditorSlice';
import {RootState} from '../store/store';
import {
  dark_gray,
  light_gray,
  primary_green,
  surveyColorSelector,
  white,
} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {
  useGetUnitObject,
  useGetUnitValueFrontend,
} from '../traindoo_shared/units/useUnits';
import {CheckCategoryType, CheckQuestionType} from '../types/Check';
import {CheckQuestionAddIcon} from './CheckQuestionAddIcon';
import {EditQuestionModal} from './EditQuestionModal';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  category: CheckCategoryType;
  checkNotEditable?: boolean;
  type: 'daily' | 'weekly' | 'generic';
  checkId: string;
};

export const CheckCategoryComponent = (props: Props) => {
  const getUnitObject = useGetUnitObject();
  const getUnitValueFrontend = useGetUnitValueFrontend();
  const translateCategoryName = useCheckTranslateCategoryName();
  const translatedQuestion = useCheckTranslateQuestion();
  const checkId = props.checkId;
  const category = props.category;
  const categoryName = translateCategoryName(category.id);
  const removeCategory = useSelector(removeCategoryFromCheck);
  const questionColors = useSelector(getDailyDashboardColorInfo);

  const [openQuestionModal, setOpenQuestionModal] = useState({
    open: false,
    questionId: undefined,
    index: undefined,
  });
  const [editingCategory, setEditingCategory] = useState(
    Object.values(category.questions)?.length ? false : true,
  );
  const categoryInfo = useSelector((state: RootState) =>
    getCheckSpecificCategory(state, category.id),
  );
  const removeQuestion = useSelector(removeQuestionFromCheck);
  const newQuestionIndex = useSelector((state: RootState) =>
    getIndexNewCheckQuestion(state, category.id, props.type),
  );
  const userId = useSelector(getUserId);
  const firestore = useFirestore();

  const deleteCategory = () => {
    removeCategory(
      category.id,
      checkId,
      category.index,
      userId,
      firestore,
      props.type,
    );
  };

  const handleDeleteQuestion = (question: CheckQuestionType) => {
    removeQuestion(
      category.id,
      question,
      checkId,
      userId,
      firestore,
      props.type,
    );
  };

  const generateSurvey = (answers: string[]) => {
    const colorArray = surveyColorSelector(answers?.length);
    return (
      <div style={styles.valueContainer}>
        {answers?.map((answer, index) => (
          <Chip
            key={answer + index}
            label={answer}
            variant="outlined"
            style={styles.label}
            sx={{
              backgroundColor: colorArray[index],
              ...sharedStyle.textStyle.primary_white_capital,
            }}
          />
        ))}
      </div>
    );
  };

  const generateButtonSurvey = (answers: string[]) => {
    return (
      <div style={styles.valueContainer}>
        {answers?.map((answer, index) => (
          <Chip
            key={answer + index}
            label={answer}
            variant="outlined"
            style={styles.label}
            sx={{
              backgroundColor: index ? dark_gray : primary_green,
              ...sharedStyle.textStyle.primary_white_capital,
            }}
          />
        ))}
      </div>
    );
  };

  if (categoryInfo) {
    const categoryEditable =
      categoryInfo.notEditable !== true &&
      props.checkNotEditable !== true &&
      editingCategory;
    const questions = Object.values(category.questions).slice();
    const questionComponents = questions
      ? questions
          .sort((a, b) => a.index - b.index)
          .map((questionElement, questionIndex) => {
            const questionInfo = translatedQuestion(
              categoryInfo.id,
              questionElement.id,
            );

            if (questionInfo) {
              const questionEditable = !questionInfo.notEditable;
              const defaultValue = getUnitValueFrontend(
                questionInfo.unit,
                questionInfo.defaultValue,
                100,
              );
              return (
                <div key={'question ' + questionElement.id}>
                  {categoryEditable && (
                    <CheckQuestionAddIcon
                      questionIndex={questionIndex}
                      categoryId={category.id}
                      type={props.type}
                      checkId={checkId}
                    />
                  )}
                  <div style={styles.questionContainer}>
                    <div style={styles.questionContent}>
                      <div
                        style={{
                          ...styles.questionName,
                          ...{color: questionColors[questionElement.id]},
                        }}
                      >
                        {questionInfo?.name}
                      </div>
                      <div style={styles.questionText}>
                        {questionInfo.question}
                      </div>
                      {questionInfo.type === 'input' && (
                        <div style={styles.defaultValue}>
                          {defaultValue ? defaultValue + ' ' : ''}
                          {getUnitObject(questionInfo.unit)?.label}
                        </div>
                      )}
                      {(questionInfo.type === 'comment' ||
                        questionInfo.type === 'longText') && (
                        <div style={styles.questionPlaceholder}>
                          {questionInfo.placeholder}
                        </div>
                      )}
                      {questionInfo.type === 'survey' ? (
                        generateSurvey(questionInfo.answers)
                      ) : (
                        <></>
                      )}
                      {questionInfo.type === 'buttonSurvey' ? (
                        generateButtonSurvey(questionInfo.answers)
                      ) : (
                        <></>
                      )}
                      {questionInfo.type === 'media' ? (
                        <div style={styles.photoIconContainer}>
                          <PhotoCamera style={styles.photoIcon} />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {categoryEditable && questionEditable && (
                      <IconWithTooltip
                        style={styles.questionIcon}
                        onClick={() => {
                          setOpenQuestionModal({
                            open: true,
                            questionId: questionElement.id,
                            index: questionIndex,
                          });
                        }}
                        muiIcon={Edit}
                        description={t('CHECKEDITOR_QUESTION_EDIT')}
                      />
                    )}
                    {categoryEditable && (
                      <IconWithTooltip
                        style={styles.questionIcon}
                        onClick={() => {
                          handleDeleteQuestion(questionElement);
                        }}
                        muiIcon={Delete}
                        description={t('CHECKEDITOR_QUESTION_DELETE')}
                      />
                    )}
                  </div>
                </div>
              );
            } else {
              return <></>;
            }
          })
      : [];
    return (
      <div style={styles.container}>
        <div style={styles.headline}>
          <div
            style={{...sharedStyle.textStyle.title1, ...styles.categoryName}}
          >
            {categoryName}
          </div>
          {props.checkNotEditable !== true && (
            <div style={styles.categoryIcons}>
              {categoryInfo.notEditable !== true && (
                <IconWithTooltip
                  style={editingCategory ? styles.addIcon : styles.deleteIcon}
                  onClick={() => setEditingCategory(!editingCategory)}
                  muiIcon={editingCategory ? Check : Edit}
                  description={
                    editingCategory
                      ? t('CHECKEDITOR_CATEGORY_CONFIRM')
                      : t('CHECKEDITOR_CATEGORY_EDIT')
                  }
                />
              )}
              <IconWithTooltip
                style={styles.deleteIcon}
                onClick={deleteCategory}
                muiIcon={Delete}
                description={t('CHECKEDITOR_REMOVE_CATEGORY')}
              />
            </div>
          )}
        </div>
        <div style={styles.questions}>
          {questionComponents}
          {categoryEditable && (
            <CheckQuestionAddIcon
              questionIndex={newQuestionIndex}
              categoryId={category.id}
              type={props.type}
              checkId={checkId}
            />
          )}
        </div>

        <EditQuestionModal
          open={openQuestionModal.open}
          type={props.type}
          handleClose={() => {
            setOpenQuestionModal({
              open: false,
              questionId: undefined,
              index: undefined,
            });
          }}
          categoryId={category.id}
          checkId={checkId}
          questionId={openQuestionModal.questionId}
          indexNewQuestion={openQuestionModal.index}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

type Styles = {
  container: CSSProperties;
  headline: CSSProperties;
  categoryName: CSSProperties;
  categoryIcons: CSSProperties;
  questionContainer: CSSProperties;
  questions: CSSProperties;
  addIcon: CSSProperties;
  deleteIcon: CSSProperties;
  questionText: CSSProperties;
  label: CSSProperties;
  questionName: CSSProperties;
  valueContainer: CSSProperties;
  questionPlaceholder: CSSProperties;
  questionContent: CSSProperties;
  defaultValue: CSSProperties;
  questionIcon: CSSProperties;
  photoIcon: CSSProperties;
  photoIconContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {},
  categoryIcons: {
    display: 'flex',
    alignItems: 'center',
  },
  questionContainer: {
    backgroundColor: light_gray,
    padding: 4,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  questions: {
    display: 'flex',
    flexDirection: 'column',
  },
  addIcon: {
    color: primary_green,
    height: 24,
  },
  deleteIcon: {
    color: light_gray,
    height: 24,
  },
  questionText: {
    margin: 4,
    minWidth: 300,
    flex: 2,
  },
  label: {color: white, margin: '4px 4px 4px 4px'},
  questionName: {
    flex: 1,
    maxWidth: 190,
    alignItems: 'center',
    display: 'flex',
    ...sharedStyle.textStyle.primary_white_capital,
    textTransform: 'uppercase',
    borderRight: '1px solid white',
  },
  valueContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  questionPlaceholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    margin: 4,
    ...sharedStyle.textStyle.primary_white_capital,
  },
  questionContent: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...sharedStyle.textStyle.primary_white_capital,
  },
  defaultValue: {
    margin: 4,
    minWidth: 300,
    flex: 1,
  },
  questionIcon: {
    height: 24,
    color: white,
  },
  photoIcon: {
    color: white,
    height: 24,
  },
  photoIconContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    margin: 4,
  },
};
