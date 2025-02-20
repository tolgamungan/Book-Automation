/**
- Fetches data from Keepa API using ISBN-13 (converted to ASIN).
- @param {string} isbn13 - The ISBN-13 of the book.
- @param {string} keepaAPIKey - The Keepa API key.
- @returns {Object|null} - Parsed Keepa data or null if not found.
*/
function getKeepaDataByISBN(isbn13) {
var keepaAPIKey = getKeepaAPIKey();
// var isbn13 = "9780593137666";
var url = 'https://api.keepa.com/product?key=' + keepaAPIKey + '&domain=6&code=' + isbn13+"&stats=90&history=0";
try {
var response = UrlFetchApp.fetch(url, { method: "get" });
var json = JSON.parse(response.getContentText());
if (!json.products || json.products.length === 0) {
  Logger.log(`❌ No Keepa data found for ISBN-13: ${isbn13}`);
  return null;
}
var product = json.products[0];
Logger.log(product.title);
return {
  title: product.title || "",
  avg90SalesRank: product.stats.avg90 ? product.stats.avg90[3] : null,
};
} catch (error) {
Logger.log(`❌ ERROR fetching Keepa data for ISBN-13 ${isbn13}: ${error.message}`);
return null;
}
}


function getKeepaDataByASIN(asin) {
var keepaAPIKey = getKeepaAPIKey();
// var asin = "0593137663";
var url = 'https://api.keepa.com/product?key=' + keepaAPIKey + '&domain=6&asin=' + asin+"&stats=90&history=0";
try {
var response = UrlFetchApp.fetch(url, { method: "get" });
var json = JSON.parse(response.getContentText());
if (!json.products || json.products.length === 0) {
  Logger.log(`❌ No Keepa data found for ASIN: ${asin}`);
  return null;
}
var product = json.products[0];
Logger.log("Title: "+product.title);
return {
  title: product.title || "",
  avg90SalesRank: product.stats.avg90 ? product.stats.avg90[3] : null,
};
} catch (error) {
Logger.log(`❌ ERROR fetching Keepa data for ASIN ${asin}: ${error.message}`);
return null;
}
}










/**
- Fetches ASIN for a given ISBN-13 using Keepa API.
- @param {string} isbn13 - The ISBN-13 of the book.
- @param {string} keepaAPIKey - The Keepa API key.
- @returns {string|null} - The ASIN or null if not found.
*/
function getASINFromISBN(isbn13) {
  var keepaAPIKey = getKeepaAPIKey();
  // var isbn13 = "9780593137666";
  var url = 'https://api.keepa.com/product?key=' + keepaAPIKey + '&domain=6&code=' + isbn13;
try {
var response = UrlFetchApp.fetch(url);
var json = JSON.parse(response.getContentText());
// Find ASIN in the response, search for the first object with the 'asin' property
var asin = json.products ? json.products.find(product => product.asin) : null;
// Log and return the ASIN if found
Logger.log(asin ? "ASIN: "+asin.asin : "ASIN not found");
return asin ? asin.asin : null;
} catch (error) {
Logger.log(`❌ Error fetching ASIN for ISBN-13: ${isbn13}: ${error.message}`);
return null;
}
}














