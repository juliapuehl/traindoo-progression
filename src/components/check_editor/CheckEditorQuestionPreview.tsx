import {Typography} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {white} from '../../styles/colors';
import {CheckQuestionInputType} from '../../traindoo_shared/types/Check';
import {UnitIdType} from '../../traindoo_shared/units/UnitTypes';
import {CategoryPreview} from '../CategoryPreview';

type Props = {
  categoryId: string;
  questionName: string;
  question: string;
  questionType: CheckQuestionInputType;
  defaultValue: number;
  unit: UnitIdType;
  placeholder: string;
  answers: string[];
};

export const CheckEditorQuestionPreview = (props: Props) => {
  const generatePreview = () => {
    return (
      <CategoryPreview
        categoryId={props.categoryId}
        questions={[
          {
            name: props.questionName,
            id: '',
            question: props.question,
            type: props.questionType,
            defaultValue: props.defaultValue,
            unit: props.unit,
            placeholder: props.placeholder,
            answers: props.answers,
          },
        ]}
      />
    );
  };

  return (
    <div style={styles.preview}>
      <Typography
        id="modal-modal-title"
        variant="subtitle1"
        component="h2"
        textAlign="center"
        color={white}
      >
        {t('CHECKEDITOR_QUESTION_PREVIEW')}
      </Typography>
      {generatePreview()}
    </div>
  );
};

type Styles = {
  preview: CSSProperties;
};

const styles: Styles = {
  preview: {
    marginTop: 16,
  },
};
