import {t} from 'i18n-js';
import React from 'react';

export type TextfieldType = 'Password' | 'Email';
export type ValidationType = {
  type: TextfieldType;
  valid: boolean;
  msg: string;
};

export const textfieldValidation = (
  event?: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  type?: string,
  input?: string,
) => {
  let switchCase;
  let value;
  if (type) {
    switchCase = type;
    value = input;
  } else {
    switchCase = event.target.type;
    value = event.target.value;
  }

  switch (switchCase) {
    case 'password':
      const pwRegex = /(?=.*[0-9a-zA-Z]).{6,}/;
      return {
        type: switchCase,
        valid: pwRegex.test(value),
        msg: pwRegex.test(value) ? '' : t('SIGN_UP_ERROR_PASSWORD'),
      };
    case 'email':
      const mailRegex = /[^@]+@[^@]+\.[^@]+/;
      const spacesRegex =
        // eslint-disable-next-line no-useless-escape
        /^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/;
      return {
        type: switchCase,
        valid: mailRegex.test(value) && spacesRegex.test(value),
        msg: mailRegex.test(value) ? '' : t('SIGN_UP_ERROR_MAIL_INVALID'),
      };
    default:
      return {type: switchCase, valid: true, msg: ''};
  }
};
