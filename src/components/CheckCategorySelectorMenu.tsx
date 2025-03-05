import {Close} from '@mui/icons-material';
import {Menu, MenuItem} from '@mui/material';
import {t} from 'i18n-js';
import {isEmpty} from 'lodash';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useCheckTranslateCategoryName} from '../hooks/useCheckTranslate';
import {
  getCheckCategoryLibrary,
  getUnusedCategoryNamesSelectedCheck,
  getUserId,
} from '../logic/firestore';
import {addCategoryToCheck} from '../store/checkEditorSlice';
import {RootState} from '../store/store';
import {deleteCategoryFromLibrary} from '../utils/editingCheckHelper';
import {AddCheckCategoryModal} from './AddCheckCategoryModal';
import {AlertPopover} from './AlertPopover';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  anchorEl: any;
  open: boolean;
  handleClose: () => void;
  index: number;
  type: 'daily' | 'weekly' | 'generic';
  checkId: string;
};

const CheckCategorySelectorMenu = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<
    {id: string; name: string} | undefined
  >();
  const [showArchived, setShowArchived] = useState(false);
  const getTranslatedCategoryName = useCheckTranslateCategoryName();
  const categoryLibrary = useSelector(getCheckCategoryLibrary);
  const unusedCategories = useSelector((state: RootState) =>
    getUnusedCategoryNamesSelectedCheck(state, showArchived, props.type),
  );
  const checkId = props.checkId;

  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const addCategory = useSelector(addCategoryToCheck);

  const handleClick = async (name: string, id: string) => {
    addCategory(
      name.trim(),
      id,
      checkId,
      props.index,
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

  const deleteCategory = (id: string) => {
    deleteCategoryFromLibrary(id, userId, firestore);
  };

  const generateMenu = () => {
    const menuItems = [];
    if (!isEmpty(unusedCategories)) {
      for (const element of unusedCategories) {
        const categoryInfo = categoryLibrary[element.id];
        if (!categoryInfo) continue;
        const deletable =
          !categoryInfo.notEditable &&
          !categoryInfo.notDeletable &&
          !categoryInfo.archived;
        const categoryName = getTranslatedCategoryName(element.id);
        menuItems.push(
          <div style={styles.menu} key={'category' + element.id}>
            <MenuItem
              style={styles.menuItem}
              onClick={() => handleClick(categoryInfo.name, element.id)}
            >
              {categoryName}
            </MenuItem>
            {deletable ? (
              <IconWithTooltip
                style={styles.deleteIcon}
                onClick={() =>
                  setShowDeleteAlert({id: element.id, name: categoryName})
                }
                muiIcon={Close}
                description={t('CHECKEDITOR_DELETE_CATEGORY')}
              />
            ) : (
              <></>
            )}
          </div>,
        );
      }
    }

    return [
      [
        <MenuItem key={'categoryAdd'} onClick={() => handleAdd()}>
          {t('CHECKEDITOR_ADD_NEW_CATEGORY')}
        </MenuItem>,
        <MenuItem
          key={'archived'}
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived
            ? t('CHECKEDITOR_HIDE_ARCHIVE')
            : t('CHECKEDITOR_SHOW_ARCHIVE')}
        </MenuItem>,
      ],
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
      <AddCheckCategoryModal
        handleClose={closeModal}
        open={openModal}
        index={props.index}
        type={props.type}
      />
      <AlertPopover
        open={showDeleteAlert !== undefined}
        handleClose={() => setShowDeleteAlert(undefined)}
        confirm={() => deleteCategory(showDeleteAlert?.id)}
        abortText={t('CHECKEDITOR_DELETE_CATEGORY_CANCEL')}
        confirmText={t('CHECKEDITOR_DELETE_CATEGORY_CONFIRM')}
        headline={t('CHECKEDITOR_DELETE_CATEGORY')}
        text={t('CHECKEDITOR_DELETE_CATEGORY_TEXT', {
          category: showDeleteAlert?.name,
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

export default CheckCategorySelectorMenu;
