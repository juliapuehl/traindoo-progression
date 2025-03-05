import {AddCircle, Delete, Preview} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {dark_gray, light_gray, primary_green} from '../styles/colors';
import {TemplateArrayType} from '../traindoo_shared/types/User';
import {AddCheckModal} from './AddCheckModal';
import IconWithTooltip from './IconWithTooltip';
import SimpleSelect from './SimpleSelect';

type Props = {
  setShowPreview?: () => void;
  showPreview?: boolean;
  checkId: string;
  checkArray: TemplateArrayType[];
  handleDelete: (id: string, name: string) => void;
  setSelectedCheckId: (id: string) => void;
  type: 'daily' | 'weekly' | 'generic';
};

export const CheckEditSelector = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const {checkId, checkArray, type} = props;
  const checkName = checkArray.find((element) => element.id === checkId)?.name;
  const handleDelete = () => {
    props.handleDelete(checkId, checkName);
  };

  const handleNewValue = (newValue: string) => {
    props.setSelectedCheckId(newValue);
  };

  return (
    <>
      <div style={styles.container}>
        <SimpleSelect
          items={checkArray.map((check) => {
            return {label: check.name, value: check.id};
          })}
          value={checkId}
          label={
            type === 'daily'
              ? t('CHECKEDITOR_DAILY_SELECTOR_LABEL')
              : t('CHECKEDITOR_WEEKLY_SELECTOR_LABEL')
          }
          style={styles.selectStyle}
          onChange={handleNewValue}
        />
        <div style={styles.iconContainer}>
          {props.setShowPreview && (
            <IconWithTooltip
              style={props.showPreview ? styles.addIcon : styles.deleteIcon}
              onClick={() => props.setShowPreview()}
              muiIcon={Preview}
              description={t('CHECKEDITOR_SHOW_PREVIEW')}
            />
          )}
          <IconWithTooltip
            style={styles.addIcon}
            onClick={() => setOpenModal(true)}
            muiIcon={AddCircle}
            description={t('CHECKEDITOR_ADD_TEMPLATE')}
          />
          {checkId &&
            checkName !== 'Default Daily Check' &&
            checkName !== 'Default Weekly Check' && (
              <IconWithTooltip
                style={styles.deleteIcon}
                onClick={handleDelete}
                muiIcon={Delete}
                description={t('CHECKEDITOR_DELETE_TEMPLATE')}
              />
            )}
        </div>
      </div>
      <AddCheckModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        changeSelectedCheck={handleNewValue}
        type={props.type}
      />
    </>
  );
};

type Styles = {
  container: CSSProperties;
  selectStyle: CSSProperties;
  addIcon: CSSProperties;
  deleteIcon: CSSProperties;
  iconContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    marginRight: 8,
    marginLeft: 8,
    padding: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectStyle: {marginRight: 16, maxWidth: 600},
  addIcon: {
    color: primary_green,
    height: 24,
  },
  deleteIcon: {
    color: light_gray,
    height: 24,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
};
