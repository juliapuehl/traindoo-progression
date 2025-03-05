import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {useUserUnits} from '../../traindoo_shared/units/useUnits';
import BasicTextField from '../BasicTextField';
import SimpleSelect from '../SimpleSelect';

type Props = {
  defaultValue: string | number;
  setDefaultValue: (newValue: string | number) => void;
  unitType: string;
  setUnitType: (newValue: string) => void;
};

export const CheckEditorNumericInputQuestion = (props: Props) => {
  const units = useUserUnits();

  const handleChangeUnitType = (newUnitType: string) => {
    if (props.unitType !== newUnitType) {
      props.setUnitType(newUnitType);
      props.setDefaultValue('');
    }
  };

  return (
    <div style={styles.defaultValue}>
      <BasicTextField
        style={styles.defaultValueInput}
        onChange={props.setDefaultValue}
        value={props.defaultValue.toString()}
        label={t('CHECKEDITOR_INPUT_DEFAULT')}
        tooltip={t('CHECKEDITOR_INPUT_DEFAULT_INFORMATION')}
      />
      <SimpleSelect
        style={styles.unitInput}
        onChange={handleChangeUnitType}
        items={Object.values(units).map((unit) => {
          return {
            label: unit.label + ` (${unit.labelLong})`,
            value: unit.id,
          };
        })}
        value={props.unitType}
        label={t('CHECKEDITOR_INPUT_UNIT')}
        tooltip={t('CHECKEDITOR_INPUT_UNIT_INFORMATION')}
      />
    </div>
  );
};

type Styles = {
  defaultValue: CSSProperties;
  defaultValueInput: CSSProperties;
  unitInput: CSSProperties;
};

const styles: Styles = {
  defaultValue: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultValueInput: {
    marginBottom: -4,
    maxWidth: '45%',
  },
  unitInput: {
    maxWidth: '45%',
  },
};
