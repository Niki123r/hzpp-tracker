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

function getImageFromWagonDatabase(UICNumberString) {
  let img = GENERIC_IMAGE;
  let matcher = UICNumberString.slice(0, 8);

  for (let entry of WAGON_DATA) {
    if (entry.uic == matcher) {
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

async function getTrainInfo(trainNumber) {
  await importTrainData();
  const res = await fetch(`./trainInfo/${trainNumber}`);
  const json = await res.json();

  if (res.status != 200) {
    let delay = document.getElementById("delay");
    delay.textContent = "Pogreška pri dohvaćanju statusa vlaka.";
    delay.classList.add("late");
    return;
  }

  let train = document.getElementById("trainNumberInfo");
  train.textContent = `Vlak ${trainNumber}:`;

  let location = document.getElementById("location");
  location.textContent = `Postaja: ${json.stationName}`;

  let statusElement = document.getElementById("status");
  statusElement.textContent = `${json.status.statusString} - ${json.status.timeString} (${json.status.dateString})`;

  if (json.delay != null) {
    let delay = document.getElementById("delay");
    if (json.delay == 0) {
      delay.textContent = `Vlak je redovit`;
      delay.classList.add("onTime");
    } else {
      delay.textContent = `Kasni ${json.delay} min.`;
      if (json.delay < 5) {
        delay.classList.add("delayed");
      } else {
        delay.classList.add("late");
      }
    }
  }

  let el = document.getElementById("consistData");

  for (let i = 0; i < json.composition.length; i++) {
    const wagon = json.composition[i];
    const UICNumber = wagon.UIC;
    const UICArray = makeUICArray(wagon.UIC);

    let wagonData = getImageFromUIC(UICNumber, UICArray);
    let wagonDataDB = getImageFromWagonDatabase(UICNumber);
    if (
      wagonData.img == IMAGE_FOLDER + GENERIC_IMAGE &&
      wagonDataDB != undefined
    ) {
      wagonData = getImageFromWagonDatabase(UICNumber);
    }
    let imgSrc = wagonData.img;
    let name = wagonData.name == undefined ? wagon.class : wagonData.name;
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
