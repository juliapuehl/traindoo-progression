import {useEffect} from 'react';
import {useTrackingSession} from './useTrackingSession';

export const useInactivityTracking = () => {
  const {registerUserActivity} = useTrackingSession();
  let inactiveTime = 0;

  const calcInactiveTime = () => {
    const timeLastActive = localStorage.getItem('timeLastActive');
    inactiveTime = Date.now() - Number(timeLastActive);
  };

  const updateTimeLastActive = () => {
    if (inactiveTime > 5000) {
      registerUserActivity('inactive', String(inactiveTime));
    }
    inactiveTime = 0;
    const timeLastActive = Date.now();
    localStorage.setItem('timeLastActive', String(timeLastActive));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      calcInactiveTime();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    updateTimeLastActive();
    window.addEventListener('mousemove', updateTimeLastActive);
    // window.addEventListener('scroll', updateTimeLastActive);
    window.addEventListener('keypress', updateTimeLastActive);
    window.addEventListener('click', updateTimeLastActive);
    return () => {
      window.removeEventListener('mousemove', updateTimeLastActive);
      // window.removeEventListener('scroll', updateTimeLastActive);
      window.removeEventListener('keypress', updateTimeLastActive);
      window.removeEventListener('click', updateTimeLastActive);
    };
  }, []);
};
