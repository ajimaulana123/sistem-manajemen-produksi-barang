export const setLoggedIn = () => {
  localStorage.setItem('isLoggedIn', 'true');
};

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
}; 