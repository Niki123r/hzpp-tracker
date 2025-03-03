const cheerio = require("cheerio");
const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const app = express();
const port = 3000;

// HZPP Planner server token
const token = process.env.HZPP_TOKEN;

const TrainStatus = Object.freeze({
  DEPARTURE: "Odlazak",
  ARRIVAL: "Dolazak",
  FORMED: "Formiran",
  FINISHED: "Završio vožnju",
});

class HZDelayParser {
  trainNumber;
  compositionHTML;
  compositionParser;
  delayHTML;
  delayParser;

  async getTrainInfo(trainNumber) {
    this.trainNumber = trainNumber;
    this.compositionHTML = await this.getCompositionResponse();
    this.compositionParser = cheerio.load(this.compositionHTML);

    this.delayHTML = await this.getDelayResponse();
    this.delayParser = cheerio.load(this.delayHTML);

    const locationString = this.getCurrentDelayLocation();
    const delay = this.getCurrentDelay();
    const composition = this.getRawComposition();
    const status = this.getStatus();

    let UIC = [];
    for (let wagon of composition) {
      if (wagon.length == 0) {
        continue;
      }
      UIC.push(wagon[0]);
    }
    return {
      stationName: locationString,
      delay: parseInt(delay),
      status: status,
      composition: this.getCompositionData(composition),
    };
  }

  getStatusString(trainStatus) {
    let trainStatusString = null;

    for (let status of Object.values(TrainStatus)) {
      if (trainStatus.match(status) != null) {
        trainStatusString = status;
      }
    }

    return trainStatusString;
  }

  getStatus() {
    const trainStatus = this.delayParser(
      "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > i:nth-child(1)"
    ).text();

    let trainStatusString = this.getStatusString(trainStatus);

    if (trainStatusString == null) {
      trainStatusString = this.getStatusString(
        this.compositionParser(
          "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > i:nth-child(7)"
        ).text()
      );
    }

    let rawDateData = this.delayParser(
      "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > cr:nth-child(2)"
    )
      .text()
      .slice(1)
      .split(" ");

    let date = rawDateData[0];
    let time = rawDateData[2];

    if (rawDateData[1] == null || rawDateData[1] == undefined) {
      const compositionDOM = new JSDOM(this.compositionHTML);
      try {
        rawDateData = compositionDOM.window.document
          .querySelector(
            "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > i:nth-child(7)"
          )
          .nextSibling.textContent.slice(1)
          .split(" ");
        date = rawDateData[0];
        time = rawDateData[1];
      } catch (error) {
        date = null;
        time = null;
      }
    }

    return {
      statusString: trainStatusString,
      dateString: date,
      timeString: time,
    };
  }

  getCurrentDelayLocation() {
    let location = this.delayParser(
      "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > strong:nth-child(2)"
    )
      .text()
      .split("+");
    let locationString = this.capitalizeLocation(location);

    if (locationString == "undefined") {
      location = this.compositionParser(
        "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > strong:nth-child(5)"
      )
        .text()
        .split(" ")
        .filter((val) => val != "");
      locationString = this.capitalizeLocation(location);
    }
    return locationString;
  }

  getCurrentDelay() {
    return this.getDelayFromArray(
      this.compositionParser("body > form:nth-child(3)").text().split("\n")
    );
  }

  getCompositionData(composition) {
    let data = [];
    for (let wagon of composition) {
      if (wagon.length == 0) {
        continue;
      }
      data.push({
        UIC: wagon[0],
        class: wagon[1],
        cargo: wagon[2],
        from: wagon[3],
        to: wagon[4],
        weight: wagon[5],
      });
    }
    return data;
  }

  getRawComposition() {
    return this.parseCompositionTable(
      this.compositionParser(
        "body > form:nth-child(3) > p:nth-child(1) > font:nth-child(1) > font:nth-child(9) > font:nth-child(2) > strong:nth-child(3) > table:nth-child(1) > tbody:nth-child(1)"
      )
    );
  }

  async getDelayResponse() {
    const res = await fetch(
      `https://traindelay.hzpp.hr/train/delay?trainId=${this.trainNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const html = await res.text();
    return html;
  }
  async getCompositionResponse() {
    const res = await fetch(
      `https://traindelay.hzpp.hr/train/composition?trainId=${this.trainNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const html = await res.text();
    return html;
  }

  capitalizeLocation(locationArray) {
    let locationString = "";
    locationArray.forEach((el, i) => {
      let temp = el.toLowerCase();
      if (i != 0) {
        locationString += " ";
      }
      locationString += el[0] + temp.substring(1).replace(" ", "");
    });
    return locationString;
  }

  getDelayFromArray(arr) {
    try {
      arr.splice(0, 3);
      arr.splice(5);
      //console.log(arr);
      let delay;
      if (arr[4].indexOf("redovit") != -1) {
        delay = 0;
      } else if (arr[4] == undefined || arr[4] == null) {
        delay = undefined;
      } else {
        delay = arr[4].match(/\d+/)[0];
      }
      return parseInt(delay);
    } catch {
      return undefined;
    }
  }

  parseCompositionTable(table) {
    let composition = [];
    let temp;
    table.children().each((i, el) => {
      if (i != 0) {
        temp = [];
        this.compositionParser(el)
          .children()
          .each((i, el) => {
            let text = this.compositionParser(el).text();
            text = text.replace("\n", "");
            text = text.replace(" ", "");
            temp.push(text);
            //console.log(i, $(el).text());
          });
        composition.push(temp);
      }
    });
    return composition;
  }
}

const delayParser = new HZDelayParser();

app.use(express.static("public"));

app.get("/trainInfo/:trainNumber", async (req, res) => {
  const trainNumber = req.params.trainNumber;

  const data = await delayParser.getTrainInfo(trainNumber);

  res.status(200).json(data);
});

app.get("/api/img/:operator/:wagon", async (req, res) => {
  const operator = req.params.operator;
  const wagon = req.params.wagon;

  const vagonWebRes = await fetch(
    `https://www.vagonweb.cz/popisy/img/${operator}/${wagon}`
  );
  res.writeHead(200, { "Content-Type": "image/gif" });
  //res.send(vagonWebRes);
  const arrayBuffer = await vagonWebRes.arrayBuffer();
  res.end(Buffer.from(arrayBuffer));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function test() {
  const test = await delayParser.getTrainInfo(210);
  console.log(test);
}
