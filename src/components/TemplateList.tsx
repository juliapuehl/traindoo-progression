import {Cancel} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties} from 'react';
import {
  dark_gray,
  ultra_dark_gray,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {TemplateArrayType} from '../traindoo_shared/types/User';
import IconWithTooltip from './IconWithTooltip';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: dark_gray,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,
    },
    list: {
      padding: 0,
      margin: 8,
      borderRadius: 3,
      boxShadow: '0 1px 2px',
      maxHeight: 300,
    },
    button: {
      color: white,
      backgroundColor: ultra_dark_gray,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: ultra_light_gray,
      },
    },
  }),
);

type Props = {
  elements?: TemplateArrayType[];
  onClick: (_: string) => void;
  isWeekTemplate?: boolean;
  deleteTemplate?: (templateId: string, templateName: string) => void;
};

const TemplateList = (props: Props) => {
  const classes = useStyles();

  const deleteTemplate = (id: string, name: string) => {
    props.deleteTemplate(id, name);
  };

  return (
    <div className={classes.root}>
      <List
        component="nav"
        aria-label="main mailbox folders"
        className={classes.list}
      >
        <div style={styles.headline}>
          {props.elements ? 'Templates' : 'No templates saved'}
        </div>
        {props.elements &&
          props.elements.map((item, index) => (
            <div style={styles.listItemContainer} key={'Template' + index}>
              <ListItem
                button
                className={classes.button}
                onClick={() => {
                  props.onClick(item.id);
                }}
              >
                <ListItemText primary={item.name} />
              </ListItem>
              <IconWithTooltip
                muiIcon={Cancel}
                style={styles.deleteIcon}
                onClick={() => {
                  deleteTemplate(item.id, item.name);
                }}
                description={`Delete Template "${item.name}"`}
              />
              {index === props.elements.length - 1 ? null : <Divider />}
            </div>
          ))}
      </List>
    </div>
  );
};

type Styles = {
  headline: CSSProperties;
  deleteIcon: CSSProperties;
  listItemContainer: CSSProperties;
};
const styles: Styles = {
  headline: {
    color: white,
  },
  deleteIcon: {
    color: ultra_light_gray,
    height: 24,
    marginLeft: 8,
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default TemplateList;
