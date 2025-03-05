import Avatar from '@mui/material/Avatar';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import BasicTextField from '../components/BasicTextField';
import ButtonCustom from '../components/Button';
import ImageUploadComponent from '../components/ImageUploadComponent';
import SimpleSelect from '../components/SimpleSelect';
import {useLogout} from '../hooks/useLogout';
import {
  getAthleteIds,
  getTrainerCode,
  getTrainerProfilePicture,
  getUserBusinessName,
  getUserDateFormat,
  getUserFirstName,
  getUserId,
  getUserLang,
  getUserLastName,
  getWeeklyNotificationSetting,
} from '../logic/firestore';
import {dark_gray, red, sidebar_color_dark, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {
  getUserLengthMeasurement,
  getUserVolumeMeasurement,
  getUserWeightMeasurement,
} from '../traindoo_shared/units/unitSelectors';
import {editAthleteWeeklyNotification} from '../utils/editingAthleteHelper';
import {
  editUserPersonalInformation,
  editUserPersonalInformationPublic,
  editUserWeeklyMailNotification,
} from '../utils/editingUserHelper';

const SettingsScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  const userId = useSelector(getUserId);
  const firstName = useSelector(getUserFirstName);
  const lastName = useSelector(getUserLastName);
  const measurement = useSelector(getUserWeightMeasurement);
  const lengthMeasurement = useSelector(getUserLengthMeasurement);
  const volumeMeasurement = useSelector(getUserVolumeMeasurement);
  const businessName = useSelector(getUserBusinessName);
  const trainerProfilePicture = useSelector(getTrainerProfilePicture);
  const trainerCode = useSelector(getTrainerCode);
  const userLang = useSelector(getUserLang);
  const userDateFormat = useSelector(getUserDateFormat);
  const weeklyNotificationSetting = useSelector(getWeeklyNotificationSetting);
  const logout = useLogout();
  const firestore = useFirestore();
  const athleteIds = useSelector(getAthleteIds);

  // const [error, setError] = useState("");
  const userLangString = userLang === 'de' ? t('GERMAN') : t('ENGLISH');
  const userDateFormatString =
    userDateFormat === 'us'
      ? t('SETTINGS_DATE_FORMAT_US')
      : t('SETTINGS_DATE_FORMAT_NORMAL');
  const [firstNameLocal, setFirstName] = useState(firstName);
  const [lastNameLocal, setLastName] = useState(lastName);
  const [businessNameLocal, setBusinessName] = useState(businessName);
  const [measurementLocal, setMeasurement] = useState(measurement);
  const [lengthMeasurementLocal, setLengthMeasurement] =
    useState(lengthMeasurement);
  const [volumeMeasurementLocal, setVolumeMeasurement] =
    useState(volumeMeasurement);
  const [languageLocal, setLanguage] = useState(userLangString);
  const [dateFormatLocal, setDateFormat] = useState(userDateFormatString);

  useEffect(() => {
    if (languageLocal !== userLangString) {
      setLanguage(userLangString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLangString]);
  useEffect(() => {
    if (dateFormatLocal !== userDateFormatString) {
      setDateFormat(userDateFormatString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLangString]);

  const handleChange = (value: string, key: string) => {
    editUserPersonalInformation(value, key, userId, firestore);
  };

  const handleChangePublic = (value: string, key: string) => {
    editUserPersonalInformationPublic(value, key, userId, firestore);
  };

  const handleWeeklyNotification = async (value: string) => {
    let tableOption = false;
    switch (value) {
      case 'false':
        tableOption = false;
        break;
      case 'true':
        tableOption = true;
        break;
    }
    await editUserWeeklyMailNotification(tableOption, userId, firestore);
    athleteIds.forEach((id) =>
      editAthleteWeeklyNotification(tableOption, id, firestore),
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        <div style={styles.contentContainer}>
          <div style={{...sharedStyle.textStyle.title1, ...styles.headline}}>
            {t('SETTINGS_TITLE')}
          </div>
          <Avatar src={trainerProfilePicture} sx={{width: 160, height: 160}} />
          <ImageUploadComponent />
          <div style={{...sharedStyle.textStyle.title2, ...styles.trainerCode}}>
            {t('SETTINGS_TRAINER_CODE', {code: trainerCode})}
          </div>
          <BasicTextField
            label={t('SETTINGS_FIRST_NAME')}
            autoComplete="given-name"
            value={firstNameLocal}
            onChange={setFirstName}
            onBlur={() => {
              if (firstNameLocal !== firstName) {
                handleChange(firstNameLocal, 'firstName');
              }
            }}
          />
          <BasicTextField
            value={lastNameLocal}
            label={t('SETTINGS_LAST_NAME')}
            autoComplete="family-name"
            onChange={setLastName}
            onBlur={() => {
              if (lastNameLocal !== lastName) {
                handleChange(lastNameLocal, 'lastName');
              }
            }}
          />
          <BasicTextField
            value={businessNameLocal}
            label={t('SETTINGS_BUSINESS')}
            onChange={setBusinessName}
            onBlur={() => {
              if (businessNameLocal !== businessName) {
                handleChange(businessNameLocal, 'trainer.businessName');
                handleChangePublic(businessNameLocal, 'trainer.businessName');
              }
            }}
          />
        </div>
        <div style={styles.contentContainer}>
          <div style={{...sharedStyle.textStyle.title1, ...styles.headline}}>
            {t('SETTINGS_TITLE_APP')}
          </div>
          <SimpleSelect
            style={styles.selector}
            value={measurementLocal}
            items={[
              {label: t('KG'), value: t('KG')},
              {label: t('LBS'), value: t('LBS')},
            ]}
            label={t('SETTINGS_MEASUREMENT')}
            onChange={(value: 'kg' | 'lbs') => {
              setMeasurement(value);
              if (value !== measurementLocal) {
                handleChange(value, 'measurement');
              }
            }}
          />
          <SimpleSelect
            style={styles.selector}
            value={lengthMeasurementLocal}
            items={[
              {label: t('SETTINGS_MEASUREMENT_METRIC'), value: 'metric'},
              {label: t('SETTINGS_MEASUREMENT_IMPERIAL'), value: 'imperial'},
            ]}
            label={t('SETTINGS_LENGTH_MEASUREMENT')}
            onChange={(value: 'metric' | 'imperial') => {
              setLengthMeasurement(value);
              if (value !== lengthMeasurementLocal) {
                handleChange(value, 'lengthMeasurement');
              }
            }}
          />
          <SimpleSelect
            style={styles.selector}
            value={volumeMeasurementLocal}
            items={[
              {label: t('SETTINGS_MEASUREMENT_METRIC'), value: 'metric'},
              {label: t('SETTINGS_MEASUREMENT_IMPERIAL'), value: 'imperial'},
            ]}
            label={t('SETTINGS_VOLUME_MEASUREMENT')}
            onChange={(value: 'metric' | 'imperial') => {
              setVolumeMeasurement(value);
              if (value !== volumeMeasurementLocal) {
                handleChange(value, 'volumeMeasurement');
              }
            }}
          />
          <SimpleSelect
            style={styles.selector}
            value={dateFormatLocal}
            items={[
              {
                label: t('SETTINGS_DATE_FORMAT_NORMAL'),
                value: t('SETTINGS_DATE_FORMAT_NORMAL'),
              },
              {
                label: t('SETTINGS_DATE_FORMAT_US'),
                value: t('SETTINGS_DATE_FORMAT_US'),
              },
            ]}
            label={t('SETTINGS_DATE_FORMAT')}
            onChange={(value) => {
              setDateFormat(value);
              if (value !== dateFormatLocal) {
                switch (value) {
                  case t('SETTINGS_DATE_FORMAT_NORMAL'):
                    handleChange('normal', 'trainer.settings.dateFormat');
                    break;
                  case t('SETTINGS_DATE_FORMAT_US'):
                    handleChange('us', 'trainer.settings.dateFormat');
                    break;
                }
              }
            }}
          />
          <SimpleSelect
            style={styles.selector}
            items={[
              {
                label: t('SETTINGS_ATHLETE_WEEKLY_NOTIFICATION_ON'),
                value: 'true',
              },
              {
                label: t('SETTINGS_ATHLETE_WEEKLY_NOTIFICATION_OFF'),
                value: 'false',
              },
            ]}
            value={weeklyNotificationSetting.toString()}
            label={t('SETTINGS_ATHLETE_WEEKLY_NOTIFICATION')}
            onChange={(value) => {
              handleWeeklyNotification(value);
            }}
          />
          <SimpleSelect
            style={styles.selector}
            value={languageLocal}
            items={[
              {label: t('GERMAN'), value: t('GERMAN')},
              {label: t('ENGLISH'), value: t('ENGLISH')},
            ]}
            label={t('SETTINGS_LANGUAGE')}
            onChange={(value) => {
              setLanguage(value);
              if (value !== languageLocal) {
                // update({
                //   languageOverride: value === t('GERMAN') ? 'de' : 'en', // Replace with preferred language of user
                // });
                switch (value) {
                  case t('GERMAN'):
                    handleChange('de', 'trainer.settings.webLang');
                    break;
                  case t('ENGLISH'):
                    handleChange('en', 'trainer.settings.webLang');
                    break;
                }
              }
            }}
          />
        </div>
        {/* {error && (
          <Alert style={styles.alert} severity="error">
            {error}
          </Alert>
        )} */}
      </div>
      <div style={styles.dialog}>
        <ButtonCustom
          text={t('SETTINGS_LOGOUT')}
          color={red}
          onClick={logout}
        />
      </div>
    </div>
  );
};

type Styles = {
  list: CSSProperties;
  dialog: CSSProperties;
  main: CSSProperties;
  headline: CSSProperties;
  alert: CSSProperties;
  trainerCode: CSSProperties;
  container: CSSProperties;
  selector: CSSProperties;
  contentContainer: CSSProperties;
};

const styles: Styles = {
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: dark_gray,
    padding: 16,
  },
  dialog: {
    marginTop: 32,
    color: white,
    backgroundColor: sidebar_color_dark,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
    borderRadius: 10,
    maxWidth: 400,
  },
  headline: {
    marginBottom: 24,
    width: '100%',
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentContainer: {
    margin: 36,
    backgroundColor: sidebar_color_dark,
    width: 360,
    padding: 8,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alert: {
    marginBottom: 24,
    width: '100%',
  },
  trainerCode: {
    padding: 8,
    marginBottom: 24,
    width: '100%',
  },
  container: {
    paddingBottom: '50px',
    marginLeft: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selector: {
    marginBottom: 24,
  },
};

export default SettingsScreen;
