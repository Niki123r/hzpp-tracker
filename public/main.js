let params = new URLSearchParams(window.location.search);
const trainNumber = params.get("trainNumber");

const IMAGE_FOLDER = "./images/";
let TRAINS;
let WAGON_DATA;
const GENERIC_IMAGE = "generic-loco.gif";

console.log(trainNumber == null);

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
  let matcher = UICNumberString.slice(2, 8);

  for (let entry of WAGON_DATA) {
    if (entry.uic.slice(2, 8) == matcher) {
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
  console.log(TRAINS);
  const res = await fetch(`./trainInfo/${trainNumber}`);
  const json = await res.json();

  let location = document.getElementById("location");
  location.textContent = json.stationName;

  let statusElement = document.getElementById("status");
  console.log(json);
  statusElement.textContent = `${json.status.statusString} ${json.status.dateString} ${json.status.timeString}`;

  if (json.delay != null) {
    let delay = document.getElementById("delay");
    delay.textContent = `Kasni ${json.delay} min.`;
  }

  let el = document.getElementById("consistData");

  for (let wagon of json.composition) {
    const UICNumber = wagon.UIC;
    const UICArray = makeUICArray(wagon.UIC);

    let wagonData = getImageFromUIC(UICNumber, UICArray);
    if (wagonData.img == IMAGE_FOLDER + GENERIC_IMAGE) {
      wagonData = getImageFromWagonDatabase(UICNumber);
    }
    console.log(wagonData);
    const imgSrc = wagonData.img;
    let name = wagonData.name == undefined ? wagon.class : wagonData.name;
    const operator = wagonData.operator;

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

    console.log(UICArray);
  }
}
