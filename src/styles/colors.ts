export const orange = '#ffba4d';
export const red = '#f56868';
export const blue = '#2196F3';

export const white = '#ffffff';
export const secondary_white = '#ffffff';

export const primary_green = '#21BF89';
export const new_green = '#29A87C';

export const ultra_light_gray = '#979f9c';
export const light_gray = '#707070';
export const medium_gray = '#4D4D4D';
export const dark_gray = '#434343';
export const ultra_dark_gray = '#222222';

export const background = '#000000';

export const background_color_dark = '#181c28';
export const hover_green = '#34a881';
export const overlay_gray = '#383d4d';
export const legend_light_gray = '#7882a2';
export const sidebar_color_dark = '#292d39';
export const light_green = '#21bf89';
export const tagsColorArray = [
  '#FFD954',
  '#F2AB39',
  '#028C6A',
  '#85B8CB',
  '#1D6A96',
  '#FE7773',
];
export const surveyColorArray = [
  '#C10606',
  '#F2AB39',
  '#FFD954',
  '#A9D54A',
  '#53C905',
];
export const graphColors = [
  '#45b0cf',
  '#ce4549',
  '#66b74a',
  '#9760ca',
  '#bfaf43',
  '#7380cb',
  '#db7a38',
  '#53ae80',
  '#ce51a0',
  '#678138',
  '#bf6a83',
  '#a97640',
];
export const twoSurveyColorArray = [surveyColorArray[0], surveyColorArray[4]];
export const threeSurveyColorArray = [
  surveyColorArray[0],
  surveyColorArray[2],
  surveyColorArray[4],
];
export const fourSurveyColorArray = [
  surveyColorArray[0],
  surveyColorArray[1],
  surveyColorArray[3],
  surveyColorArray[4],
];
export const fiveSurveyColorArray = [
  surveyColorArray[0],
  surveyColorArray[1],
  surveyColorArray[2],
  surveyColorArray[3],
  surveyColorArray[4],
];
export const surveyColorSelector = (length: number) => {
  switch (length) {
    case 2:
      return twoSurveyColorArray;
    case 3:
      return threeSurveyColorArray;
    case 4:
      return fourSurveyColorArray;
    case 5:
      return fiveSurveyColorArray;
    default:
      return surveyColorArray;
  }
};

type rgb = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex: string): rgb {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: parseInt('0', 16),
        g: parseInt('0', 16),
        b: parseInt('0', 16),
      };
}

export function colorOpacity(hexColor: string, opacity: number): string {
  const rgb = hexToRgb(hexColor);
  if (opacity > 1) {
    opacity = opacity / 100;
  }
  const opacityString = opacity.toString();
  const result =
    'rgba(' +
    rgb.r.toString() +
    ',' +
    rgb.g.toString() +
    ',' +
    rgb.b.toString() +
    ',' +
    opacityString +
    ')';
  return result;
}

export function backgroundColorOpacity(opacity: number): string {
  return colorOpacity(background, opacity);
}
