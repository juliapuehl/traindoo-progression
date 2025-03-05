const fs = require("fs");
const { google } = require("googleapis");
const { getAuth } = require("./lib/google-auth");
const prettier = require("prettier");

getAuth((auth) => updateTexts(auth));

/**
 * Update translation files from google sheets
 * https://docs.google.com/spreadsheets/d/11IqAGLf_sJCSkfB2v9yCtR5PuxwaTxjvQCWwuYO2fas/
 */

const sheetId = "11IqAGLf_sJCSkfB2v9yCtR5PuxwaTxjvQCWwuYO2fas";
async function updateTexts(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const sheetNames = await getSheetNames(auth, sheetId);

  const sheetResponses = await Promise.all(
    sheetNames.map((name) =>
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${name}!A2:E`,
      })
    )
  );

  const values = sheetResponses
    .map((res) => res.data.values)
    .flat()
    .filter((x) => x?.length > 0);

  const languages = { de: 1, en: 2, es: 3, fr: 4 };

  const result = {};
  for (const lang of Object.keys(languages)) {
    result[lang] = {};
  }

  for (const row of values) {
    const label = row[0];

    for (const [lang, langKey] of Object.entries(languages)) {
      result[lang][label] = transformVariables(row[langKey] ?? label);
    }
  }

  for (const filename of Object.keys(result)) {
    fs.writeFile(
      `src/translations/${filename}.json`,
      prettier.format(JSON.stringify(result[filename]), { parser: "json" }),
      () => {
        console.info(`src/translations/${filename}.json written.`);
      }
    );
  }
}

const getSheetNames = async (auth, spreadsheetId) => {
  const sheets = google.sheets({ version: "v4", auth });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get({ spreadsheetId }, (err, res) => {
      if (err) {
        console.error("The API returned an error: " + err);
        return reject(err);
      }

      const sheetNames = res.data.sheets.map(
        (sheet) => sheet?.properties?.title
      );
      resolve(sheetNames);
    });
  });
};

const transformVariables = (string) =>
  string && string.replace(/###([0-9a-zA-Z_]*)/g, "{{$1}}");
