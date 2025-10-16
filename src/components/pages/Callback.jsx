import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    if (window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSSOVerify("#authentication-callback");
    }
  }, []);
  
  return (
    <div id="authentication-callback"></div>
  );
};

export default Callback;