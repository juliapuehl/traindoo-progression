import {Close} from '@mui/icons-material';
import {Menu, MenuItem} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {
  getUnusedQuestionsSelectedCategory,
  getUserId,
} from '../logic/firestore';
import {addQuestionToCheck} from '../store/checkEditorSlice';
import {RootState} from '../store/store';
import {deleteQuestionFromLibrary} from '../utils/editingCheckHelper';
import {AlertPopover} from './AlertPopover';
import {EditQuestionModal} from './EditQuestionModal';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  anchorEl: any;
  open: boolean;
  handleClose: () => void;
  categoryId: string;
  indexNewQuestion: number;
  type: 'daily' | 'weekly' | 'generic';
  checkId: string;
};

const CheckQuestionSelectorMenu = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<
    {id: string; name: string} | undefined
  >();
  const [showArchived, setShowArchived] = useState(false);
  const checkId = props.checkId;
  const getTranslatedQuestion = useCheckTranslateQuestion();
  const unusedQuestions = useSelector((state: RootState) =>
    getUnusedQuestionsSelectedCategory(
      state,
      props.categoryId,
      showArchived,
      props.type,
    ),
  );
  const userId = useSelector(getUserId);
  const addQuestionToTemplate = useSelector(addQuestionToCheck);
  const firestore = useFirestore();
  const handleClick = async (name: string, id: string) => {
    addQuestionToTemplate(
      checkId,
      props.categoryId,
      id,
      props.indexNewQuestion,
      userId,
      firestore,
      props.type,
    );
    props.handleClose();
  };

  const handleAdd = () => {
    setOpenModal(true);
    props.handleClose();
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleDelete = (id: string) => {
    deleteQuestionFromLibrary(props.categoryId, id, userId, firestore);
  };

  const generateMenu = () => {
    const menuItems = unusedQuestions.map((questionId) => {
      const question = getTranslatedQuestion(props.categoryId, questionId);
      if (question) {
        const deletable =
          !question.notEditable && !question.notDeletable && !question.archived;
        return (
          <div style={styles.menu} key={'questionSelector' + questionId}>
            <MenuItem
              style={styles.menuItem}
              onClick={() => handleClick(question.name, questionId)}
            >
              {question.name}
            </MenuItem>
            {deletable ? (
              <IconWithTooltip
                style={styles.deleteIcon}
                onClick={() =>
                  setShowDeleteAlert({id: questionId, name: question.name})
                }
                muiIcon={Close}
                description={t('CHECKEDITOR_QUESTION_DELETE')}
              />
            ) : (
              <></>
            )}
          </div>
        );
      } else {
        return <></>;
      }
    });
    return [
      <MenuItem key={'categoryAdd'} onClick={() => handleAdd()}>
        {t('CHECKEDITOR_ADD_QUESTION_TITLE')}
      </MenuItem>,
      <MenuItem key={'archived'} onClick={() => setShowArchived(!showArchived)}>
        {showArchived
          ? t('CHECKEDITOR_HIDE_ARCHIVE')
          : t('CHECKEDITOR_SHOW_ARCHIVE')}
      </MenuItem>,
    ].concat(menuItems);
  };
  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {generateMenu()}
      </Menu>
      <EditQuestionModal
        open={openModal}
        handleClose={closeModal}
        categoryId={props.categoryId}
        checkId={checkId}
        indexNewQuestion={props.indexNewQuestion}
        type={props.type}
      />
      <AlertPopover
        open={showDeleteAlert !== undefined}
        handleClose={() => setShowDeleteAlert(undefined)}
        confirm={() => handleDelete(showDeleteAlert?.id)}
        abortText={t('CHECKEDITOR_QUESTION_DELETE_CANCEL')}
        confirmText={t('CHECKEDITOR_QUESTION_DELETE_CONFIRM')}
        headline={t('CHECKEDITOR_QUESTION_DELETE_TITLE')}
        text={t('CHECKEDITOR_QUESTION_DELETE_TEXT', {
          question: showDeleteAlert?.name,
        })}
      />
    </>
  );
};

type Style = {
  deleteIcon: CSSProperties;
  menu: CSSProperties;
  menuItem: CSSProperties;
};

const styles: Style = {
  menuItem: {
    flex: 1,
  },
  deleteIcon: {
    color: 'black',
    height: 24,
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export default CheckQuestionSelectorMenu;
