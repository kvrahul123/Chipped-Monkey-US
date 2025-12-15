export function externalSources(microchip_number: string) {
  return [
        {
            url: "https://chippedmonkey.com/api/v1.0/AAHALookup",
            params: {
                id: microchip_number,
            },
            name: "Chipped Monkey",
            phone_number: "(888) TRACK-17",
            website: "https://chippedmonkey.com",
        }
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