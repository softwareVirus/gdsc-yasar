async function main() {
  const express = require("express");
  const http = require("http");
  const socketIo = require("socket.io");
  const cors = require("cors");

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173", // Replace with the actual origin of your frontend
      methods: ["GET", "POST"], // Adjust as needed
      credentials: true, // Enable credentials (e.g., cookies)
    })
  );
  const server = http.createServer(app);
  const io = socketIo(server);

  // Enable CORS for all routes

  // Define a route
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  const odalar = {};
  let first = 0;

  let sorular = [
    {
      Soru: "Türkiye'nin başkenti neresidir?",
      A: "İstanbul",
      B: "Ankara",
      C: "Izmir",
      D: "Muş",
      Cevap: "Ankara",
    },
    {
      Soru: "2+2 Kaçtır?",
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      Cevap: "4",
    },
    {
      Soru: "Test?",
      A: "Test",
      B: "test..",
      C: "Test?",
      D: "Test!",
      Cevap: "Test",
    },
  ];
  let soruIndex = 0;
  let oyunBasladimi = "hayir";
  let siralama = 0;
  let countdownDuration = 100;
  let countdownTimer;
  let odaAdi = null;
  io.on("connection", (socket) => {
    socket.join("room");
    socket.on("odaKatil", (infos) => {
      if (siralama === 0) {
        admin = {
          username: infos.username,
        };
        io.to(socket.id).emit("siralama", siralama);
        siralama++;
      } else if (infos.username === admin.username) {
        if (odaAdi !== null) {
          io.to(socket.id).emit("hataliAd", "hata");
          return;
        }
        odalar[infos.odaAdi] = [];
        odaAdi = infos.odaAdi;
        //burada siralama to yapman gerekmiyor oda oluşturma bu
        io.to(socket.id).emit("odaOluştur", {
          room: infos.odaAdi,
          dashboard: [],
          numberOfQuestions: sorular.length,
          currentQuestion: sorular[soruIndex],
          hashkey: "heelo",
          questionNumber: soruIndex,
          answer: 2,
        });
      } else {
        if (
          odalar[odaAdi]
            .map((item) => item.username)
            .includes(infos.username)
        ) {
          io.to(socket.id).emit("hataliAd", "hata");
          return;
        }
        let kullaniciAdi = infos.username;

        if (!odalar[odaAdi]) {
          odalar[odaAdi] = [];
        }

        if (!odalar[odaAdi][kullaniciAdi]) {
          odalar[odaAdi].push({
            username: kullaniciAdi,
            puan: 0,
            streak: 0,
            answeredQuestionList: sorular.map((item) => 0),
          });
          console.log(odalar);
          io.to(socket.id).emit("siralama", siralama);
          io.in("room").emit(
            "updateDashboard",
            odalar[infos.odaAdi].map((item, index) => {
              console.log(item);
              return {
                username: item.username,
                ranking: index + 1,
              };
            })
          );
          siralama++;
        } else {
          io.to(socket.id).emit("hataliAd", "hata");
        }
      }
    });
    socket.on("start", () => {
      clearInterval(countdownTimer);
      countdownDuration = 100;
      countdownTimer = setInterval(() => {
        if (countdownDuration > 0) {
          countdownDuration -= 1;
          io.in("room").emit("timerUpdate", countdownDuration / 10); // Send timer update to all clients in the room
        } else {
          clearInterval(countdownTimer);
          io.in("room").emit("timerExpired"); // Signal that the timer has expired
        }
      }, 100);
      io.in("room").emit("sorugeldi", {
        room: odaAdi,
        dashboard: odalar[odaAdi].map((item, index) => {
          return {
            username: item.username,
            ranking: index + 1,
          };
        }),
        numberOfQuestions: sorular.length,
        currentQuestion: sorular[0],
        hashkey: "heelo",
        questionNumber: 1,
        answer: 2,
      });
      soruIndex++;
    });
    io.to(socket.id).emit("isTimerExpired", countdownDuration <= 0);
    socket.on("cevap", (valueler) => {
      if (
        odalar[odaAdi][
          odalar[odaAdi].map((item) => item.username).indexOf(valueler.username)
        ].answeredQuestionList[soruIndex - 1] != 0
      )
        return 0;
      if (valueler.cevap == true) {
        // cevap doğru ise ilk mi diye kontrol et
        if (first == 0) {
          // ilkse ekstra puan ver
          odalar[odaAdi][
            odalar[odaAdi]
              .map((item) => item.username)
              .indexOf(valueler.username)
          ].puan += 15;
          odalar[odaAdi][
            odalar[odaAdi]
              .map((item) => item.username)
              .indexOf(valueler.username)
          ].streak++;
          console.log(odalar[odaAdi]);
          first = 1; // başkası ilk olmasın
        } else {
          odalar[odaAdi][
            odalar[odaAdi]
              .map((item) => item.username)
              .indexOf(valueler.username)
          ].puan += 10; // ilk değilse normal puan ver streak ver
          odalar[odaAdi][
            odalar[odaAdi]
              .map((item) => item.username)
              .indexOf(valueler.username)
          ].streak++;
        }
      } // yanlış ise puan verme streak sıfırla
      else {
        odalar[odaAdi][
          odalar[odaAdi].map((item) => item.username).indexOf(valueler.username)
        ].streak = 0;
      }
      odalar[odaAdi][
        odalar[odaAdi].map((item) => item.username).indexOf(valueler.username)
      ].answeredQuestionList[soruIndex - 1] = 1;
    });

    socket.on("dashboard", () => {
      let kullanıcılar = odalar[odaAdi]
        .map((item) => {
          console.log(item);
          return {
            kullaniciAdi: item.username,
            puan: item.puan,
            streak: item.streak,
          };
        })
        .filter((item) => item.username !== admin.username);
      console.log(kullanıcılar);
      kullanıcılar = kullanıcılar
        .sort((a, b) => b.puan - a.puan)
        .map((item, s) => ({
          ...item,
          ranking: s + 1,
        })); // Puanlara göre sırala
      first = 0;
      io.in("room").emit("getDashboard", kullanıcılar); // Sıralanmış kullanıcıları gönder
    });

    socket.on("next", (value) => {
      if (soruIndex < sorular.length) {
        io.in("room").emit("next", sorular[soruIndex]); //öne yollaclearInterval(countdownTimer);
        countdownDuration = 100;
        countdownTimer = setInterval(() => {
          if (countdownDuration > 0) {
            countdownDuration -= 1;
            io.in("room").emit("timerUpdate", countdownDuration / 10); // Send timer update to all clients in the room
          } else {
            clearInterval(countdownTimer);
            io.in("room").emit("timerExpired"); // Signal that the timer has expired
          }
        }, 100);
        io.in("room").emit("sorugeldi", {
          room: odaAdi,
          dashboard: odalar[odaAdi]
            .sort((a, b) => b.puan - a.puan)
            .map((item, x) => {
              return {
                username: item.username,
                ranking: x + 1,
              };
            }),
          numberOfQuestions: sorular.length,
          currentQuestion: sorular[soruIndex],
          hashkey: "heelo",
          questionNumber: soruIndex + 1,
          answer: 2,
        });
        soruIndex++;
      } else {
        io.in("room").emit("bitti"); // sorular bittiyse öne bitti diye yolla oyun sonu ekranını ver.
      }
    });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
