var AMAZON_CLIENT_ID = "amzn1.application-oa2-client.9f808c8863c148b986360c4f6f549dc5"; 
var AMAZON_CLIENT_SECRET = "amzn1.oa2-cs.v1.0e78e74c4c54294f3ff71adabe702c215f6340d91d535bc83f1ee74e1da69c0e";
var AMAZON_REFRESH_TOKEN = "Atzr|IwEBICLOeDX-Og-lzgdscdHMRgVNMkEXzhga1H-koGH67EOFlUKVNbEdJpPaQymzBBTt7qma_UFnMT8_WsKRe3H-oNuTDKMYyJ-78V2s4Z3fl3nuHi-rfXYG4XOVc5MX02jQsmaproDUGfoQLnGMDDuO_8dcIDuqzHd2JlbK9hL4hNF3uPOGArJe6j84wUUIGFV5w4X5PcwAefJbcHWa-R4SIIA1SbvXDZlNSjtDrpJ-e_yTl_ZsdlVze0rlgBL_9g2TAOeAYZMki9PJTKH5pcMkb1bbNxdGoioiyZUgzEiA-zw8X17flDKGV9K_g8oK8FddpU64qZLSb9HsmuhMoEWRXvLG";
var MARKETPLACE_ID = "A2EUQ1WTGCTBG2"; // Canada (Change if needed)

/**
- Fetches a new Amazon SP-API access token.
- @returns {string|null} The access token if successful, otherwise null.
*/
function getAmazonAccessToken() {
  var url = "https://api.amazon.com/auth/o2/token";
  var payload = {
  grant_type: "refresh_token",
  refresh_token: AMAZON_REFRESH_TOKEN,
  client_id: AMAZON_CLIENT_ID,
  client_secret: AMAZON_CLIENT_SECRET
};
    var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
    };
    try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    // Logger.log("Access Token successfully generated! : "+ json.access_token);
    return json.access_token || null;
    } catch (error) {
    Logger.log("❌ ERROR Fetching Amazon Access Token: " + error);
    return null;
    }
    }
    


/**
- Retrieves the Amazon Marketplace ID.
- @returns {string} The marketplace ID.
*/
function getMarketplaceId() {
return MARKETPLACE_ID;
}
