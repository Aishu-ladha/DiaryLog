// export const validateEmail = (email) => {
//     const regex = /^[^\s@] +@ [^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
// }
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };
  