import {Book} from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import {t} from 'i18n-js';
import React, {CSSProperties, useState} from 'react';
import {dark_gray, ultra_light_gray} from '../styles/colors';
import {TemplateArrayType} from '../traindoo_shared/types/User';
import {AlertPopover} from './AlertPopover';
import IconWithTooltip from './IconWithTooltip';
import TemplateList from './TemplateList';

type Props = {
  elements: TemplateArrayType[];
  setAlert?: (msg: string) => void;
  pasteTemplate: (id: string) => void;
  deleteTemplate: (id: string, templateName: string) => void;
  loading?: boolean;
};
const FillFromTemplate = (props: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePaste = () => {
    props.pasteTemplate(templateId);
    handleClose();
    setShowAlert(false);
  };
  return (
    <div>
      <IconWithTooltip
        loading={props.loading}
        style={styles.icons}
        eventClick={handleClick}
        muiIcon={Book}
        description={t('PLANNING_DAY_TEMPLATE_ICON_OPEN')}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div style={styles.popover}>
          <TemplateList
            deleteTemplate={props.deleteTemplate}
            elements={props.elements}
            onClick={(newId: string) => {
              setShowAlert(true);
              setTemplateId(newId);
            }}
          />
        </div>
      </Popover>
      <AlertPopover
        open={showAlert}
        confirm={handlePaste}
        handleClose={() => setShowAlert(false)}
        abort={handleClose}
        confirmText={t('PLANNING_DAY_TEMPLATE_ALERT_CONFIRM')}
        headline={t('PLANNING_DAY_TEMPLATE_ALERT_TITLE')}
        text={t('PLANNING_DAY_TEMPLATE_ALERT_TEXT')}
        abortText={t('PLANNING_DAY_TEMPLATE_ALERT_CANCEL')}
      />
    </div>
  );
};

type Styles = {
  icons: CSSProperties;
  popover: CSSProperties;
  button: CSSProperties;
};

const styles: Styles = {
  icons: {
    color: ultra_light_gray,
    height: 24,
  },
  popover: {
    color: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    backgroundColor: dark_gray,
    minWidth: 300,
  },
  button: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
};

export default FillFromTemplate;
