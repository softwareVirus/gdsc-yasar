let siralama = 0;
let admin = null;
socket.on("odaKatil", (infos) => {
  if (siralama === 0) {
    admin = {
      username: infos.username,
    };
    io.to(socket.id).emit("sıralama", siralama);
    siralama++;
    return;
  } else if (infos.username === admin.username) {
    odalar[infos.odaAdi] = [];
    //burada sıralama to yapman gerekmiyor oda oluşturma bu
    return;
  } else {
    let odaAdi = infos.odaAdi;
    let kullaniciAdi = infos.username;

    if (!odalar[odaAdi]) {
      odalar[odaAdi] = {};
    }

    if (!odalar[odaAdi][kullaniciAdi]) {
      odalar[odaAdi][kullaniciAdi] = [];
      odalar[odaAdi][kullaniciAdi].push({ puan: 0 });
      odalar[odaAdi][kullaniciAdi].push({ streak: 0 });
      io.to(socket.id).emit("sıralama", sıralama);
      sıralama++;
    } else {
      io.to(socket.id).emit("hataliAd", "hata");
    }
  }
});
