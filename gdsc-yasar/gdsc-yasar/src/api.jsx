export const ApiProvider = {
    room: null,
    dashboard: [],
    numberOfQuestions: null,
    currentQuestion: null,
    hashkey: null,
    questionNumber: 0, 
    async setInfos(room, dashboard, numberOfQuestions, curretQuestion, hashkey) {
      await new Promise((r) => setTimeout(r, 500)); // fake delay
      ApiProvider.room = room;
      ApiProvider.dashboard = dashboard;
      this.numberOfQuestions = numberOfQuestions;
      this.currentQuestion = curretQuestion;
      this.hashkey = hashkey;
      localStorage.setItem('game_info',JSON.stringify(ApiProvider))
    },
    async signout() {
      await new Promise((r) => setTimeout(r, 500)); // fake delay
      fakeAuthProvider.isAuthenticated = false;
      fakeAuthProvider.username = "";
    },
  };
  