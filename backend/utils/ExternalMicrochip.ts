export function externalSources(microchip_number: string) {
  return [
        {
            url: "https://chiphero.uk/database-search/",
            params: {
                username: "monkey",
                password: "GLACIER-acorn-illuminate-Anchor",
                chipnumber: microchip_number,
            },
            name: "Chip Hero",
            phone_number: "0330 043 5244",
            website: "https://chiphero.uk",
        },
        {
            url: "https://www.petidentityuk.info/chip-number-check/",
            params: {
                username: "chippedmonkeyLtd",
                password: "JgzNFwR2CT9A",
                chipnumber: microchip_number,
            },
            name: "Pet Identity UK",
            phone_number: "",
            website: "https://www.petidentityuk.info",
        },
        {
            url: "https://petscanner.com/api/check-chip/",
            params: {
                token: "b2c39ukL0jW1e_krIlLmS",
                chip: microchip_number,
            },
            name: "Pet Scanner",
            phone_number: "",
            website: "https://petscanner.com",
        },
        {
            url: "https://microdogid.org/GreyhoundlookupUK/GreyhoundlookupUK/",
            params: {
                username: "ChippedMonKey",
                password: "*T0ront0558",
                chipnumber: microchip_number,
            },
            name: "Micro Dog ID",
            phone_number: "",
            website: "https://microdogid.org",
        },
        {
            url: "https://rest.homeagain.com/api/defra/chiplookup/",
            params: {
                username: "ChippedMonkeyUser",
                password: "rdxGgL0a0bFitJ89Vzho",
                chipnumber: microchip_number,
            },
            name: "Home Again",
            phone_number: "",
            website: "https://www.homeagain.co.uk",
        },
        {
            url: "https://api.petdatabase.com/defrachipchecker/",
            params: {
                username: "chippedmonkey",
                password: "Vocalize-Sublet-Overtly-Reflected",
                chipnumber: microchip_number,
            },
            name: "Pet Database",
            phone_number: "0330 818 8558",
            website: "https://www.petdatabase.com",
        },
        {
            url: "https://dkc-api.stagelab.co.uk/api/microchip-check/",
            params: {
                username: "chippedmonkey",
                password: "Falcon-Blueberry-Telescope-MiX",
                chipnumber: microchip_number,
            },
            name: "DKC Microchips ",
            phone_number: "",
            website: "https://www.dkcmicrochips.co.uk",
        },
        {
            url: "https://db.smarttrace.org.uk/microchip-check/",
            params: {
                username: "chippedmonkey",
                password: "rOunDwoRm-baBOOn-lAgEr-itInERary",
                chipnumber: microchip_number,
            },
            name: "SmartTrace Team",
            phone_number: "",
            website: "https://smarttrace.org.uk",
        },
        {
            url: "https://api.protectedpet.com/api/check_chip/",
            params: {
                username: "Chipped Monkey",
                password: '!"£dfreEW*&^',
                chipnumber: microchip_number,
            },
            name: "Protected Pets",
            phone_number: "0844 414 2262 / 01902 508 355",
            website: "www.protectedpet.com",
        },
        {
            url: "https://api.myanimaltrace.com/microchip.php",
            params: {
                username: "chippedmonkey",
                password: "ToMaTo-HoUsE-bOnD-sTuDy",
                chipnumber: microchip_number,
            },
            name: "My Animal Trace",
            phone_number: "",
            website: "https://myanimaltrace.com/",
        },
        {
            url: "https://services.thekennelclub.org.uk/DefraApiService.svc/rest/defra",
            params: {
                username: "CHIPPEDMONKEY",
                password: "SpOoKy-taBleT-BriDge-cAnNOn",
                chipnumber: microchip_number,
            },
            name: "Pet Log",
            phone_number: "",
            website: "",
        },
        {
            url: "https://nvds.co.uk",
            params: {
                username: "chippedmonkey_website",
                password: "waT28JsP9Fw29LvVFUoLVag",
                chipnumber: microchip_number,
            },
            name: "National Veterinary Data Service",
            phone_number: "01359 245310",
            website: "www.nvds.co.uk",
        },
        {
            url: "https://identibase-api-test.azurewebsites.net/api/chips/checkchip",
            params: {
                username: "chippedmonkey",
                password: "lunar-TORNADO-SwivEr-briar",
                chipnumber: microchip_number,
            },
            name: "Identibase",
            phone_number: "",
            website: "https://www.identibase.co.uk/",
      },
        {
            url: "https://animaldata.org.uk/api/v1/user/web-api/microchips",
            params: {
                username: "chippedmonkey",
                password: "capsize-PULL-famished-FACEPLATE",
                chipnumber: microchip_number,
            },
            name: "Animal Data",
            phone_number: "0800 023 9384",
            website: "https://animaldata.org.uk/",
        },
    ]
};


export async function checkExternalMicrochip(microchip_number: string) {
  const sources = externalSources(microchip_number);

  const cleanParams = (params: Record<string, any>) => {
    const cleaned: Record<string, string> = {};

    for (const key in params) {
      const value = params[key];
      if (value !== undefined && value !== null) {
        cleaned[key] = String(value);
      }
    }

    return cleaned;
  };

  for (const source of sources) {
    try {
      const cleanedParams = cleanParams(source.params);
      const query = new URLSearchParams(cleanedParams);

      const response = await fetch(`${source.url}?${query.toString()}`);
      const text = (await response.text()).trim().toLowerCase();

      if (text === "true" || text === "info") {
        let message = "";

        if (text === "true") {
          message =
            `Microchip number is already registered on ${source.name}.` +
            (source.phone_number ? ` Contact: ${source.phone_number}` : "");
        } else {
          message =
            `Microchip number was found on ${source.name}.` +
            (source.phone_number ? ` Contact: ${source.phone_number}` : "");
        }

        return { exists: true, message };
      }
    } catch (e) {
      console.error(`Error checking ${source.name}:`, e);
      continue;
    }
  }

  return { exists: false, message: "" };
}