import {CSSProperties} from 'react';
import {primary_green} from '../styles/colors';

export type PositionWithinSuperset =
  | 'notInSuperset'
  | 'firstExercise'
  | 'middleExercise'
  | 'lastExercise';

export const getExercisePositionWithinSuperset = (
  exerciseIndexWithinSuperset,
  supersetLength,
): PositionWithinSuperset => {
  if (supersetLength <= 1) {
    return 'notInSuperset';
  } else if (exerciseIndexWithinSuperset === 0) {
    return 'firstExercise';
  } else if (exerciseIndexWithinSuperset === supersetLength - 1) {
    return 'lastExercise';
  }
  return 'middleExercise';
};

export const getSupersetFrameStyleForHeadline = (
  position: PositionWithinSuperset,
) => {
  if (position === 'middleExercise' || position === 'lastExercise') {
    return {...styles.supersetFrame, ...styles.headlineSupersetFrame};
  }
  // no frame needed when exercise is the first one in superset or is not in superset at all
  return {};
};

export const getSupersetFrameStyle = (position: PositionWithinSuperset) => {
  switch (position) {
    case 'notInSuperset':
      return {};
    case 'firstExercise':
      return {
        ...styles.supersetFrame,
        ...styles.planningCardSupersetFrameFirst,
      };
    case 'middleExercise':
      return {
        ...styles.supersetFrame,
        ...styles.planningCardSupersetFrameMiddle,
      };
    case 'lastExercise':
      return {
        ...styles.supersetFrame,
        ...styles.planningCardSupersetFrameLast,
      };
  }
};

type Styles = {
  supersetFrame: CSSProperties;
  headlineSupersetFrame: CSSProperties;
  planningCardSupersetFrameFirst: CSSProperties;
  planningCardSupersetFrameMiddle: CSSProperties;
  planningCardSupersetFrameLast: CSSProperties;
};

const styles: Styles = {
  supersetFrame: {
    borderColor: primary_green,
    borderWidth: 2,
  },
  headlineSupersetFrame: {
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
  },
  planningCardSupersetFrameFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
  },
  planningCardSupersetFrameMiddle: {
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
  },
  planningCardSupersetFrameLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
  },
};
