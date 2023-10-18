const express = require ('express')
const app = express();
const mongoose = require('mongoose');
const soru = require('./models/soru.model');
const pageRoute = require('./routes/page.route');


app.use(express.json());
app.use(express.urlencoded({extended: true}));


mongoose.connect('mongodb://127.0.0.1:27017').then(()=>
{
    console.log("DB bağlandı");
});

app.set('view engine', 'twig');


app.use("/", pageRoute);


app.get("/soru_kayit", async (req,res,next) =>{
    try {
        await soru.insertMany([
            {
               Soru: "Türkiye'nin başkenti neresidir?",
               A: "İstanbul",
               B: "Ankara",
               C: "Izmir",
               D: "Muş",
               Cevap: "Ankara"
            },
            {
                Soru: "2+2 Kaçtır?",
                A: "1",
                B: "2",
                C: "3",
                D: "4",
                Cevap: "4"
            },
            {
                Soru: "Test?",
                A: "Test",
                B: "test..",
                C: "Test?",
                D: "Test!",
                Cevap: "Test"
            }
        ])
        res.send("sorular saved successfully");
    
    } catch (error) {
            console.log("soru-kayit error: "+error);
        }
    })



const odalar = {};
let first = 0;

let sorular = await soru.distinct();
let index = 0;


io.on('connection', (socket) => {

    socket.on('odaKatil',(infos)=>{
        let odaAdi = infos.odaAdi;
        let kullaniciAdi = infos.username;
    
        if(!odalar[odaAdi])
        {
            odalar[odaAdi] = {};
        }
    
          if(!odalar[odaAdi][kullaniciAdi])
          {
            odalar[odaAdi][kullaniciAdi] = []
            odalar[odaAdi][kullaniciAdi].push({puan:0});
            odalar[odaAdi][kullaniciAdi].push({streak:0});
          }
          else
          {
            io.to(socket.id).emit("hataliAd","hata");
          }
           
    })
    
    socket.on("start", info => {
       io.in(info.odaAdi).emit("sorugeldi", sorular[0])
       index = 1;
    })
    
    socket.on("cevap", valueler =>{
    if(valueler.cevap == true)  // cevap doğru ise ilk mi diye kontrol et
    {
    if(first == 0)  // ilkse ekstra puan ver 
    {
    odalar[odaAdi][socket.id].puan+=15;
    odalar[odaAdi][socket.id].streak++;
    first = 1;     // başkası ilk olmasın
    
    }
    else
    {
    odalar[odaAdi][socket.id].puan+=10;    // ilk değilse normal puan ver streak ver
    odalar[odaAdi][socket.id].streak++;
    }
    
    
    }
    else   // yanlış ise puan verme streak sıfırla
    {
    odalar[odaAdi][socket.id].streak= 0;
    }
    
    
    })
    
    
    socket.on("dashboard", value => {
        const kullanıcılar = Object.entries(odalar[value.odaAdi]).map(([kullaniciAdi, kullanici]) => {
            return {
                kullaniciAdi: kullaniciAdi,
                puan: kullanici.puan,
                streak: kullanici.streak
            };
        });
    
        kullanıcılar.sort((a, b) => b.puan - a.puan); // Puanlara göre sırala
        io.in(value.odaAdi).emit("getDashboard", kullanıcılar); // Sıralanmış kullanıcıları gönder
    });
    
    socket.on("next",value =>  {
        if(index < sorular.length)
        {
            io.in("next",sorular[index])//öne yolla
            index++;
        }
        else
        {
            io.in("next","bitti"); // sorular bittiyse öne bitti diye yolla oyun sonu ekranını ver.
        }
    
    })
    
    
    
    
    })


    
const PORT = 80;
app.listen(PORT,()=>{
console.log(`App is running on ${PORT}`)
})
