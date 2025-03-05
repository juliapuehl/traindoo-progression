import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getUser} from '../logic/firestore';

export const useUpdateIntercomUserInfo = () => {
  const user = useSelector(getUser);

  //@ts-ignore
  window.Intercom('boot', {
    app_id: process.env.REACT_APP_INTERCOM_ENV,
  });

  useEffect(() => {
    if (user) {
      const company = {
        company_id: user?.trainer.code,
        name: user?.trainer.businessName,
        size: -1,
        user_count: -1,
        monthly_spend: -1,
        plan: '-1',
      };

      if (user?.trainer.totalAthletes)
        company.size = parseInt(user?.trainer.totalAthletes);
      if (user?.trainer.totalActive) {
        company.user_count = user?.trainer.totalActive;
        company.monthly_spend = user?.trainer.totalActive * 8.5;
      }
      user?.trainer.enablePayment
        ? (company.plan = 'isPaying')
        : (company.plan = 'isNotPaying');
      //TODO: add userHash: https://app.intercom.com/a/apps/jurxct14/settings/identity-verification/webupdate({
      Intercom('update', {
        company: company,
        email: user.email,
        user_id: user.id,
        name: user?.firstName + ' ' + user?.lastName,
      });
    }
  }, [user]);
};
