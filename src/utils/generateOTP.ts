const generateOTP = () => {
  return Math.floor(Math.random() * 1000000).toString();
};
export default generateOTP;
