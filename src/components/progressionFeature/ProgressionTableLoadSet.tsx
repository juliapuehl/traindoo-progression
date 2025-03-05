import {CSSProperties, useState} from 'react';
import {light_gray, white} from '../../styles/colors';
import {useCalculateLoadFrontend} from '../../traindoo_shared/units/useCalculateLoadFrontend';

type Props = {
  load?: number | string;
  handleChange: (value: string, index: number) => void;
  index: number;
};

export const ProgressionTableLoadSet = (props: Props) => {
  const calculateLoadFrontend = useCalculateLoadFrontend();
  const [value, setValue] = useState(calculateLoadFrontend(props.load));

  const handleChange = (newValue: string) => {
    setValue(newValue);
    props.handleChange(newValue, props.index);
  };
  return (
    <div style={{padding: 2}}>
      <input
        style={styles.inputField}
        value={value}
        type="text"
        onChange={(event) => handleChange(event.target.value)}
        id={'newLoad'}
      />
    </div>
  );
};

type Styles = {
  inputField: CSSProperties;
};

const styles: Styles = {
  inputField: {
    textAlign: 'center',
    width: 100,
    height: 30,
    fontWeight: 300,
    fontSize: 14,
    color: white,
    borderRadius: '0.5rem',
    backgroundColor: light_gray,
  },
};
