import {AddCircle} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {primary_green} from '../styles/colors';
import CheckCategorySelectorMenu from './CheckCategorySelectorMenu';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  newIndex: number;
  type: 'daily' | 'weekly' | 'generic';
  checkId: string;
};

export const CheckCategoryAddIcon = (props: Props) => {
  const [selectorAnchorEl, setSelectorAnchorEl] = useState(null);
  const handleOpenSelectorMenu = (event) => {
    setSelectorAnchorEl(event.currentTarget);
  };
  const handleCloseSelectorMenu = () => {
    setSelectorAnchorEl(null);
  };
  return (
    <>
      <IconWithTooltip
        style={styles.addIcon}
        eventClick={(event) => {
          handleOpenSelectorMenu(event);
        }}
        muiIcon={AddCircle}
        description={t('CHECKEDITOR_ADD_CATEGORY')}
        intercomTarget="checkeditor-add-category-button"
      />
      <CheckCategorySelectorMenu
        open={Boolean(selectorAnchorEl)}
        anchorEl={selectorAnchorEl}
        handleClose={handleCloseSelectorMenu}
        index={props.newIndex}
        type={props.type}
        checkId={props.checkId}
      />
    </>
  );
};

type Styles = {
  addIcon: CSSProperties;
};

const styles: Styles = {
  addIcon: {
    color: primary_green,
    height: 24,
  },
};
