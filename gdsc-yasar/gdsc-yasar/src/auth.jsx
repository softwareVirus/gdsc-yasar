export const fakeAuthProvider = {
  isAuthenticated: false,
  username: null,
  async signin(username) {
    await new Promise((r) => setTimeout(r, 500)); // fake delay
    fakeAuthProvider.isAuthenticated = true;
    fakeAuthProvider.username = username;
    fakeAuthProvider.admin = false;
    localStorage.setItem('user',JSON.stringify(fakeAuthProvider))
  },
  async signout() {
    await new Promise((r) => setTimeout(r, 500)); // fake delay
    fakeAuthProvider.isAuthenticated = false;
    fakeAuthProvider.username = "";
  },
};
