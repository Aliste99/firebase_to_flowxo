exports.createSpreadSheet = function(google, sheets, sheetData, respPath, tokens) {
  const updateSpreadsheet = () => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_ID,
      process.env.GOOGLE_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    oauth2Client.refreshAccessToken((err, tokens) => {
      if (err) return console.error(err);

      oauth2Client.setCredentials({
        access_token: tokens.access_token
      });
      sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Sheet1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [
            [new Date().toISOString(), "Some value", "Another value"]
          ],
        },
        auth: oauth2Client
      }, (err, response) => {
        if (err) return console.error(err);
      });

    });
  };
  updateSpreadsheet();
  console.log("SpreadSeet updated");
}