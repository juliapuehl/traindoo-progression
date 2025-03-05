import {CSSProperties} from 'react';
import {primary_green} from '../styles/colors';
import {CheckTemplateType} from '../types/Check';
import {CheckCategoryAddIcon} from './CheckCategoryAddIcon';
import {CheckCategoryComponent} from './CheckCategoryComponent';
import {CheckEditorPreview} from './CheckEditorPreview';

type Props = {
  showPreview: boolean;
  check: CheckTemplateType;
  type: 'daily' | 'weekly' | 'generic';
};

export const CheckEditOverview = (props: Props) => {
  const check = props.check;

  const generateCategories = () => {
    let categories = [];

    if (check?.categories) {
      categories = Object.values(check.categories)
        .sort((a, b) => a.index - b.index)
        .map((category) => (
          <div key={'category' + category?.id}>
            <CheckCategoryComponent
              category={category}
              checkNotEditable={check?.notEditable}
              checkId={check?.id}
              type={props.type}
            />
            {!check?.notEditable && (
              <CheckCategoryAddIcon
                newIndex={category.index + 1}
                type={props.type}
                checkId={check?.id}
              />
            )}
          </div>
        ));
    }
    return (
      <div style={styles.categoryContainer}>
        {!check?.notEditable && (
          <CheckCategoryAddIcon
            newIndex={0}
            type={props.type}
            checkId={check?.id}
          />
        )}
        {categories}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {generateCategories()}
      {props.showPreview ? (
        <CheckEditorPreview check={check} type={props.type} />
      ) : (
        <></>
      )}
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  addIcon: CSSProperties;
  categoryContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 8,
    marginLeft: 8,
    marginTop: 8,
  },
  addIcon: {
    color: primary_green,
    height: 24,
  },
  categoryContainer: {
    flex: 1,
  },
};
