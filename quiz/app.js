async function main() {
  const express = require("express");
  const http = require("http");
  const socketIo = require("socket.io");
  const cors = require("cors");

  const app = express();
  app.use(
    cors({
      origin: true, // Replace with the actual origin of your frontend
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
      Soru: "İlk programlanabilir bilgisayar fikrini ortaya atan ve bilgisayarın muciti olarak kabul edilen bilim insanı kimdir ?",
      A: "Wright kardeşler",
      B: "Charles Babbage",
      C: "Paul Dirac",
      D: "Thomas Hunt Morgan",
      Cevap: "Charles Babbage",
    },
    {
      Soru: "İnternet ilk olarak hangi alanda kullanılmıştır ?",
      A: "Bilim alanında kullanılmıştır",
      B: "Askeri alanda kullanılmıştır.",
      C: "Sağlık alanında kullanılmıştır.",
      D: "Eğitim alanında kullanılmıştır.",
      Cevap: "Askeri alanda kullanılmıştır.",
    },
    {
      Soru: "John Backus liderliğinde bir ekip tarafından geliştirilen başarılı ilk üst düzey programlama dili hangisidir ?",
      A: "FORTRAN",
      B: "LISP",
      C: "ALGOL",
      D: "COBOL",
      Cevap: "FORTRAN",
    },
    {
      Soru: "Speedtest tarafından açıklanan listede dünyanın en hızlı internet ortalamasına sahip ülke hangisidir?",
      A: "Tayland",
      B: "Çin",
      C: "Singapur",
      D: "ABD",
      Cevap: "Singapur",
    },
    {
      Soru: "İlk bilgisayar programcısı olarak kabul edilen İngiliz asıllı bilim insanı kimdir ?",
      A: "David Goodall",
      B: "John Frederic Daniell",
      C: "Roger Bacon",
      D: "Ada Lovelace",
      Cevap: "Ada Lovelace",
    },
    {
      Soru: "Dünyada genel olarak internet üzerinden en fazla arama yapılan arama motoru hangisidir ?",
      A: "Yandex",
      B: "Bing",
      C: "Google",
      D: "Baidu",
      Cevap: "Google",
    },
    {
      Soru: "Google'ın geliştiricilerinin orijinal bir imla değişikliği yaparak “Google” olarak adlandırdığı ismin kökeni olan matematik teriminin adı nedir?",
      A: "Googol",
      B: "Googl",
      C: "Googlo",
      D: "Goog",
      Cevap: "Googol",
    },
    {
      Soru: "İlk Kişisel Bilgisayar virüsü hangisidir?",
      A: "Trap Doors",
      B: "Conficker",
      C: "Brain",
      D: "Exploit.",
      Cevap: "Brain",
    },
    {
      Soru: "Google’ın bünyesinde bulunan Android ilk ne zaman piyasaya sunulmuştur?",
      A: "22 Ekim 2003",
      B: "14 Aralık 2000",
      C: "9 Temmuz 2010",
      D: "23 Eylül 2008",
      Cevap: "23 Eylül 2008",
    },

    {
      Soru: "Hangisi Google’ın güncel hizmetlerinden değildir?",
      A: "Google Maps",
      B: "Google Sheets",
      C: "Google Meet",
      D: "Google Play Music",
      Cevap: "Google Play Music",
    },
    {
      Soru: "Yaşar Üniversitesi Google Developer Student Clubs da 2023-2024 akademik döneminde Core Team de kaç kişi vardır?",
      A: "20",
      B: "18",
      C: "24",
      D: "22",
      Cevap: "24",
    },
    {
      Soru: "Araştırma şirketlerin verileri sonucu 2023 yılında dünya da en çok kullanılan yazılım dili hangisidir?",
      A: "C",
      B: "JavaScript",
      C: "Pyhton",
      D: "C++",
      Cevap: "JavaScript",
    },
    {
      Soru: "Hangisi Google’ın kurucularından biridir ? ",
      A: "Mark Zuckerberg",
      B: "Larry Page",
      C: "Sundar Pichai",
      D: "Andrew McCollu",
      Cevap: "Larry Page",
    },
    {
      Soru: "Google’ın yan kuruluşlarından olan YouTube’da en çok hangi video türleri izleniyor? ",
      A: "Makyaj Videoları",
      B: "Oyun Videoları",
      C: "Müzik Videoları",
      D: "Eğitim Videoları",
      Cevap: "Müzik Videoları",
    },
    {
      Soru: "Google’ın logosunda bulunan harflerin hangisinin rengi yanlış verilmiştir ? ",
      A: "G - mavi",
      B: "E - kırmızı",
      C: "L - sarı",
      D: "O - kırmızı",
      Cevap: "L - sarı",
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
          odalar[odaAdi].map((item) => item.username).includes(infos.username)
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
