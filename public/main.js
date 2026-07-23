let params = new URLSearchParams(window.location.search);
const trainNumber = params.get("trainNumber");

const IMAGE_FOLDER = "./images/";
let TRAINS;
let WAGON_DATA;
const GENERIC_IMAGE = "generic-loco.gif";
const ROTATABLE = ["4111", "4121", "5111", "7121", "7123"];

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

if (trainNumber != null) {
  getTrainInfo(trainNumber);
}

async function importTrainData() {
  let data = await import("./data/trains.js");
  TRAINS = data.TRAINS;
  data = await fetch("./data/wagonTypes.json");
  data = await data.json();
  WAGON_DATA = data;
}

function getImageFromWagonDatabaseStrict(UICNumberString) {
  return getImageFromWagonSliceDatabase(UICNumberString, 0, 8);
}

function getImageFromWagonDatabaseLeniant(UICNumberString) {
  return getImageFromWagonSliceDatabase(UICNumberString, 2, 8);
}

function getImageFromWagonSliceDatabase(UICNumberString, sliceBegin, sliceEnd) {
  let img = GENERIC_IMAGE;
  let matcher = UICNumberString.slice(sliceBegin, sliceEnd);

  for (let i = WAGON_DATA.length - 1; i >= 0; i--) {
    const entry = WAGON_DATA[i];
    if (entry.uic.slice(sliceBegin, sliceEnd) == matcher) {
      img = "/api" + entry.image.slice(30);
      return {
        img: img,
        name: entry.kind.split("\n")[0],
        operator: entry.operator,
      };
    }
  }
}

function getImageFromUIC(UICNumberString, UICArray) {
  const unitNumber = parseInt(UICArray[3]);
  const classString = UICNumberString.slice(4, 8);
  const countryCodeString = UICArray[1];

  let img = GENERIC_IMAGE;
  let name = undefined;
  let operator = undefined;
  for (let country of TRAINS) {
    if (country.countryCode != countryCodeString) {
      continue;
    }
    operator = country.operator;
    for (let type of country.types) {
      if (!type.matchUIC(UICNumberString)) {
        continue;
      }
      for (let train of type.wagons) {
        if (classString != train.class) {
          continue;
        }
        for (let subclass of train.subclass) {
          if (subclass.unitNumber(unitNumber)) {
            img = country.country + "/" + subclass.img;
            name = subclass.name;
          }
        }
      }
    }
  }

  return { img: IMAGE_FOLDER + img, name: name, operator: operator };
}

function makeUICArray(UIC) {
  let arr = [];
  arr.push(UIC.slice(0, 2)); // type code
  arr.push(UIC.slice(2, 4)); // country code
  // wagon class
  if (UIC[0] != "9") {
    arr.push(UIC.slice(4, 6) + "-" + UIC.slice(6, 8));
  } else {
    arr.push(UIC.slice(4, 8));
  }

  arr.push(UIC.slice(8, 11)); // wagon number
  arr.push("-" + UIC.slice(11, 12)); // check digit

  return arr;
}

function makeUICElement(UICArray) {
  const uic = document.createElement("small");
  uic.append(document.createTextNode("("));
  uic.append(document.createTextNode(UICArray[0] + " " + UICArray[1] + " "));

  const underlined = document.createElement("u");
  underlined.append(document.createTextNode(UICArray[2] + " " + UICArray[3]));

  uic.appendChild(underlined);

  uic.append(document.createTextNode(UICArray[4]));

  uic.append(document.createTextNode(")"));
  return uic;
}

function dateTimeToTimeString(dateTime) {
  //const dateTime = new Date();

  let hours = dateTime.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = dateTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let seconds = dateTime.getSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${hours}:${minutes}`;
}

function dateTimeToDateString(dateTime) {
  //const dateTime = new Date();

  let year = dateTime.getFullYear();

  let month = dateTime.getMonth();

  let day = dateTime.getDate();

  return `${day}.${month + 1}.${year}`;
}

async function getTrainInfo(trainNumber) {
  await importTrainData();
  const res = await fetch(`./trainInfo/${trainNumber}`);
  const json = await res.json();

  const delay = json.delay;
  const composition = json.composition;

  if (res.status != 200) {
    let delay = document.getElementById("delay");
    delay.textContent = "Pogreška pri dohvaćanju statusa vlaka.";
    delay.classList.add("late");
    return;
  }

  let train = document.getElementById("trainNumberInfo");
  train.textContent = `Vlak ${trainNumber}: ${delay.Transportation[0].Start.Name} --> ${delay.Transportation[0].Dest.Name}`;

  if (delay.Transportation[0].Delay == null) {
    let delay = document.getElementById("delay");
    delay.textContent = "Informacije o kašnjenju vlaka trenutno nisu dostupne.";
    delay.classList.add("late");
  } else {
    let location = document.getElementById("location");
    location.textContent = `Postaja: ${delay.Transportation[0].Delay.Station}`;

    let statusElement = document.getElementById("status");
    const currentStationID = delay.Transportation[0].Delay.StationCode;
    const currentStation = delay.Transportation[0].Stops.Stop.find(
      (stop) => stop.Station.ID == currentStationID,
    );

    if (delay.Transportation[0].Delay.FinishedAt != null) {
      let dateTime = new Date(delay.Transportation[0].Delay.FinishedAt);
      statusElement.textContent = `Zabilježen: ${dateTimeToTimeString(dateTime)} (${dateTimeToDateString(dateTime)})`;
    } else if (currentStation != null) {
      let dateTime = currentStation.DepartureTime;
      statusElement.textContent = `Predviđen polazak: ${dateTime.substring(0, 5)}`;
    }

    const delayAmount = delay.Transportation[0].Delay.Delay;
    if (delayAmount != null) {
      let delay = document.getElementById("delay");
      if (delayAmount == 0) {
        delay.textContent = `Vlak je redovit`;
        delay.classList.add("onTime");
      } else {
        delay.textContent = `Kasni ${delayAmount} min.`;
        if (delayAmount < 5) {
          delay.classList.add("delayed");
        } else {
          delay.classList.add("late");
        }
      }
    }
  }

  let el = document.getElementById("consistData");

  if (composition == null) {
    return;
  }

  for (let i = 0; i < composition.wagon.length; i++) {
    rotatableIndex = 0;
    const wagon = composition.wagon[i];
    const UICNumber = wagon.number;
    const UICArray = makeUICArray(UICNumber);
    let wagonDataDB =
      getImageFromWagonDatabaseStrict(UICNumber) ??
      getImageFromWagonDatabaseLeniant(UICNumber);
    let wagonData = getImageFromUIC(UICNumber, UICArray);

    if (
      wagonData.img == IMAGE_FOLDER + GENERIC_IMAGE &&
      wagonDataDB != undefined
    ) {
      wagonData = wagonDataDB;
    }

    console.log(UICNumber.slice(4, 8));

    let imgSrc = wagonData.img;
    let name = wagonData.name == undefined ? wagon.content : wagonData.name;
    const operator = wagonData.operator;
    console.log(imgSrc);

    if (ROTATABLE.includes(UICNumber.slice(4, 8))) {
      let index = imgSrc.length - 5;
      if (i % 2 == 0) {
        let char = imgSrc.at(index) == "a" ? "a" : "b";
        imgSrc = imgSrc.replaceAt(index, char);
      } else {
        let char = imgSrc.at(index) == "b" ? "a" : "b";
        imgSrc = imgSrc.replaceAt(imgSrc.length - 5, char);
      }
    }

    const container = document.createElement("div");
    container.setAttribute("class", "wagon");

    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "trainImage";
    container.appendChild(img);

    const wagonName = document.createElement("span");
    wagonName.textContent =
      operator == undefined ? name : operator + " " + name;
    container.appendChild(wagonName);

    const uic = makeUICElement(UICArray);

    container.appendChild(uic);

    el.appendChild(container);
  }
}
