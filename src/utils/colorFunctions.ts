import cd from 'color-difference';
import randomColor from 'randomcolor';

export const generateColorDifferentFrom = (existingColors: {
  [questionKey: string]: string;
}): string => {
  let newColor: string = randomColor({
    luminosity: 'light',
    hue: 'random',
  });

  let counter = 99;
  while (
    (Object.keys(existingColors).includes(newColor) ||
      Object.values(existingColors).findIndex((element: string) => {
        return cd.compare(element, newColor) < counter;
      }) !== -1) &&
    counter > 0
  ) {
    if (counter > 5) {
      newColor = randomColor({luminosity: 'light', hue: 'random'});
    } else {
      newColor = randomColor();
    }
    counter -= 1;
  }
  return newColor;
};
