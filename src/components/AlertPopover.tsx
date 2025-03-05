import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import {CSSProperties} from 'react';
import {primary_green, ultra_light_gray, white} from '../styles/colors';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Props = {
  confirm: () => void;
  abort?: () => void;
  handleClose: () => void;
  open: boolean;
  text: string;
  headline: string;
  confirmText: string;
  abortText: string;
  noCloseOnConfirm?: boolean;
};

export const AlertPopover = (props: Props) => {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.headline}
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            {props.text}
          </Typography>
          <div style={styles.buttonContainer}>
            <Button
              style={styles.cancel}
              onClick={() => {
                props.handleClose();
                if (props.abort) {
                  props.abort();
                }
              }}
            >
              {props.abortText}
            </Button>
            <Button
              style={styles.confirm}
              onClick={() => {
                if (!props.noCloseOnConfirm) {
                  props.handleClose();
                }
                props.confirm();
              }}
            >
              {props.confirmText}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirm: {
    color: white,
    background: ultra_light_gray,
  },
  cancel: {
    color: white,
    background: primary_green,
  },
};
