import {CSSProperties, useState} from 'react';
import {background_color_dark} from '../styles/colors';
import {TemplateArrayType} from '../traindoo_shared/types/User';
import {CheckTemplateType} from '../types/Check';
import {CheckEditOverview} from './CheckEditOverview';
import {CheckEditSelector} from './CheckEditSelector';

type Props = {
  handleDelete: (id: string, name: string) => void;
  checkId: string;
  checkArray: TemplateArrayType[];
  setSelectedCheckId: (id: string) => void;
  type: 'daily' | 'weekly' | 'generic';
  check: CheckTemplateType;
};
export const CheckEditor = (props: Props) => {
  const [showPreview, setShowPreview] = useState(true);

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };
  const handleDelete = (id: string, name: string) => {
    props.handleDelete(id, name);
  };
  const setSelectedCheckId = (newValue: string) => {
    props.setSelectedCheckId(newValue);
  };
  return (
    <div style={styles.main}>
      <CheckEditSelector
        handleDelete={handleDelete}
        setShowPreview={handlePreview}
        showPreview={showPreview}
        checkId={props.checkId}
        checkArray={props.checkArray}
        setSelectedCheckId={setSelectedCheckId}
        type={props.type}
      />
      <CheckEditOverview
        showPreview={showPreview}
        check={props.check}
        type={props.type}
      />
    </div>
  );
};

type Styles = {
  main: CSSProperties;
};

const styles: Styles = {
  main: {
    backgroundColor: background_color_dark,
    paddingBottom: 200,
  },
};
