/**
 * Ready-to-deploy Google Apps Script (Code.gs)
 * 
 * Paste this into Google Apps Script connected to your Google Sheet:
 * Extensions > Apps Script > Replace Code.gs > Deploy as Web App
 * 
 * Set access to: "Anyone"
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * DATE NIGHT HQ - GOOGLE APPS SCRIPT BACKEND
 * 
 * Sheet Columns:
 * 1. Timestamp
 * 2. Session ID
 * 3. Restaurant ID
 * 4. Restaurant Name
 * 5. Location
 * 6. Cuisine/Vibe
 * 7. Status
 */

function setupSheetHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Session ID",
      "Restaurant ID",
      "Restaurant Name",
      "Location",
      "Cuisine/Vibe",
      "Status"
    ]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#800020").setFontColor("#FFFFFF");
  }
}

// Handles POST requests from the Girlfriend Date Game
function doPost(e) {
  try {
    setupSheetHeaders();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = data.timestamp || new Date().toISOString();
    var sessionId = data.sessionId || "unknown_session";
    var restaurantId = data.restaurantId || "";
    var restaurantName = data.restaurantName || "";
    var location = data.location || "";
    var cuisineVibe = data.cuisineVibe || "";
    var status = data.status || "restaurant_selected";

    sheet.appendRow([
      timestamp,
      sessionId,
      restaurantId,
      restaurantName,
      location,
      cuisineVibe,
      status
    ]);

    var output = {
      status: "success",
      message: "Event recorded successfully",
      recorded: {
        sessionId: sessionId,
        status: status,
        restaurantName: restaurantName,
        timestamp: timestamp
      }
    };

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errOutput = {
      status: "error",
      message: error.toString()
    };
    return ContentService.createTextOutput(JSON.stringify(errOutput))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles GET requests from the Creator Dashboard (/admin)
function doGet(e) {
  try {
    setupSheetHeaders();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: 0,
        records: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var records = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[1]) continue;
      
      records.push({
        timestamp: row[0] ? row[0].toString() : "",
        sessionId: row[1] ? row[1].toString() : "",
        restaurantId: row[2] ? row[2].toString() : "",
        restaurantName: row[3] ? row[3].toString() : "",
        location: row[4] ? row[4].toString() : "",
        cuisineVibe: row[5] ? row[5].toString() : "",
        status: row[6] ? row[6].toString() : ""
      });
    }

    var output = {
      status: "success",
      count: records.length,
      records: records
    };

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errOutput = {
      status: "error",
      message: error.toString(),
      records: []
    };
    return ContentService.createTextOutput(JSON.stringify(errOutput))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
