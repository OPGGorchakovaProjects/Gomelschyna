// создание карты
var mymap = L.map('map').setView([52.4447, 31.0119], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Интерактивная карта ГГАЭК',
  maxZoom: 18
}).addTo(mymap);
mymap.attributionControl.setPrefix('');


// Получаем местоположение пользователя
//Объявление переменных для работы с марк.
const cancelFilter = document.getElementById('cancelFilter');
const culture = document.getElementById('culture');
const attractions = document.getElementById('attractions');
const starCity = document.getElementById('starCity');
const monuments = document.getElementById('monuments');
const celebrity = document.getElementById('celebrity');
const industry = document.getElementById('industry');
const museums = document.getElementById('museums');
const reserve = document.getElementById('reserve');
const rivers = document.getElementById('rivers');
const energy = document.getElementById('energy');
const myGeolocation = document.getElementById('MyGeolocation');


var markersCulture = [];
var markersAttractions = [];
var markersStarCity = [];
var markersMonuments = [];
var markersCelebrity = [];
var markersIndustry = [];
var markersMuseums = [];
var markersReserve = [];
var markersRivers = [];
var markersEnergy = [];


//Культурные ценности (ГОТОВО)
const blockModalCulture1 = document.getElementById('block-modal1');
const closeCulture1 = document.getElementById('close1-culture');
closeCulture1.addEventListener('click', function () {
  blockModalCulture1.classList.remove('active1_culture');
})

const blockModalCulture2 = document.getElementById('block-modal2');
const closeCulture2 = document.getElementById('close2-culture');
closeCulture2.addEventListener('click', function () {
  blockModalCulture2.classList.remove('active1_culture');
})

const blockModalCulture3 = document.getElementById('block-modal3');
const closeCulture3 = document.getElementById('close3-culture');
closeCulture3.addEventListener('click', function () {
  blockModalCulture3.classList.remove('active1_culture');
})

const blockModalCulture4 = document.getElementById('block-modal4');
const closeCulture4 = document.getElementById('close4-culture');
closeCulture4.addEventListener('click', function () {
  blockModalCulture4.classList.remove('active1_culture');
})

const blockModalCulture5 = document.getElementById('block-modal5');
const closeCulture5 = document.getElementById('close5-culture').addEventListener('click', function () {
  blockModalCulture5.classList.remove('active1_culture');
})

const blockModalCulture6 = document.getElementById('block-modal6');
const closeCulture6 = document.getElementById('close6-culture')
  .addEventListener('click', function () {
    blockModalCulture6.classList.remove('active1_culture');
  })


//Музеи (ГОТОВО)
const blockModalMuseums1 = document.getElementById('block-modal1-museums');
const closeMuseums1 = document.getElementById('close1-museums').addEventListener('click', function () {
  blockModalMuseums1.classList.remove('active1_culture');
})

const blockModalMuseums2 = document.getElementById('block-modal2-museums');
const closeMuseums2 = document.getElementById('close2-museums').addEventListener('click', function () {
  blockModalMuseums2.classList.remove('active1_culture');
})

const blockModalMuseums3 = document.getElementById('block-modal3-museums');
const closeMuseums3 = document.getElementById('close3-museums').addEventListener('click', function () {
  blockModalMuseums3.classList.remove('active1_culture');
})

const blockModalMuseums4 = document.getElementById('block-modal4-museums');
const closeMuseums4 = document.getElementById('close4-museums').addEventListener('click', function () {
  blockModalMuseums4.classList.remove('active1_culture');
})

const blockModalMuseums5 = document.getElementById('block-modal5-museums');
const closeMuseums5 = document.getElementById('close5-museums').addEventListener('click', function () {
  blockModalMuseums5.classList.remove('active1_culture');
})

const blockModalMuseums6 = document.getElementById('block-modal6-museums');
const closeMuseums6 = document.getElementById('close6-museums').addEventListener('click', function () {
  blockModalMuseums6.classList.remove('active1_culture');
})

const blockModalMuseums7 = document.getElementById('block-modal7-museums');
const closeMuseums7 = document.getElementById('close7-museums').addEventListener('click', function () {
  blockModalMuseums7.classList.remove('active1_culture');
})

const blockModalMuseums8 = document.getElementById('block-modal8-museums');
const closeMuseums8 = document.getElementById('close8-museums').addEventListener('click', function () {
  blockModalMuseums8.classList.remove('active1_culture');
})

const blockModalMuseums9 = document.getElementById('block-modal9-museums');
const closeMuseums9 = document.getElementById('close9-museums').addEventListener('click', function () {
  blockModalMuseums9.classList.remove('active1_culture');
})

const blockModalMuseums10 = document.getElementById('block-modal10-museums');
const closeMuseums10 = document.getElementById('close10-museums').addEventListener('click', function () {
  blockModalMuseums10.classList.remove('active1_culture');
})
const blockModalMuseums11 = document.getElementById('block-modal11-museums');
const closeMuseums11 = document.getElementById('close11-museums').addEventListener('click', function () {
  blockModalMuseums11.classList.remove('active1_culture');
})
const blockModalMuseums12 = document.getElementById('block-modal12-museums');
const closeMuseums12 = document.getElementById('close12-museums').addEventListener('click', function () {
  blockModalMuseums12.classList.remove('active1_culture');
})
const blockModalMuseums13 = document.getElementById('block-modal13-museums');
const closeMuseums13 = document.getElementById('close13-museums').addEventListener('click', function () {
  blockModalMuseums13.classList.remove('active1_culture');
})
const blockModalMuseums14 = document.getElementById('block-modal14-museums');
const closeMuseums14 = document.getElementById('close14-museums').addEventListener('click', function () {
  blockModalMuseums14.classList.remove('active1_culture');
})
const blockModalMuseums15 = document.getElementById('block-modal15-museums');
const closeMuseums15 = document.getElementById('close15-museums').addEventListener('click', function () {
  blockModalMuseums15.classList.remove('active1_culture');
})
const blockModalMuseums16 = document.getElementById('block-modal16-museums');
const closeMuseums16 = document.getElementById('close16-museums').addEventListener('click', function () {
  blockModalMuseums16.classList.remove('active1_culture');
})
const blockModalMuseums17 = document.getElementById('block-modal17-museums');
const closeMuseums17 = document.getElementById('close17-museums').addEventListener('click', function () {
  blockModalMuseums17.classList.remove('active1_culture');
})
const blockModalMuseums18 = document.getElementById('block-modal18-museums');
const closeMuseums18 = document.getElementById('close18-museums').addEventListener('click', function () {
  blockModalMuseums18.classList.remove('active1_culture');
})
const blockModalMuseums19 = document.getElementById('block-modal19-museums');
const closeMuseums19 = document.getElementById('close19-museums').addEventListener('click', function () {
  blockModalMuseums19.classList.remove('active1_culture');
})

// Заповедники (ГОТОВО)
const blockModalReserve1 = document.getElementById('block-modal1-reserve');
const closeReserve1 = document.getElementById('close1-reserve').addEventListener('click', function () {
  blockModalReserve1.classList.remove('active1_culture');
})
const blockModalReserve2 = document.getElementById('block-modal2-reserve');
const closeReserve2 = document.getElementById('close2-reserve').addEventListener('click', function () {
  blockModalReserve2.classList.remove('active1_culture');
})
const blockModalReserve3 = document.getElementById('block-modal3-reserve');
const closeReserve3 = document.getElementById('close3-reserve').addEventListener('click', function () {
  blockModalReserve3.classList.remove('active1_culture');
})

//Реки и озера (ГОТОВО)
const blockModalRivers1 = document.getElementById('block-modal1-rivers');
const closeRivers1 = document.getElementById('close1-rivers').addEventListener('click', function () {
  blockModalRivers1.classList.remove('active1_culture');
})
const blockModalRivers2 = document.getElementById('block-modal2-rivers');
const closeRivers2 = document.getElementById('close2-rivers').addEventListener('click', function () {
  blockModalRivers2.classList.remove('active1_culture');
})
const blockModalRivers3 = document.getElementById('block-modal3-rivers');
const closeRivers3 = document.getElementById('close3-rivers').addEventListener('click', function () {
  blockModalRivers3.classList.remove('active1_culture');
})
const blockModalRivers4 = document.getElementById('block-modal4-rivers');
const closeRivers4 = document.getElementById('close4-rivers').addEventListener('click', function () {
  blockModalRivers4.classList.remove('active1_culture');
})
const blockModalRivers5 = document.getElementById('block-modal5-rivers');
const closeRivers5 = document.getElementById('close5-rivers').addEventListener('click', function () {
  blockModalRivers5.classList.remove('active1_culture');
})
const blockModalRivers6 = document.getElementById('block-modal6-rivers');
const closeRivers6 = document.getElementById('close6-rivers').addEventListener('click', function () {
  blockModalRivers6.classList.remove('active1_culture');
})
const blockModalRivers7 = document.getElementById('block-modal7-rivers');
const closeRivers7 = document.getElementById('close7-rivers').addEventListener('click', function () {
  blockModalRivers7.classList.remove('active1_culture');
})
const blockModalRivers8 = document.getElementById('block-modal8-rivers');
const closeRivers8 = document.getElementById('close8-rivers').addEventListener('click', function () {
  blockModalRivers8.classList.remove('active1_culture');
})
const blockModalRivers9 = document.getElementById('block-modal9-rivers');
const closeRivers9 = document.getElementById('close9-rivers').addEventListener('click', function () {
  blockModalRivers9.classList.remove('active1_culture');
})
const blockModalRivers10 = document.getElementById('block-modal10-rivers');
const closeRivers10 = document.getElementById('close10-rivers').addEventListener('click', function () {
  blockModalRivers10.classList.remove('active1_culture');
})
const blockModalRivers11 = document.getElementById('block-modal11-rivers');
const closeRivers11 = document.getElementById('close11-rivers').addEventListener('click', function () {
  blockModalRivers11.classList.remove('active1_culture');
})
const blockModalRivers12 = document.getElementById('block-modal12-rivers');
const closeRivers12 = document.getElementById('close12-rivers').addEventListener('click', function () {
  blockModalRivers12.classList.remove('active1_culture');
})
const blockModalRivers13 = document.getElementById('block-modal13-rivers');
const closeRivers13 = document.getElementById('close13-rivers').addEventListener('click', function () {
  blockModalRivers13.classList.remove('active1_culture');
})
const blockModalRivers14 = document.getElementById('block-modal14-rivers');
const closeRivers14 = document.getElementById('close14-rivers').addEventListener('click', function () {
  blockModalRivers14.classList.remove('active1_culture');
})
const blockModalRivers15 = document.getElementById('block-modal15-rivers');
const closeRivers15 = document.getElementById('close15-rivers').addEventListener('click', function () {
  blockModalRivers15.classList.remove('active1_culture');
})
const blockModalRivers16 = document.getElementById('block-modal16-rivers');
const closeRivers16 = document.getElementById('close16-rivers').addEventListener('click', function () {
  blockModalRivers16.classList.remove('active1_culture');
})
const blockModalRivers17 = document.getElementById('block-modal17-rivers');
const closeRivers17 = document.getElementById('close17-rivers').addEventListener('click', function () {
  blockModalRivers17.classList.remove('active1_culture');
})
const blockModalRivers18 = document.getElementById('block-modal18-rivers');
const closeRivers18 = document.getElementById('close18-rivers').addEventListener('click', function () {
  blockModalRivers18.classList.remove('active1_culture');
})
const blockModalRivers19 = document.getElementById('block-modal19-rivers');
const closeRivers19 = document.getElementById('close19-rivers').addEventListener('click', function () {
  blockModalRivers19.classList.remove('active1_culture');
})

// Промышленность (ГОТОВО)
const blockModalIndustry1 = document.getElementById('block-modal1-industry');
const closeIndustry1 = document.getElementById('close1-industry').addEventListener('click', function () {
  blockModalIndustry1.classList.remove('active1_culture');
})
const blockModalIndustry2 = document.getElementById('block-modal2-industry');
const closeIndustry2 = document.getElementById('close2-industry').addEventListener('click', function () {
  blockModalIndustry2.classList.remove('active1_culture');
})
const blockModalIndustry3 = document.getElementById('block-modal3-industry');
const closeIndustry3 = document.getElementById('close3-industry').addEventListener('click', function () {
  blockModalIndustry3.classList.remove('active1_culture');
})
const blockModalIndustry4 = document.getElementById('block-modal4-industry');
const closeIndustry4 = document.getElementById('close4-industry').addEventListener('click', function () {
  blockModalIndustry4.classList.remove('active1_culture');
})
const blockModalIndustry5 = document.getElementById('block-modal5-industry');
const closeIndustry5 = document.getElementById('close5-industry').addEventListener('click', function () {
  blockModalIndustry5.classList.remove('active1_culture');
})
const blockModalIndustry6 = document.getElementById('block-modal6-industry');
const closeIndustry6 = document.getElementById('close6-industry').addEventListener('click', function () {
  blockModalIndustry6.classList.remove('active1_culture');
})
const blockModalIndustry7 = document.getElementById('block-modal7-industry');
const closeIndustry7 = document.getElementById('close7-industry').addEventListener('click', function () {
  blockModalIndustry7.classList.remove('active1_culture');
})
const blockModalIndustry8 = document.getElementById('block-modal8-industry');
const closeIndustry8 = document.getElementById('close8-industry').addEventListener('click', function () {
  blockModalIndustry8.classList.remove('active1_culture');
})
const blockModalIndustry9 = document.getElementById('block-modal9-industry');
const closeIndustry9 = document.getElementById('close9-industry').addEventListener('click', function () {
  blockModalIndustry9.classList.remove('active1_culture');
})
const blockModalIndustry10 = document.getElementById('block-modal10-industry');
const closeIndustry10 = document.getElementById('close10-industry').addEventListener('click', function () {
  blockModalIndustry10.classList.remove('active1_culture');
})
const blockModalIndustry11 = document.getElementById('block-modal11-industry');
const closeIndustry11 = document.getElementById('close11-industry').addEventListener('click', function () {
  blockModalIndustry11.classList.remove('active1_culture');
})
const blockModalIndustry12 = document.getElementById('block-modal12-industry');
const closeIndustry12 = document.getElementById('close12-industry').addEventListener('click', function () {
  blockModalIndustry12.classList.remove('active1_culture');
})
const blockModalIndustry13 = document.getElementById('block-modal13-industry');
const closeIndustry13 = document.getElementById('close13-industry').addEventListener('click', function () {
  blockModalIndustry13.classList.remove('active1_culture');
})
const blockModalIndustry14 = document.getElementById('block-modal14-industry');
const closeIndustry14 = document.getElementById('close14-industry').addEventListener('click', function () {
  blockModalIndustry14.classList.remove('active1_culture');
})
const blockModalIndustry15 = document.getElementById('block-modal15-industry');
const closeIndustry15 = document.getElementById('close15-industry').addEventListener('click', function () {
  blockModalIndustry15.classList.remove('active1_culture');
})




// Старейшие города (ГОТОВО)
const blockModalCity1 = document.getElementById('block-modal1-city');
const closeCity1 = document.getElementById('close1-city').addEventListener('click', function () {
  blockModalCity1.classList.remove('active1_culture');
})
const blockModalCity2 = document.getElementById('block-modal2-city');
const closeCity2 = document.getElementById('close2-city').addEventListener('click', function () {
  blockModalCity2.classList.remove('active1_culture');
})
const blockModalCity3 = document.getElementById('block-modal3-city');
const closeCity3 = document.getElementById('close3-city').addEventListener('click', function () {
  blockModalCity3.classList.remove('active1_culture');
})
const blockModalCity4 = document.getElementById('block-modal4-city');
const closeCity4 = document.getElementById('close4-city').addEventListener('click', function () {
  blockModalCity4.classList.remove('active1_culture');
})



// Знаменитые люди
const blockModalPeople1 = document.getElementById('block-modal1-people');
const closePeople1 = document.getElementById('close1-people').addEventListener('click', function () {
  blockModalPeople1.classList.remove('active1_culture');
})

const blockModalPeople2 = document.getElementById('block-modal2-people');
const closePeople2 = document.getElementById('close2-people').addEventListener('click', function () {
  blockModalPeople2.classList.remove('active1_culture');
})

const blockModalPeople3 = document.getElementById('block-modal3-people');
const closePeople3 = document.getElementById('close3-people').addEventListener('click', () => {
  blockModalPeople3.classList.remove('active1_culture');
})

const blockModalPeople4 = document.getElementById('block-modal4-people');
const closePeople4 = document.getElementById('close4-people').addEventListener('click', function () {
  blockModalPeople4.classList.remove('active1_culture');
})

const blockModalPeople5 = document.getElementById('block-modal5-people');
const closePeople5 = document.getElementById('close5-people').addEventListener('click', function () {
  blockModalPeople5.classList.remove('active1_culture');
})

const blockModalPeople6 = document.getElementById('block-modal6-people');
const closePeople6 = document.getElementById('close6-people').addEventListener('click', function () {
  blockModalPeople6.classList.remove('active1_culture');
})

const blockModalPeople7 = document.getElementById('block-modal7-people');
const closePeople7 = document.getElementById('close7-people').addEventListener('click', function () {
  blockModalPeople7.classList.remove('active1_culture');
})

const blockModalPeople8 = document.getElementById('block-modal8-people');
const closePeople8 = document.getElementById('close8-people').addEventListener('click', function () {
  blockModalPeople8.classList.remove('active1_culture');
})

const blockModalPeople9 = document.getElementById('block-modal9-people');
const closePeople9 = document.getElementById('close9-people').addEventListener('click', function () {
  blockModalPeople9.classList.remove('active1_culture');
})

const blockModalPeople10 = document.getElementById('block-modal10-people');
const closePeople10 = document.getElementById('close10-people').addEventListener('click', function () {
  blockModalPeople10.classList.remove('active1_culture');
})
const blockModalPeople11 = document.getElementById('block-modal11-people');
const closePeople11 = document.getElementById('close11-people').addEventListener('click', function () {
  blockModalPeople11.classList.remove('active1_culture');
})
const blockModalPeople12 = document.getElementById('block-modal12-people');
const closePeople12 = document.getElementById('close12-people').addEventListener('click', function () {
  blockModalPeople12.classList.remove('active1_culture');
})
const blockModalPeople13 = document.getElementById('block-modal13-people');
const closePeople13 = document.getElementById('close13-people').addEventListener('click', function () {
  blockModalPeople13.classList.remove('active1_culture');
})
const blockModalPeople14 = document.getElementById('block-modal14-people');
const closePeople14 = document.getElementById('close14-people').addEventListener('click', function () {
  blockModalPeople14.classList.remove('active1_culture');
})
const blockModalPeople15 = document.getElementById('block-modal15-people');
const closePeople15 = document.getElementById('close15-people').addEventListener('click', function () {
  blockModalPeople15.classList.remove('active1_culture');
})
const blockModalPeople16 = document.getElementById('block-modal16-people');
const closePeople16 = document.getElementById('close16-people').addEventListener('click', function () {
  blockModalPeople16.classList.remove('active1_culture');
})
const blockModalPeople17 = document.getElementById('block-modal17-people');
const closePeople17 = document.getElementById('close17-people').addEventListener('click', function () {
  blockModalPeople17.classList.remove('active1_culture');
})
const blockModalPeople18 = document.getElementById('block-modal18-people');
const closePeople18 = document.getElementById('close18-people').addEventListener('click', function () {
  blockModalPeople18.classList.remove('active1_culture');
})
const blockModalPeople19 = document.getElementById('block-modal19-people');
const closePeople19 = document.getElementById('close19-people').addEventListener('click', function () {
  blockModalPeople19.classList.remove('active1_culture');
})
const blockModalPeople20 = document.getElementById('block-modal19-people');
const closePeople20 = document.getElementById('close20-people').addEventListener('click', function () {
  blockModalPeople20.classList.remove('active1_culture');
})

// Памятники
const blockModalMonuments1 = document.getElementById('block-modal1-monuments');
const closeMonuments1 = document.getElementById('close1-monuments').addEventListener('click', function () {
  blockModalMonuments1.classList.remove('active1_culture');
})
const blockModalMonuments2 = document.getElementById('block-modal2-monuments');
const closeMonuments2 = document.getElementById('close2-monuments').addEventListener('click', function () {
  blockModalMonuments2.classList.remove('active1_culture');
})
const blockModalMonuments3 = document.getElementById('block-modal3-monuments');
const closeMonuments3 = document.getElementById('close3-monuments').addEventListener('click', function () {
  blockModalMonuments3.classList.remove('active1_culture');
})
const blockModalMonuments4 = document.getElementById('block-modal4-monuments');
const closeMonuments4 = document.getElementById('close4-monuments').addEventListener('click', function () {
  blockModalMonuments4.classList.remove('active1_culture');
})
const blockModalMonuments5 = document.getElementById('block-modal5-monuments');
const closeMonuments5 = document.getElementById('close5-monuments').addEventListener('click', function () {
  blockModalMonuments5.classList.remove('active1_culture');
})
const blockModalMonuments6 = document.getElementById('block-modal6-monuments');
const closeMonuments6 = document.getElementById('close6-monuments').addEventListener('click', function () {
  blockModalMonuments6.classList.remove('active1_culture');
})
// const blockModalMonuments7 = document.getElementById('block-modal7-monuments');
// const closeMonuments7 = document.getElementById('close7-monuments').addEventListener('click', function () {
//   blockModalMonuments7.classList.remove('active1_culture');
// })
const blockModalMonuments8 = document.getElementById('block-modal8-monuments');
const closeMonuments8 = document.getElementById('close8-monuments').addEventListener('click', function () {
  blockModalMonuments8.classList.remove('active1_culture');
})
const blockModalMonuments9 = document.getElementById('block-modal9-monuments');
const closeMonuments9 = document.getElementById('close9-monuments').addEventListener('click', function () {
  blockModalMonuments9.classList.remove('active1_culture');
})
const blockModalMonuments10 = document.getElementById('block-modal10-monuments');
const closeMonuments10 = document.getElementById('close10-monuments').addEventListener('click', function () {
  blockModalMonuments10.classList.remove('active1_culture');
})
const blockModalMonuments11 = document.getElementById('block-modal11-monuments');
const closeMonuments11 = document.getElementById('close11-monuments').addEventListener('click', function () {
  blockModalMonuments11.classList.remove('active1_culture');
})
const blockModalMonuments12 = document.getElementById('block-modal12-monuments');
const closeMonuments12 = document.getElementById('close12-monuments').addEventListener('click', function () {
  blockModalMonuments12.classList.remove('active1_culture');
})
const blockModalMonuments13 = document.getElementById('block-modal13-monuments');
const closeMonuments13 = document.getElementById('close13-monuments').addEventListener('click', function () {
  blockModalMonuments13.classList.remove('active1_culture');
})
const blockModalMonuments14 = document.getElementById('block-modal14-monuments');
const closeMonuments14 = document.getElementById('close14-monuments').addEventListener('click', function () {
  blockModalMonuments14.classList.remove('active1_culture');
})
const blockModalMonuments15 = document.getElementById('block-modal15-monuments');
const closeMonuments15 = document.getElementById('close15-monuments').addEventListener('click', function () {
  blockModalMonuments15.classList.remove('active1_culture');
})
const blockModalMonuments16 = document.getElementById('block-modal16-monuments');
const closeMonuments16 = document.getElementById('close16-monuments').addEventListener('click', function () {
  blockModalMonuments16.classList.remove('active1_culture');
})
const blockModalMonuments17 = document.getElementById('block-modal17-monuments');
const closeMonuments17 = document.getElementById('close17-monuments').addEventListener('click', function () {
  blockModalMonuments17.classList.remove('active1_culture');
})
const blockModalMonuments18 = document.getElementById('block-modal18-monuments');
const closeMonuments18 = document.getElementById('close18-monuments').addEventListener('click', function () {
  blockModalMonuments18.classList.remove('active1_culture');
})
const blockModalMonuments19 = document.getElementById('block-modal19-monuments');
const closeMonuments19 = document.getElementById('close19-monuments').addEventListener('click', function () {
  blockModalMonuments19.classList.remove('active1_culture');
})
const blockModalMonuments20 = document.getElementById('block-modal20-monuments');
const closeMonuments20 = document.getElementById('close20-monuments').addEventListener('click', function () {
  blockModalMonuments20.classList.remove('active1_culture');
})
const blockModalMonuments21 = document.getElementById('block-modal21-monuments');
const closeMonuments21 = document.getElementById('close21-monuments').addEventListener('click', function () {
  blockModalMonuments21.classList.remove('active1_culture');
})
const blockModalMonuments22 = document.getElementById('block-modal22-monuments');
const closeMonuments22 = document.getElementById('close22-monuments').addEventListener('click', function () {
  blockModalMonuments22.classList.remove('active1_culture');
})



//Функция для создание и скрытиеы маркеров (Культурные ценности)
function createMarkersCulture() {
  var pinkIcon = L.icon({
    // iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconUrl: './img/marker/pink.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker2 = L.marker([52.422281, 31.01690862691909], { icon: pinkIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalCulture2.classList.add('active1_culture');
  })
  var marker3 = L.marker([52.0524, 29.2448], { icon: pinkIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalCulture4.classList.add('active1_culture');
  })
  var marker4 = L.marker([52.6536, 28.5466], { icon: pinkIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalCulture5.classList.add('active1_culture');
  })
  var marker5 = L.marker([52.0709, 27.7303], { icon: pinkIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalCulture6.classList.add('active1_culture');
  })
  var marker6 = L.marker([52.9195, 30.9162], { icon: pinkIcon }).addTo(mymap);
  marker6.on('click', function () {
    blockModalCulture3.classList.add('active1_culture');
  })
  var marker7 = L.marker([52.2547, 31.0051], { icon: pinkIcon }).addTo(mymap);
  marker7.on('click', function () {
    blockModalCulture1.classList.add('active1_culture');
  })


  markersCulture.push(marker2, marker3, marker4, marker5, marker6, marker7);
}
culture.addEventListener('click', function () {
  createMarkersCulture();
})

//Функция для скрытия маркеров
function hideMarkersCulture() {
  for (var i = 0; i < markersCulture.length; i++) {
    mymap.removeLayer(markersCulture[i]);
  }
  markersCulture = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersCulture();
})



//Функция для создание и скрытие маркеров (Старейшие города)
function createMarkersStarCity() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/fiol.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker2 = L.marker([52.049019, 29.267301], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalCity1.classList.add('active1_culture');
  });
  var marker3 = L.marker([52.066329, 27.740578], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalCity2.classList.add('active1_culture');
  });
  var marker4 = L.marker([52.42416, 31.014281], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalCity3.classList.add('active1_culture');
  });
  var marker5 = L.marker([52.42416, 31.014281], { icon: fiolIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalCity4.classList.add('active1_culture');
  })
  markersStarCity.push(marker2, marker3, marker4, marker5);
}
starCity.addEventListener('click', function () {
  createMarkersStarCity();
})
//Функция для скрытия маркеров                           
function hideMarkersStarCity() {
  for (var i = 0; i < markersStarCity.length; i++) {
    mymap.removeLayer(markersStarCity[i]);
  }
  markersStarCity = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersStarCity();
})



//Функция для создание и скрытие маркеров (Знаменитые люди)
function createMarkersCelebrity() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/рр.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker1 = L.marker([52.42416, 31.014281], { icon: fiolIcon }).addTo(mymap);
  marker1.on('click', function () {
    blockModalPeople1.classList.add('active1_culture')
  });
  var marker2 = L.marker([52.421101, 31.31651], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalPeople2.classList.add('active1_culture')
  })
  var marker3 = L.marker([52.411504308776955, 30.936413715250897], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalPeople3.classList.add('active1_culture');
  })
  var marker4 = L.marker([52.506805, 30.768125], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalPeople4.classList.add('active1_culture');
  })
  var marker5 = L.marker([52.425687, 31.015081], { icon: fiolIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalPeople5.classList.add('active1_culture');
  })
  var marker6 = L.marker([51.940429, 30.790727], { icon: fiolIcon }).addTo(mymap);
  marker6.on('click', function () {
    blockModalPeople6.classList.add('active1_culture');
  })
  var marker7 = L.marker([52.467469, 31.024828], { icon: fiolIcon }).addTo(mymap);
  marker7.on('click', function () {
    blockModalPeople7.classList.add('active1_culture');
  })
  var marker8 = L.marker([52.392304073425706, 31.031741190416263], { icon: fiolIcon }).addTo(mymap);
  marker8.on('click', function () {
    blockModalPeople8.classList.add('active1_culture');
  })
  var marker9 = L.marker([52.351631, 30.981268], { icon: fiolIcon }).addTo(mymap);
  marker9.on('click', function () {
    blockModalPeople9.classList.add('active1_culture');
  })
  var marker10 = L.marker([52.716932, 30.567953], { icon: fiolIcon }).addTo(mymap);
  marker10.on('click', function () {
    blockModalPeople10.classList.add('active1_culture');
  })
  var marker11 = L.marker([52.456045, 31.024819], { icon: fiolIcon }).addTo(mymap);
  marker11.on('click', function () {
    blockModalPeople11.classList.add('active1_culture');
  })
  var marker12 = L.marker([52.54455, 30.984412], { icon: fiolIcon }).addTo(mymap);
  marker12.on('click', function () {
    blockModalPeople12.classList.add('active1_culture');
  })
  var marker13 = L.marker([52.294281, 31.187207], { icon: fiolIcon }).addTo(mymap);
  marker13.on('click', function () {
    blockModalPeople13.classList.add('active1_culture');
  })
  var marker14 = L.marker([52.103153, 31.195723], { icon: fiolIcon }).addTo(mymap);
  marker14.on('click', function () {
    blockModalPeople14.classList.add('active1_culture');
  })
  var marker15 = L.marker([52.512193, 30.579667], { icon: fiolIcon }).addTo(mymap);
  marker15.on('click', function () {
    blockModalPeople15.classList.add('active1_culture');
  })
  var marker16 = L.marker([52.291042, 31.091096], { icon: fiolIcon }).addTo(mymap);
  marker16.on('click', function () {
    blockModalPeople16.classList.add('active1_culture');
  })
  var marker17 = L.marker([52.42644396334201, 30.910669419847707], { icon: fiolIcon }).addTo(mymap);
  marker17.on('click', function () {
    blockModalPeople17.classList.add('active1_culture');
  })
  var marker18 = L.marker([52.437393, 31.021917], { icon: fiolIcon }).addTo(mymap);
  marker18.on('click', function () {
    blockModalPeople18.classList.add('active1_culture');
  })
  var marker19 = L.marker([52.43597165662238, 31.017551628519755], { icon: fiolIcon }).addTo(mymap);
  marker19.on('click', function () {
    blockModalPeople19.classList.add('active1_culture');
  })
  var marker20 = L.marker([52.43854200105717, 31.0052778400676], { icon: fiolIcon }).addTo(mymap);
  marker20.on('click', function () {
    blockModalPeople20.classList.add('active1_culture');
  })

  markersCelebrity.push(marker2, marker1, marker3, marker4, marker5, marker6, marker7, marker8,
    marker9, marker10, marker11, marker12, marker13, marker14, marker15, marker16,
    marker17, marker18, marker19, marker20);
}
celebrity.addEventListener('click', function () {
  createMarkersCelebrity();
})
//Функция для скрытия маркеров
function hideMarkersCelebrity() {
  for (var i = 0; i < markersCelebrity.length; i++) {
    mymap.removeLayer(markersCelebrity[i]);
  }
  markersCelebrity = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersCelebrity();
})

//Функция для создание и скрытие маркеров (Памятники)
function createMarkersMonuments() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker1 = L.marker([52.4375, 30.9879], { icon: fiolIcon }).addTo(mymap);
  marker1.on('click', function () {
    blockModalMonuments1.classList.add('active1_culture');
  });
  var marker2 = L.marker([52.408466669936885, 30.942220653924494], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalMonuments2.classList.add('active1_culture');
  });
  var marker3 = L.marker([52.42537072926501, 31.014093611229608], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalMonuments3.classList.add('active1_culture');
  });
  var marker4 = L.marker([52.56594695127275, 31.172897812475544], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalMonuments4.classList.add('active1_culture');
  });
  var marker5 = L.marker([53.0798, 30.0523], { icon: fiolIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalMonuments5.classList.add('active1_culture');
  });
  var marker6 = L.marker([51.940498, 30.806187], { icon: fiolIcon }).addTo(mymap);
  marker6.on('click', function () {
    blockModalMonuments6.classList.add('active1_culture');
  });
  // var marker7 = L.marker([53.02469631005897, 29.40056662057753], { icon: fiolIcon }).addTo(mymap);
  // marker7.on('click', function () {
  //   blockModalMonuments7.classList.add('active1_culture');
  // });
  var marker8 = L.marker([52.9636585454592, 29.77610363199134], { icon: fiolIcon }).addTo(mymap);
  marker8.on('click', function () {
    blockModalMonuments8.classList.add('active1_culture');
  });
  var marker9 = L.marker([52.4299, 30.9785], { icon: fiolIcon }).addTo(mymap);
  marker9.on('click', function () {
    blockModalMonuments9.classList.add('active1_culture');
  });
  var marker10 = L.marker([52.320617, 30.977432], { icon: fiolIcon }).addTo(mymap);
  marker10.on('click', function () {
    blockModalMonuments10.classList.add('active1_culture');
  });
  var marker11 = L.marker([52.425196561205574, 31.018950167807088], { icon: fiolIcon }).addTo(mymap);
  marker11.on('click', function () {
    blockModalMonuments11.classList.add('active1_culture');
  });
  var marker12 = L.marker([52.42998069432846, 31.012253869619673], { icon: fiolIcon }).addTo(mymap);
  marker12.on('click', function () {
    blockModalMonuments12.classList.add('active1_culture');
  });
  var marker13 = L.marker([52.43540233880747, 31.00845812388863], { icon: fiolIcon }).addTo(mymap);
  marker13.on('click', function () {
    blockModalMonuments13.classList.add('active1_culture');
  });
  var marker14 = L.marker([52.4328205043656, 30.999283102844274], { icon: fiolIcon }).addTo(mymap);
  marker14.on('click', function () {
    blockModalMonuments14.classList.add('active1_culture');
  });
  var marker15 = L.marker([52.484866609669474, 29.219696414043856], { icon: fiolIcon }).addTo(mymap);
  marker15.on('click', function () {
    blockModalMonuments15.classList.add('active1_culture');
  });
  var marker16 = L.marker([53.15778012042023, 30.459142669109493], { icon: fiolIcon }).addTo(mymap);
  marker16.on('click', function () {
    blockModalMonuments16.classList.add('active1_culture');
  });
  var marker17 = L.marker([52.674095647137065, 29.361819880750044], { icon: fiolIcon }).addTo(mymap);
  marker17.on('click', function () {
    blockModalMonuments17.classList.add('active1_culture');
  });
  var marker18 = L.marker([52.73603397001518, 29.679724403375054], { icon: fiolIcon }).addTo(mymap);
  marker18.on('click', function () {
    blockModalMonuments18.classList.add('active1_culture');
  });
  var marker19 = L.marker([52.429377075298746, 31.001237629572266], { icon: fiolIcon }).addTo(mymap);
  marker19.on('click', function () {
    blockModalMonuments19.classList.add('active1_culture');
  });
  var marker20 = L.marker([52.42601785918843, 31.01041071258157], { icon: fiolIcon }).addTo(mymap);
  marker20.on('click', function () {
    blockModalMonuments20.classList.add('active1_culture');
  });
  var marker21 = L.marker([52.384154658738666, 30.339875271233378], { icon: fiolIcon }).addTo(mymap);
  marker21.on('click', function () {
    blockModalMonuments21.classList.add('active1_culture');
  });
  var marker22 = L.marker([53.912716, 27.530818], { icon: fiolIcon }).addTo(mymap);
  marker22.on('click', function () {
    blockModalMonuments22.classList.add('active1_culture');
  });


  markersMonuments.push(marker1, marker2, marker3, marker4,
    marker5, marker6, marker8, marker9, marker10,
    marker11, marker12, marker13, marker14, marker15, marker16,
    marker17, marker18, marker19, marker20, marker21, marker22);
}

monuments.addEventListener('click', function () {
  createMarkersMonuments();
})


//Функция для скрытия маркеров
function hideMarkersMonuments() {
  for (var i = 0; i < markersMonuments.length; i++) {
    mymap.removeLayer(markersMonuments[i]);
  }
  markersMonuments = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersMonuments();
})


//Функция для создание и скрытие маркеров (Промышленность)
function createMarkersIndustry() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/map-marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker2 = L.marker([52.049019, 29.267301], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalIndustry1.classList.add('active1_culture')
  });
  var marker3 = L.marker([52.337514, 30.36524], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalIndustry2.classList.add('active1_culture')
  });
  var marker4 = L.marker([52.435016, 31.001247], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalIndustry3.classList.add('active1_culture')
  });
  var marker5 = L.marker([52.892256, 30.037822], { icon: fiolIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalIndustry4.classList.add('active1_culture')
  });
  var marker6 = L.marker([52.449816, 30.960203], { icon: fiolIcon }).addTo(mymap);
  marker6.on('click', function () {
    blockModalIndustry5.classList.add('active1_culture')
  });
  var marker7 = L.marker([52.434099, 30.866949], { icon: fiolIcon }).addTo(mymap);
  marker7.on('click', function () {
    blockModalIndustry6.classList.add('active1_culture')
  });
  var marker8 = L.marker([52.363171, 30.432164], { icon: fiolIcon }).addTo(mymap);
  marker8.on('click', function () {
    blockModalIndustry7.classList.add('active1_culture')
  });
  var marker9 = L.marker([52.441522, 31.005056], { icon: fiolIcon }).addTo(mymap);
  marker9.on('click', function () {
    blockModalIndustry8.classList.add('active1_culture')
  });
  var marker10 = L.marker([52.404413, 30.963194], { icon: fiolIcon }).addTo(mymap);
  marker10.on('click', function () {
    blockModalIndustry9.classList.add('active1_culture')
  });
  var marker11 = L.marker([52.467337, 30.985526], { icon: fiolIcon }).addTo(mymap);
  marker11.on('click', function () {
    blockModalIndustry10.classList.add('active1_culture')
  });
  var marker12 = L.marker([52.38521893775484, 31.021035988912487], { icon: fiolIcon }).addTo(mymap);
  marker12.on('click', function () {
    blockModalIndustry11.classList.add('active1_culture');
  })
  var marker13 = L.marker([52.437026, 30.988212], { icon: fiolIcon }).addTo(mymap);
  marker13.on('click', function () {
    blockModalIndustry12.classList.add('active1_culture');
  })
  var marker14 = L.marker([52.454695, 30.916706], { icon: fiolIcon }).addTo(mymap);
  marker14.on('click', function () {
    blockModalIndustry13.classList.add('active1_culture');
  })
  var marker15 = L.marker([52.38331784235684, 31.024568255294778], { icon: fiolIcon }).addTo(mymap);
  marker15.on('click', function () {
    blockModalIndustry14.classList.add('active1_culture');
  })
  var marker16 = L.marker([52.424051, 30.98311], { icon: fiolIcon }).addTo(mymap);
  marker16.on('click', function () {
    blockModalIndustry15.classList.add('active1_culture');
  })



  markersIndustry.push(marker2, marker3, marker4, marker5,
    marker6, marker7, marker8, marker9,
    marker10, marker11, marker12, marker13,
    marker14, marker15, marker16);
}
industry.addEventListener('click', function () {
  createMarkersIndustry();
})
//Функция для скрытия маркеров
function hideMarkersIndustry() {
  for (var i = 0; i < markersIndustry.length; i++) {
    mymap.removeLayer(markersIndustry[i]);
  }
  markersIndustry = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersIndustry();
})

//Функция для создание и скрытие маркеров (Музеи)
function createMarkersMuseums() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker2 = L.marker([52.42846, 31.018764], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalMuseums1.classList.add('active1_culture')
  });
  var marker3 = L.marker([52.426494, 31.010598], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalMuseums2.classList.add('active1_culture');
  });
  var marker4 = L.marker([52.430843, 31.002864], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalMuseums3.classList.add('active1_culture');
  });
  var marker5 = L.marker([52.430843, 31.002864], { icon: fiolIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalMuseums4.classList.add('active1_culture');
  });
  var marker6 = L.marker([52.423523, 31.018198], { icon: fiolIcon }).addTo(mymap);
  marker6.on('click', function () {
    blockModalMuseums5.classList.add('active1_culture');
  });
  var marker7 = L.marker([52.419404, 30.99839], { icon: fiolIcon }).addTo(mymap);
  marker7.on('click', function () {
    blockModalMuseums6.classList.add('active1_culture');
  });
  var marker8 = L.marker([51.790203, 30.27035], { icon: fiolIcon }).addTo(mymap);
  marker8.on('click', function () {
    blockModalMuseums7.classList.add('active1_culture');
  });
  var marker9 = L.marker([52.558086, 31.171882], { icon: fiolIcon }).addTo(mymap);
  marker9.on('click', function () {
    blockModalMuseums8.classList.add('active1_culture');
  });
  var marker10 = L.marker([52.140207, 28.604551], { icon: fiolIcon }).addTo(mymap);
  marker10.on('click', function () {
    blockModalMuseums9.classList.add('active1_culture');
  });
  var marker11 = L.marker([51.80669, 29.149648], { icon: fiolIcon }).addTo(mymap);
  marker11.on('click', function () {
    blockModalMuseums10.classList.add('active1_culture');
  });
  var marker12 = L.marker([53.190154, 30.870973], { icon: fiolIcon }).addTo(mymap);
  marker12.on('click', function () {
    blockModalMuseums11.classList.add('active1_culture');
  });
  var marker13 = L.marker([52.049019, 29.267301], { icon: fiolIcon }).addTo(mymap);
  marker13.on('click', function () {
    blockModalMuseums12.classList.add('active1_culture');
  });
  var marker14 = L.marker([51.939741, 30.805666], { icon: fiolIcon }).addTo(mymap);
  marker14.on('click', function () {
    blockModalMuseums13.classList.add('active1_culture');
  });
  var marker15 = L.marker([53.080958, 30.051593], { icon: fiolIcon }).addTo(mymap);
  marker15.on('click', function () {
    blockModalMuseums14.classList.add('active1_culture');
  });
  var marker16 = L.marker([52.635204, 28.880522], { icon: fiolIcon }).addTo(mymap);
  marker16.on('click', function () {
    blockModalMuseums15.classList.add('active1_culture');
  });
  var marker17 = L.marker([51.805537, 29.49567], { icon: fiolIcon }).addTo(mymap);
  marker17.on('click', function () {
    blockModalMuseums16.classList.add('active1_culture');
  });
  var marker18 = L.marker([52.367564, 30.375085], { icon: fiolIcon }).addTo(mymap);
  marker18.on('click', function () {
    blockModalMuseums17.classList.add('active1_culture');
  });
  var marker19 = L.marker([52.629378, 29.758005], { icon: fiolIcon }).addTo(mymap);
  marker19.on('click', function () {
    blockModalMuseums18.classList.add('active1_culture');
  });
  var marker20 = L.marker([52.06737, 27.731433], { icon: fiolIcon }).addTo(mymap);
  marker20.on('click', function () {
    blockModalMuseums19.classList.add('active1_culture');
  });


  markersMuseums.push(marker2,
    marker3,
    marker4,
    marker5,
    marker6,
    marker7,
    marker8,
    marker9,
    marker10,
    marker11,
    marker12,
    marker13,
    marker14,
    marker15,
    marker16,
    marker17,
    marker18,
    marker19,
    marker20);
}
museums.addEventListener('click', function () {
  createMarkersMuseums();
})

//Функция для скрытия маркеров
function hideMarkersMuseums() {
  for (var i = 0; i < markersMuseums.length; i++) {
    mymap.removeLayer(markersMuseums[i]);
  }
  markersMuseums = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersMuseums();
})

//Функция для создание и скрытие маркеров (Заповедники)
function createMarkersReserve() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker2 = L.marker([52.13931361933129, 26.888946737837475], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalReserve1.classList.add('active1_culture');
  });
  var marker3 = L.marker([52.01708146469255, 30.800749591469188], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalReserve2.classList.add('active1_culture');
  });
  var marker4 = L.marker([51.614318194764316, 29.9390127656303], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalReserve3.classList.add('active1_culture');
  });
  markersReserve.push(marker2, marker3, marker4);
}
reserve.addEventListener('click', function () {
  createMarkersReserve();
})
//Функция для скрытия маркеров
function hideMarkersReserve() {
  for (var i = 0; i < markersReserve.length; i++) {
    mymap.removeLayer(markersReserve[i]);
  }
  markersReserve = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersReserve();
})

//Функция для создание и скрытие маркеров (Реки и озера)
function createMarkersRivers() {
  var fiolIcon = L.icon({
    iconUrl: './img/marker/blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var marker2 = L.marker([51.97933721615159, 30.80020867066181], { icon: fiolIcon }).addTo(mymap);
  marker2.on('click', function () {
    blockModalRivers1.classList.add('active1_culture');
  });
  var marker3 = L.marker([52.090304484041276, 27.718223733114574], { icon: fiolIcon }).addTo(mymap);
  marker3.on('click', function () {
    blockModalRivers2.classList.add('active1_culture');
  });
  var marker4 = L.marker([52.415912992481815, 31.014275297521973], { icon: fiolIcon }).addTo(mymap);
  marker4.on('click', function () {
    blockModalRivers3.classList.add('active1_culture');
  });
  var marker5 = L.marker([52.56126359228578, 30.114588022180637], { icon: fiolIcon }).addTo(mymap);
  marker5.on('click', function () {
    blockModalRivers4.classList.add('active1_culture');
  });
  var marker6 = L.marker([52.401408, 30.994608], { icon: fiolIcon }).addTo(mymap);
  marker6.on('click', function () {
    blockModalRivers5.classList.add('active1_culture');
  });
  var marker7 = L.marker([52.3366, 27.695482], { icon: fiolIcon }).addTo(mymap);
  marker7.on('click', function () {
    blockModalRivers6.classList.add('active1_culture');
  });
  var marker8 = L.marker([52.370209, 30.502610], { icon: fiolIcon }).addTo(mymap);
  marker8.on('click', function () {
    blockModalRivers7.classList.add('active1_culture');
  });
  var marker9 = L.marker([52.580068, 31.493218], { icon: fiolIcon }).addTo(mymap);
  marker9.on('click', function () {
    blockModalRivers8.classList.add('active1_culture');
  });
  var marker10 = L.marker([53.086291, 29.952940], { icon: fiolIcon }).addTo(mymap);
  marker10.on('click', function () {
    blockModalRivers9.classList.add('active1_culture');
  });
  var marker11 = L.marker([52.160592, 28.684959], { icon: fiolIcon }).addTo(mymap);
  marker11.on('click', function () {
    blockModalRivers10.classList.add('active1_culture');
  });
  var marker12 = L.marker([52.848351, 30.892667], { icon: fiolIcon }).addTo(mymap);
  marker12.on('click', function () {
    blockModalRivers11.classList.add('active1_culture');
  });
  var marker13 = L.marker([51.4436, 29.3558], { icon: fiolIcon }).addTo(mymap);
  marker13.on('click', function () {
    blockModalRivers12.classList.add('active1_culture');
  });
  var marker14 = L.marker([52.860874, 30.911038], { icon: fiolIcon }).addTo(mymap);
  marker14.on('click', function () {
    blockModalRivers13.classList.add('active1_culture');
  });
  var marker15 = L.marker([52.344903, 30.498118], { icon: fiolIcon }).addTo(mymap);
  marker15.on('click', function () {
    blockModalRivers14.classList.add('active1_culture');
  });
  var marker16 = L.marker([52.393896, 31.018261], { icon: fiolIcon }).addTo(mymap);
  marker16.on('click', function () {
    blockModalRivers15.classList.add('active1_culture');
  });
  var marker17 = L.marker([52.442334, 31.021441], { icon: fiolIcon }).addTo(mymap);
  marker17.on('click', function () {
    blockModalRivers16.classList.add('active1_culture');
  });
  var marker18 = L.marker([52.393863, 30.981223], { icon: fiolIcon }).addTo(mymap);
  marker18.on('click', function () {
    blockModalRivers17.classList.add('active1_culture');
  });
  var marker19 = L.marker([52.471232, 30.920318], { icon: fiolIcon }).addTo(mymap);
  marker19.on('click', function () {
    blockModalRivers18.classList.add('active1_culture');
  });
  var marker20 = L.marker([52.463628, 31.027145], { icon: fiolIcon }).addTo(mymap);
  marker20.on('click', function () {
    blockModalRivers19.classList.add('active1_culture');
  });



  markersRivers.push(marker2, marker3, marker4, marker5, marker6, marker7, marker8, marker9, marker10, marker11, marker12, marker13, marker14, marker15, marker16, marker17, marker18, marker19, marker20);
}
rivers.addEventListener('click', function () {
  createMarkersRivers();
})
//Функция для скрытия маркеров
function hideMarkersRivers() {
  for (var i = 0; i < markersRivers.length; i++) {
    mymap.removeLayer(markersRivers[i]);
  }
  markersRivers = [];
}
cancelFilter.addEventListener('click', function () {
  hideMarkersRivers();
})

//Функции модальных окон
const btnFiltr = document.getElementById('filtr');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');


btnFiltr.addEventListener('click', function () {
  modal.classList.add('active');
})
closeBtn.addEventListener('click', function () {
  modal.classList.remove('active');
})

const btnInfo = document.getElementById('info');
const blockModalInfo = document.getElementById('block-info');
const close2 = document.getElementById('close2');

btnInfo.addEventListener('click', function () {
  blockModalInfo.classList.add('active2');
})
close2.addEventListener('click', function () {
  blockModalInfo.classList.remove('active2');
})


// Route
const modalRoute = document.getElementById('block-route');
const btnRoute = document.getElementById('btn-route').addEventListener('click', function () {
  modalRoute.classList.add('active2');
})
const closeRoute = document.getElementById('close-route').addEventListener('click', function () {
  modalRoute.classList.remove('active2');
})

const sumbit = document.getElementById('submit').addEventListener('click', function () {
  var inputValueStartLat = parseFloat(document.getElementById('start-route-lat').value);
  var inputValueStartLng = parseFloat(document.getElementById('start-route-lng').value);
  var inputValueEndLat = parseFloat(document.getElementById('end-route-lat').value);
  var inputValueEndLng = parseFloat(document.getElementById('end-route-lng').value);

  var control = L.Routing.control({
    waypoints: [
      L.latLng(inputValueStartLat, inputValueStartLng), // Координаты начальной точки
      L.latLng(inputValueEndLat, inputValueEndLng) // Координаты конечной точки
    ]
  }).addTo(mymap);
  modalRoute.classList.remove('active2');
})

//Geolocation user
function geolocationUser() {
  mymap.locate({ setView: true, maxZoom: 16 });
  var userMarker = L.marker();
  function onLocationFound(e) {
    var latitude = e.latitude;
    var longitude = e.longitude;

    document.getElementById('start-route-lat').value = latitude;
    document.getElementById('start-route-lng').value = longitude;

    userMarker.setLatLng([latitude, longitude]);
    userMarker.bindPopup("<b>Ваше местоположение!</b>");
    userMarker.addTo(mymap);
  }

  mymap.on('locationfound', onLocationFound);
}
myGeolocation.addEventListener('click', geolocationUser);

//Geolocation map
function onMapClick(e) {
  var Endlatitude = e.latlng.lat;
  var Endlongitude = e.latlng.lng;

  document.getElementById('end-route-lat').value = Endlatitude;
  document.getElementById('end-route-lng').value = Endlongitude;

  userMarker.setLatLng([Endlatitude, Endlongitude]);
  var EndMarker = L.marker();

  control.setWaypoints([]);

}
mymap.on('click', onMapClick);

const btnMyGeo = document.getElementById('mygeo').addEventListener('click', geolocationUser);
// const cancelRouteBtn = document.getElementById('CancelSubmitRoute');

// function onCancelRouteClick() {
//   alert("Отмена маршрута на данный момент не работает");
//   control.setWaypoints([]);
// }
// cancelRouteBtn.addEventListener('click',onCancelRouteClick)


var myDiv = document.getElementById('block-route');
var isDragging = false;
var startX;
var startY;

myDiv.addEventListener('mousedown', function (event) {
  isDragging = true;
  startX = event.clientX - myDiv.offsetLeft;
  startY = event.clientY - myDiv.offsetTop;
});

document.addEventListener('mousemove', function (event) {
  if (isDragging) {
    var newLeft = event.clientX - startX;
    var newTop = event.clientY - startY;
    myDiv.style.left = newLeft + 'px';
    myDiv.style.top = newTop + 'px';
  }
});

document.addEventListener('mouseup', function () {
  isDragging = false;
});

document.querySelectorAll('.rating').forEach(dom => {
  let id = 'rating_' + dom.dataset.name;
  for (var i = 0; i < 5; i++)
    dom.innerHTML += `
      <label for=${id}_${i}></label>
      <input type=radio ${dom.dataset.value - 1 === i && 'checked' || ''} 
             name=${id} 
             id=${id}_${i} 
             onclick="ratingChanged('${dom.dataset.name}', ${i + 1})">`;
});

function ratingChanged(id, value) {
  console.log(id, value);
}
