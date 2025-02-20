// ***   Select the google sheet to work with   *** //
function updatePricingData() {
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TEST - Automation Keepa");
var data = sheet.getDataRange().getValues();

// ***   Identify column indexes dynamically   *** //

// Columns - Common
var headers = data[0];
var isbnColumn = headers.indexOf("ISBN");
var asinColumn = headers.indexOf("ASIN");
var salesRankColumn = headers.indexOf("90d Avg Amazon Rank");
var lastUpdatedColumn = headers.indexOf("Last Updated");
var productCostColumn = headers.indexOf("Product Cost"); // Manually entered
var titleColumn = headers.indexOf("Title");
var today = new Date();
var updatedRows = [];


// Columns - Used
var UsedSellPriceColumn = headers.indexOf("Sell Price (Used)");
var UsedBuyBoxColumn = headers.indexOf("Buy Box Price (Used)");
var UsedTotalCostColumn = headers.indexOf("Total Cost (Used)");
var UsedTotalFeesColumn = headers.indexOf("Total Fees (Used)");
var UsedProfitColumn = headers.indexOf("Profit (Used)");
var UsedProfitMarginColumn = headers.indexOf("Profit Margin (Used)");

// Columns - New
var NewSellPriceColumn = headers.indexOf("Sell Price (New)");
var NewBuyBoxColumn = headers.indexOf("Buy Box Price (New)");
var NewTotalCostColumn = headers.indexOf("Total Cost (New)");
var NewTotalFeesColumn = headers.indexOf("Total Fees (New)");
var NewProfitColumn = headers.indexOf("Profit (New)");
var NewProfitMarginColumn = headers.indexOf("Profit Margin (New)");






for (var i = 1; i < data.length; i++) {
    var isbn = data[i][isbnColumn];
    if (!isbn) continue; // Skip empty rows

    // Skip if last updated within last 5 days
    var lastUpdated = data[i][lastUpdatedColumn] ? new Date(data[i][lastUpdatedColumn]) : null;
    if (lastUpdated && (today - lastUpdated) / (1000 * 60 * 60 * 24) < 5) {
        Logger.log("Skipping ISBN " + isbn + ", last updated " + lastUpdated);
        continue;
    }

    // Get ASIN
    var asin = getASINFromISBN(isbn); // // Fetch ASIN from Keepa API
    if (!asin) {
        Logger.log("Skipping this ISBN: " + isbn + " - No ASIN found.");
        continue;
    }

    var amazonBuyBoxData = getBuyBoxOffersByASIN(asin); // Fetch Buy Box Prices from Amazon API
    // Logger.log(amazonBuyBoxData);

    var keepaData = getKeepaDataByASIN(asin); // // Fetch Title, 90d Avg Sales Rank from Keepa API

    if (!amazonBuyBoxData || !keepaData) {
        Logger.log("Skipping ISBN " + isbn + " - Missing data from Amazon or Keepa.");
        continue;
    }
    var productCost = parseFloat(data[i][productCostColumn]) || 0;
    var shippingCost = 0.85; // Fixed


    // ***   Extract relevant data   *** //
    var avg90SalesRank = keepaData.avg90SalesRank || ""; // Done
    var title = keepaData.title || ""; // Done




    // New Calculations
    if (amazonBuyBoxData.buyBoxNew && !isNaN(parseFloat(amazonBuyBoxData.buyBoxNew)) && parseFloat(amazonBuyBoxData.buyBoxNew) > 0 ){
      var NewBuyBoxPrice = parseFloat(amazonBuyBoxData.buyBoxNew) || "";  
      var NewAmazonFeeEstimate = parseFloat(getFeeEstimateByASIN(asin,NewBuyBoxPrice));
      var NewSellPrice = (NewBuyBoxPrice-0.15);     // New Sell Price Logic
      var NewTotalCost = (parseFloat(productCost) + parseFloat(NewAmazonFeeEstimate) + parseFloat(shippingCost)).toFixed(2);
      var NewProfit = NewSellPrice && NewTotalCost ? (NewSellPrice - NewTotalCost).toFixed(2) : "";
      var NewProfitMargin = productCost ? ((NewProfit / productCost) * 100).toFixed(2) + "%" : "";
    } else {
        var NewBuyBoxPrice = "";
        var NewAmazonFeeEstimate ="";
        var NewSellPrice = "";
        var NewTotalCost = "";
        var NewProfit = "";
        var NewProfitMargin = "";
    }

    // Used Calculations
    if (amazonBuyBoxData.buyBoxUsed&& !isNaN(parseFloat(amazonBuyBoxData.buyBoxUsed)) && parseFloat(amazonBuyBoxData.buyBoxUsed) > 0 ){
      var UsedBuyBoxPrice = parseFloat(amazonBuyBoxData.buyBoxUsed) || ""; 
      var UsedAmazonFeeEstimate = parseFloat(getFeeEstimateByASIN(asin,UsedBuyBoxPrice)); 
      var UsedSellPrice = (UsedBuyBoxPrice-0.15);     // Used Sell Price Logic
      var UsedTotalCost = (parseFloat(productCost) + parseFloat(UsedAmazonFeeEstimate) + parseFloat(shippingCost)).toFixed(2);
      var UsedProfit = UsedSellPrice && UsedTotalCost ? (UsedSellPrice - UsedTotalCost).toFixed(2) : "";
      var UsedProfitMargin = productCost ? ((UsedProfit / productCost) * 100).toFixed(2) + "%" : "";
    } else{
        var UsedBuyBoxPrice = ""
        var UsedAmazonFeeEstimate = "";
        var UsedSellPrice = ""; 
        var UsedTotalCost = ""; 
        var UsedProfit = "";
        var UsedProfitMargin = "";
    }


    // Update sheet
    updatedRows.push({
        row: i + 1,
        data: {
            [asinColumn]: asin,
            [titleColumn]: title,
            [salesRankColumn]: avg90SalesRank,

            [UsedBuyBoxColumn]: UsedBuyBoxPrice,
            [UsedSellPriceColumn]: UsedSellPrice,
            [UsedTotalCostColumn]: UsedTotalCost,
            [UsedTotalFeesColumn]: UsedAmazonFeeEstimate,
            [UsedProfitColumn]: UsedProfit,   
            [UsedProfitMarginColumn]: UsedProfitMargin,

            [NewBuyBoxColumn]: NewBuyBoxPrice,
            [NewSellPriceColumn]: NewSellPrice,
            [NewTotalCostColumn]: NewTotalCost,
            [NewTotalFeesColumn]: NewAmazonFeeEstimate,
            [NewProfitColumn]: NewProfit,
            [NewProfitMarginColumn]: NewProfitMargin,

            [lastUpdatedColumn]: Utilities.formatDate(today, Session.getScriptTimeZone(), "MM/dd/yyyy"),
            [titleColumn]: title
        }
    });
}

// Batch update Google Sheets
updatedRows.forEach(entry => {
    for (var col in entry.data) {
        sheet.getRange(entry.row, parseInt(col) + 1).setValue(entry.data[col]);
    }
});

Logger.log("✅ Pricing data updated successfully!");


}
