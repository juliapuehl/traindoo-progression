import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {t} from 'i18n-js';
import _ from 'lodash';
import {CSSProperties, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getDailyCheckMediaQuestions,
  getDailyCheckValueQuestions,
  getDailyDashboardColorInfo,
  getUserId,
  webSettingsLayoutQuery,
} from '../logic/firestore';
import {
  light_gray,
  primary_green,
  ultra_dark_gray,
  white,
} from '../styles/colors';
import {generateColorDifferentFrom} from '../utils/colorFunctions';

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      // marginTop: -8,
    },
    // selected: { marginTop: 0 },
    select: {
      '&:after': {
        borderColor: primary_green,
      },
      '&:not(.Mui-disabled):hover::before': {
        borderColor: primary_green,
      },
    },
    icon: {
      fill: white,
    },
    root: {
      color: white,
      height: 40,
    },
    menu: {
      color: white,
      backgroundColor: ultra_dark_gray,
    },
    menuItem: {
      flex: 1,
      '&:hover': {
        backgroundColor: light_gray,
      },
    },
  }),
);

type Props = {
  checkKeys: Array<{categoryId: string; questionId: string}>;
  currentGraphKey: string;
  type: string;
};

export const KeyWordDropdown = (props: Props) => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const valueQuestions = useSelector(getDailyCheckValueQuestions);
  const imageQuestions = useSelector(getDailyCheckMediaQuestions);
  const questionColors = useSelector(getDailyDashboardColorInfo);
  const questions = props.type === 'media' ? imageQuestions : valueQuestions;
  const classes = useStyles();
  const [keyArray, setKeyArray] = useState(props.checkKeys);
  const changeObject = useRef({});
  const currentGraphKey = props.currentGraphKey;
  const checkKeyPath =
    'dailyCheckLayout.elements.' + currentGraphKey + '.checkKeys';
  const colorArrayPath = 'dailyCheckLayout.questionColors.';
  const addKey = (keyWord) => {
    if (keyArray?.length > 9) {
      return;
    }
    if (
      !keyArray ||
      (!keyArray?.includes({
        categoryId: keyWord.categoryId,
        questionId: keyWord.questionId,
      }) &&
        currentGraphKey)
    ) {
      const elementName = keyWord.questionId;
      if (
        !questionColors ||
        !Object.keys(questionColors).includes(elementName)
      ) {
        changeObject.current[colorArrayPath + elementName] =
          generateColorDifferentFrom(questionColors);
      }
      if (keyArray) {
        setKeyArray(keyArray.concat(keyWord));
      } else {
        setKeyArray([keyWord]);
      }
    } else {
      console.log(keyWord, 'is already in array');
    }
  };
  const removeKey = (keyWord) => {
    const newKeyArray = _.clone(keyArray);
    if (newKeyArray) {
      const index = newKeyArray?.findIndex(
        (element) =>
          element.categoryId === keyWord.categoryId &&
          element.questionId === keyWord.questionId,
      );
      if (index > -1) {
        newKeyArray.splice(index, 1);
        setKeyArray(newKeyArray);
      }
    }
  };

  const onClose = () => {
    if (!_.isEqual(keyArray, props.checkKeys)) {
      changeObject.current[checkKeyPath] = keyArray;
    }

    if (changeObject.current) {
      firestore.update(webSettingsLayoutQuery(userId), changeObject.current);
    }
  };

  const items = questions
    ? questions.map((question) => {
        return {
          value: {
            categoryId: question.categoryId,
            questionId: question.questionId,
          },
          label: question.label,
        };
      })
    : [];

  return (
    <div style={styles.container}>
      <FormControl fullWidth style={styles.form} margin="dense">
        <InputLabel
          title=""
          className={classes.label}
          style={styles.label}
          id="demo-simple-select-label"
        >
          {t('DASHBOARD_KEYWORDDROPDOWN_TITLE')}
        </InputLabel>
        <Select
          variant="filled"
          fullWidth
          className={classes.select}
          inputProps={{
            classes: {
              icon: classes.icon,
              root: classes.root,
            },
          }}
          onClose={onClose}
          value={[]}
          multiple
          style={styles.select}
          MenuProps={{
            classes: {paper: classes.menu},
          }}
        >
          {items.map((item, index) => {
            return (
              <div style={styles.item} key={index + item.label}>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => {
                    if (
                      !keyArray ||
                      keyArray?.findIndex(
                        (element) =>
                          element.questionId === item.value.questionId,
                      ) === -1
                    ) {
                      addKey(item.value);
                    } else {
                      removeKey(item.value);
                    }
                  }}
                >
                  <Checkbox
                    key={'checkbox' + index}
                    checked={
                      keyArray
                        ? keyArray.findIndex(
                            (element) =>
                              element.questionId === item.value.questionId,
                          ) !== -1
                        : false
                    }
                  />
                  <ListItemText
                    key={'ListItemText' + index}
                    primary={item.label}
                  />
                </MenuItem>
              </div>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

type Styles = {
  form: CSSProperties;
  label: CSSProperties;
  tag: CSSProperties;
  select: CSSProperties;
  tagContainer: CSSProperties;
  container: CSSProperties;
  item: CSSProperties;
};

const styles: Styles = {
  form: {
    width: 300,
  },
  label: {
    color: white,
  },
  select: {
    color: white,
    alignItems: 'flex-end',
    height: 40,
  },
  tag: {
    color: white,
    marginBottom: 4,
    borderWidth: 0,
    marginLeft: 2,
    marginRight: 2,
  },
  tagContainer: {
    marginLeft: 15,
    marginRight: 5,
    marginTop: 7,
  },
  container: {display: 'flex', flexDirection: 'row'},
  item: {display: 'flex', justifyContent: 'space-between'},
};
