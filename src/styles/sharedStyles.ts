import {secondary_white, white} from './colors';
// import { medium_gray, primary_green, ultra_light_gray, white, secondary_white } from "./colors";

// type SharedTextStyle = {
//   text: TextStyle;
//   regular: TextStyle;
//   title1: TextStyle;
//   title2: TextStyle;
//   title3: TextStyle;
//   small1: TextStyle;
//   small2: TextStyle;
//   time_date: TextStyle;
//   time: TextStyle;
//   regular_small: TextStyle;
//   regular_big: TextStyle;
//   button: TextStyle;
// };

// type sharedViewStyle = {
//   flex1: ViewStyle;
//   fullHeight: ViewStyle;
// };

// const montserratRegular = 'Montserrat-Regular';
// const montserratBlack = 'Montserrat-Black';

// const montserratBold = 'Montserrat-Bold';
// const montserratSemiBold = 'Montserrat-SemiBold';
// const montserratMedium = 'Montserrat-Medium';
// const montserratLight = 'Montserrat-Light';
// const oswaldBold = 'Oswald-Bold';
// const oswaldRegular = 'Oswald-Regular';
// const robotoCondensedBold = 'RobotoCondensed-Bold';
// const damion = 'Damion';
// const sriracha = 'Sriracha';

const roboto = 'Roboto';

// interface Styles {
//   [key: string]: React.CSSProperties;
// }

export const sharedStyle = {
  textStyle: {
    // text: {
    //   fontFamily: robotoBold,
    // },
    title1: {
      fontFamily: roboto,
      fontWeight: 700,
      fontSize: 20,
      fontStyle: 'normal',
      // lineHeight: 25,
      letterSpacing: 0,
      color: white,
      // textTransform: "uppercase",
    },
    title2: {
      fontFamily: roboto,
      fontWeight: 700,
      fontSize: 14,
      fontStyle: 'normal',
      letterSpacing: 0,
      color: white,
    },
    primary_white_capital: {
      fontFamily: roboto,
      fontWeight: 700,
      fontSize: 14,
      // textTransform: 'uppercase',
      color: white,
    },
    secondary_white_capital: {
      fontFamily: roboto,
      fontWeight: 700,
      fontSize: 12,
      // textTransform: "uppercase",
      color: secondary_white,
    },

    // time_date: {
    //   fontFamily: robotoLight,
    //   fontSize: 13,
    //   fontStyle: "normal",
    //   //lineHeight: 13,
    //   letterSpacing: 0,
    //   color: ultra_light_gray,
    // },
    // title3: {
    //   fontFamily: robotoLight,
    //   fontSize: 14,
    //   fontStyle: "normal",
    //   letterSpacing: 0,
    //   color: primary_green,
    // },
    regular: {
      fontFamily: roboto,
      fontWeight: 300,
      fontSize: 14,
      fontStyle: 'normal',
      letterSpacing: 0,
      color: white,
    },
    regular_small: {
      fontFamily: roboto,
      fontWeight: 300,
      fontSize: 12,
      fontStyle: 'normal',
      letterSpacing: 0,
      color: white,
    },

    // regular_big: {
    //   fontFamily: robotoLight,
    //   fontSize: 17,
    //   fontStyle: "normal",
    //   letterSpacing: 0,
    //   color: white,
    // },
    // regular_small: {
    //   fontFamily: robotoLight,
    //   fontSize: 12,
    //   fontStyle: "normal",
    //   lineHeight: 12,
    //   letterSpacing: 0,
    //   color: white,
    // },
    // button: {
    //   fontFamily: robotoBold,
    //   fontSize: 17,
    //   fontStyle: "normal",
    //   lineHeight: 17,
    //   letterSpacing: 0,
    //   color: white,
    // },
    // small1: {
    //   fontFamily: robotoLight,
    //   fontSize: 12,
    //   fontStyle: "normal",
    //   lineHeight: 12,
    //   letterSpacing: 0,
    //   color: ultra_light_gray,
    // },
    // small2: {
    //   fontFamily: robotoLight,
    //   fontSize: 11,
    //   fontStyle: "normal",
    //   lineHeight: 11,
    //   letterSpacing: 0,
    //   color: medium_gray,
    // },
    // time: {
    //   fontFamily: robotoLight,
    //   fontSize: 13,
    //   fontStyle: "normal",
    //   lineHeight: 13,
    //   letterSpacing: 0,
    //   color: white,
    // },
  },
  viewStyle: {
    flex1: {
      flex: 1,
    },
    fullHeight: {
      height: '100%',
    },
  },
  // bodyStyle: {
  //   backgroundColor: ultra_dark_gray,
  // },
};
