export const TRAINS = [
  {
    country: "HR",
    countryCode: "78",
    operator: "HŽPP",
    types: [
      {
        matchUIC: (UICNumber) => UICNumber[0] == "9",
        wagons: [
          {
            class: "4111",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "4111-a.gif",
              },
            ],
          },
          {
            class: "5111",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "5111-a.gif",
              },
            ],
          },
          {
            class: "6111",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "6111-a.gif",
              },
            ],
          },
          {
            class: "6112",
            subclass: [
              {
                unitNumber: (unitNumber) => unitNumber == 1,
                img: "6112-001-a.gif",
              },
              {
                unitNumber: (unitNumber) => unitNumber == 101,
                img: "6112-101-a.gif",
              },
              {
                unitNumber: (unitNumber) => unitNumber >= 1 && unitNumber < 99,
                img: "6112-0-a.gif",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber > 101 && unitNumber < 200,
                img: "6112-1-a.gif",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber > 200 && unitNumber < 300,
                img: "6112-2-a.gif",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber > 300 && unitNumber < 400,
                img: "6112-3-a.gif",
              },
            ],
          },
          {
            class: "6211",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "6211-a.gif",
              },
            ],
          },
          {
            class: "7023",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "7023-a.gif",
              },
            ],
          },
          {
            class: "4121",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "7121-0-b-b.gif",
                img_backward: "7121-0-b-a.gif",
              },
            ],
          },
          {
            class: "7121",
            subclass: [
              {
                unitNumber: (unitNumber) => unitNumber >= 1 && unitNumber < 99,
                img: "7121-0-a-a.gif",
                img_backward: "7121-0-a-b.gif",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber > 100 && unitNumber < 200 && unitNumber % 2 == 0,
                img: "7121-1-a-a.gif",
                img_backward: "7121-1-a-b.gif",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber > 100 && unitNumber < 200 && unitNumber % 2 == 1,
                img: "7121-1-b-b.gif",
                img_backward: "7121-1-b-a.gif",
              },
            ],
          },
          {
            class: "7122",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "7122-m-a.gif",
              },
            ],
          },
          {
            class: "7123",
            subclass: [
              {
                unitNumber: (unitNumber) => unitNumber % 2 == 1,
                img: "7123-a-pp-a.gif",
                img_backward: "7123-a-pp-b.gif",
              },
              {
                unitNumber: (unitNumber) => unitNumber % 2 == 0,
                img: "7123-b-pp-b.gif",
                img_backward: "7123-b-pp-a.gif",
              },
            ],
          },
        ],
      },
      {
        matchUIC: (UICNumber) => UICNumber[0] == "5",
        wagons: [
          {
            class: "2107",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Beet-2b-a.gif",
                name: "Beet",
              },
            ],
          },
          {
            class: "2770",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Bl-exAB-2b-a.gif",
                name: "Bee",
              },
            ],
          },
          {
            class: "2870",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Bl-exAB-2b-a.gif",
                name: "Bee",
              },
            ],
          },
          {
            class: "5900",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Bcl-2b-a.gif",
                name: "Bcl",
              },
            ],
          },
          {
            class: "5970",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Bcl-2b-a.gif",
                name: "Bcl",
              },
            ],
          },
          {
            class: "7110",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WLee-7110-2b-a.gif",
                name: "WLee",
              },
            ],
          },
        ],
      },
      {
        matchUIC: (UICNumber) => UICNumber[0] == "6",
        wagons: [
          {
            class: "1000",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Aeelt-2b-a.gif",
                name: "Aeelt",
              },
            ],
          },
          {
            class: "1070",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Aeelt-2b-a.gif",
                name: "Aeelt",
              },
            ],
          },
          {
            class: "3970",
            subclass: [
              {
                unitNumber: (unitNumber) =>
                  unitNumber >= 11 && unitNumber <= 14,
                img: "ABeemt-2b-a.gif",
                name: "ABeemt",
              },
              {
                unitNumber: (unitNumber) =>
                  !(unitNumber >= 11 && unitNumber <= 14),
                img: "ABee-2b-a.gif",
                name: "ABee",
              },
            ],
          },
          {
            class: "3900",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "ABee-2b-a.gif",
                name: "ABee",
              },
            ],
          },
          {
            class: "2070",
            subclass: [
              {
                unitNumber: (unitNumber) => unitNumber >= 1 && unitNumber <= 4,
                img: "Beelt-2b-a.gif",
                name: "Beelt",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber >= 11 && unitNumber <= 17,
                img: "Beemt-2b-a.gif",
                name: "Beemt",
              },
              {
                unitNumber: (unitNumber) =>
                  !(unitNumber >= 1 && unitNumber <= 4) &&
                  !(unitNumber >= 11 && unitNumber <= 17),
                img: "Bee-2b-a.gif",
                name: "Bee",
              },
            ],
          },
          {
            class: "2000",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Bee-2b-a.gif",
                name: "Bee",
              },
            ],
          },
          {
            class: "5970",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Bcee-2b-a.gif",
                name: "Bcee",
              },
            ],
          },
          {
            class: "7170",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WLee-7170-do005-2b-a.gif",
                name: "WLee",
              },
            ],
          },
          {
            class: "8800",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WRee-2b-a.gif",
                name: "WRee",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    country: "SI",
    countryCode: "79",
    operator: "SŽ",
    types: [
      {
        matchUIC: (UICNumber) => UICNumber[0] == "5",
        wagons: [
          {
            class: "3970",
            subclass: [
              {
                unitNumber: (unitNumber) =>
                  unitNumber != 6 && !(unitNumber >= 11 && unitNumber <= 13),
                img: "ABl-mm-a.gif",
                name: "ABl",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber == 6 || (unitNumber >= 11 && unitNumber <= 13),
                img: "ABl-mm-a.gif",
                name: "ABlv",
              },
            ],
          },
          {
            class: "2070",
            subclass: [
              {
                unitNumber: (unitNumber) =>
                  unitNumber != 71 &&
                  unitNumber != 75 &&
                  !(unitNumber >= 81 && unitNumber <= 83),
                img: "Bl-3-a.gif",
                name: "Bl",
              },
              {
                unitNumber: (unitNumber) =>
                  unitNumber == 71 ||
                  unitNumber == 75 ||
                  (unitNumber >= 81 && unitNumber <= 83),
                img: "Bl-3-a.gif",
                name: "Blv",
              },
            ],
          },
          {
            class: "8870",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WRl-8870-3-a.gif",
                name: "WRl",
              },
            ],
          },
          {
            class: "8570",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WRl-8570-3-a.gif",
                name: "WRl",
              },
            ],
          },
          {
            class: "8730",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WRl-8740-3-a.gif",
                name: "WRl",
              },
            ],
          },
        ],
      },
      {
        matchUIC: (UICNumber) => UICNumber[0] == "6",
        wagons: [
          {
            class: "3970",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "ABeelm-a.gif",
                name: "ABeelm",
              },
            ],
          },
          {
            class: "3990",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "ABeelmt-3-a.gif",
                name: "ABeelmt",
              },
            ],
          },
          {
            class: "2070",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "Beelm-a.gif",
                name: "Beelm",
              },
            ],
          },
          {
            class: "8790",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "WReelmt-3-a.gif",
                name: "WReelmt",
              },
            ],
          },
        ],
      },
      {
        matchUIC: (UICNumber) => UICNumber[0] == "9",
        wagons: [
          {
            class: "6510",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "510-a.gif",
              },
            ],
          },
          {
            class: "6515",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "510-a.gif",
              },
            ],
          },
          {
            class: "8813",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "814-r-a.gif",
              },
            ],
          },
          {
            class: "8814",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "814-r-a.gif",
              },
            ],
          },
          {
            class: "5610",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "610-a.gif",
              },
            ],
          },
          {
            class: "5615",
            subclass: [
              {
                unitNumber: (unitNumber) => true,
                img: "610-a.gif",
              },
            ],
          },
        ],
      },
    ],
  },
];
