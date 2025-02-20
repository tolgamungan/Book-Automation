///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

/**
- Fetches Buy Box prices (New & Used) from Amazon API.
- @param {string} asin The SKU of the product.
- @returns {object|null} The pricing data or null if unavailable.
*/
function getBuyBoxOffersBySKU(sku) {
// var sku = "0A-CBXW-SDMO";
var accessToken = getAmazonAccessToken();
var marketplaceId = getMarketplaceId();

if (!accessToken) {
Logger.log("❌ ERROR: No Access Token Available.");
return null;
}
    var url = "https://sellingpartnerapi-na.amazon.com/products/pricing/v0/listings/"+ sku +"/offers?MarketplaceId="+ marketplaceId +"&ItemType=SKU&ItemCondition=New&CustomerType=Consumer"; 
    var options = {
    method: "get",
    headers: {
    "Authorization": "Bearer " + accessToken,
    "x-amz-access-token": accessToken,
    "Content-Type": "application/json"
    }
    };
    try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
     if (!json || !json.payload || json.payload.length === 0) { Logger.log("Returned empty payload");
        return null;
     }
     var buyBoxPrices = json.payload.Summary.BuyBoxPrices;
    //  // Extract Buy Box Prices (New & Used)
    //  var buyBoxNew = buyBoxPrices.find(item => item.condition === "New")?.LandedPrice?.Amount; 
    //  var buyBoxUsed = buyBoxPrices.find(item => item.condition === "Used")?.LandedPrice?.Amount; 
    var buyBoxNew = null, buyBoxUsed = null;

    buyBoxPrices.forEach(item => {
      if (item.condition === "New") {
        buyBoxNew = item.LandedPrice.Amount + (item.Shipping?.Amount || 0);
      } else if (item.condition === "Used") {
       buyBoxUsed = item.LandedPrice.Amount + (item.Shipping?.Amount || 0);
      }
    });
    Logger.log("New Buy Box: $"+buyBoxNew);
     return {
         buyBoxNew: buyBoxNew,
         buyBoxUsed: buyBoxUsed
     };
    } catch (error) {
    Logger.log("❌ ERROR fetching pricing data for SKU " + sku + ": " + error);
    return null;
    }
    }

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

/**
- Fetches Buy Box prices (New & Used) from Amazon API.
- @param {string} asin The ASIN of the product.
- @returns {object|null} The pricing data or null if unavailable.
*/
function getBuyBoxOffersByASIN(asin) {
  // var asin = "0593300041";
  var accessToken = getAmazonAccessToken();
  var marketplaceId = getMarketplaceId();

if (!accessToken) { Logger.log("❌ ERROR: No Access Token Available."); return null; }

    var url = "https://sellingpartnerapi-na.amazon.com/products/pricing/v0/items/"+asin+"/offers?MarketplaceId="+marketplaceId+"&ItemCondition=New"; 
    var options = {
    method: "get",
    headers: {    "Authorization": "Bearer " + accessToken,
                  "x-amz-access-token": accessToken,
                  "Content-Type": "application/json"  }
    };
    try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
     if (!json || !json.payload || json.payload.length === 0) { Logger.log("Returned empty payload");
      return null;
     }
     var buyBoxPrices = json.payload.Summary.BuyBoxPrices;
    
    // Extract Buy Box Prices (New & Used)
    var buyBoxNew = null, buyBoxUsed = null;
    buyBoxPrices.forEach(item => {
      if (item.condition === "New") {
        buyBoxNew = item.LandedPrice.Amount + (item.Shipping?.Amount || 0);
      } else if (item.condition === "Used") {
       buyBoxUsed = item.LandedPrice.Amount + (item.Shipping?.Amount || 0);
      }
    });
    Logger.log("New Buy Box: $"+buyBoxNew);
    Logger.log("New Buy Used: $"+buyBoxUsed);
     return {
         buyBoxNew: buyBoxNew,
         buyBoxUsed: buyBoxUsed
     };
    } catch (error) {
    Logger.log("❌ ERROR fetching pricing data for SKU " + asin + ": " + error);
    return null;
    }
    }
    























function getFeeEstimateByASIN(asin, amount) {
// var asin = "035838043X";
// var amount = "34.3";
var accessToken = getAmazonAccessToken();
var marketplaceId = getMarketplaceId().trim();
if (!accessToken) {
    Logger.log("❌ ERROR: No Access Token Available.");
    return null;
}
if (!asin || asin.trim() === "") {
    Logger.log("❌ ERROR: ASIN is missing!");
    return null;
}
var url = "https://sellingpartnerapi-na.amazon.com/products/fees/v0/items/" + asin.trim() + "/feesEstimate";
var requestBody = {
    "FeesEstimateRequest": {
        "MarketplaceId": marketplaceId,
        "Identifier": asin.trim(),
        "IsAmazonFulfilled": true, // ✅ Change to false for FBM (self-fulfilled)
        "PriceToEstimateFees": {
            "ListingPrice": {
                "Amount": amount, // ✅ Set your expected selling price
                "CurrencyCode": "CAD"
            }
        }
    }
};
var options = {
    method: 'POST',
    headers: {
        "Authorization": "Bearer " + accessToken.trim(),
        "x-amz-access-token": accessToken.trim(),
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
};


try {
    var response = UrlFetchApp.fetch(url, options);
    var statusCode = response.getResponseCode();
    var responseText = response.getContentText();
    var json = JSON.parse(responseText);

    var totalFees = json?.payload?.FeesEstimateResult?.FeesEstimate?.TotalFeesEstimate?.Amount || null;
    Logger.log(totalFees);
    // return totalFees ? totalFees.totalFees : null;
    return parseFloat(totalFees);

    






} catch (error) {
    Logger.log("❌ ERROR: " + error);
    return null;
}

}















