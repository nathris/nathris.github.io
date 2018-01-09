var doc; //jsPDF document

var lm = 8;     //left margin, width of excess paper on c signs

var signs = []; //sign array
var size = 'c'; //current sign size

var pages = 0;

window.onload = function() {
    newDoc();
    debug();
    printSigns();
}

function newDoc(){
    size = document.querySelector('input[name="signSize"]:checked').value;
    if(size == 'b') {
        doc = new jsPDF({
            orientation: 'portrait',
            format: 'letter'
        });
    }
    else {
        doc = new jsPDF({
            orientation: 'landscape',
            format: 'letter'
        });
    }

    //C description, pricing
    doc.addFont("HelveticaNeueLight.ttf","Helvetica Neue", "light");
    doc.addFont("HelveticaNeueBold.ttf","Helvetica Neue", "bold");
    doc.addFont("HelveticaNeueMedium.ttf","Helvetica Neue", "medium");
    doc.addFont("HelveticaNeue.ttf", "Helvetica Neue", "normal");

    //B description
    doc.addFont("Raleway-Light.ttf", "Raleway", "light");
    doc.addFont("Raleway-Regular.ttf", "Raleway", "normal");
    doc.addFont("Raleway-Medium.ttf", "Raleway", "medium");    
    doc.addFont("Raleway-Bold.ttf", "Raleway", "bold");
    
}

function drawBackground(x,y) {
    if (size == 'b') {
        var w = bW; var h = bH;
        doc.setFillColor(255,0,0);
        doc.rect(2+x*w, 2+y*h, 103, 30,'F');
        doc.setFillColor(0,150,0);
        doc.rect(2+x*w, 127+y*h, 50, 12,'F');
        doc.triangle(52+x*w, 127+y*h,    57+x*w, 133+y*h,    52+x*w,139+y*h,'F')
    }
    else if (size == 'c') {
        w = cW; h = cH;
        doc.setFillColor(255,0,0);
        doc.rect(5+x*w, 24+y*h, 86, 10,'F');
        doc.setFillColor(0,150,0);
        doc.rect(5+x*w, 69+y*h, 41, 10,'F');
        doc.triangle(46+x*w,69+y*h,52+x*w,74+y*h,46+x*w,79+y*h,'F');
    }
}


function font(fontName, fontWeight, fontSize) {
    doc.setFont(fontName);
    doc.setFontStyle(fontWeight);
    doc.setFontSize(fontSize);
}

function drawBogo(x,y,w,h,sx,sy,scale) {
    doc.setFillColor(0,0,0);
    doc.roundedRect(lm+sx+x*w, sy+y*h, 25*scale, 25*scale, 2, 2, 'F');
    doc.setTextColor(255,255,255);
    font("Helvetica Neue", "bold", 18*scale);
    doc.text("BUY", lm+sx+3*scale+x*w, sy+7*scale+y*h);
    doc.text("GET", lm+sx+3*scale+x*w, sy+12.5*scale+y*h);
    font("Helvetica Neue", "bold", 20*scale);
    doc.text("FREE", lm+sx+3*scale+x*w, sy+18.5*scale+y*h);
    font("Arial", "bold", 40*scale);
    doc.text("1", lm+sx+15.5*scale+x*w, sy+12.5*scale+y*h);
    font("Helvetica Neue", "normal", 5*scale);
    doc.text("Same Item of Equal", lm+sx+12*scale+x*w, sy+21*scale+y*h, align="center");
    doc.text("or Lesser Value", lm+sx+12*scale+x*w, sy+23*scale+y*h, align="center");
}

function clearSigns() {
    signs = [];
    printSigns();
}

function printSigns() {
    showBackground = document.getElementById("bgCheck").checked;
    pages = 0;
    for(var i = 0; i < signs.length; i++) {
        if(size == 'c') {
            var y = Math.floor(i/3);
            var x = i%3;
            
            if(i%9 == 0 && i > 2) {
                pages++;
                doc.addPage();
            }
            if(showBackground) drawBackground(x,y-3*pages);
            generateCSign(x, y-3*pages, signs[i]);            
        } else if (size == 'b') {
            var y = Math.floor(i/2);
            var x = i%2;
            if(i%4 == 0 && i > 2) {
                pages++;
                doc.addPage();
            }
            if(showBackground) drawBackground(x,y-2*pages);
            generateBSign(x, y-2*pages, signs[i]);
            
        }
        //generateSign(x, y-3*pages, signs[i].brand, signs[i].product, signs[i].description, signs[i].price, signs[i].unit, signs[i].uom, signs[i].upc, signs[i].end,signs[i].sale,signs[i].youSave.toFixed(2));
    }
    
    document.getElementById("preview").src = doc.output('datauristring');
    newDoc();
}

function addSign() {
    n = signs.length;
    signs[n] = {};
    signs[n].brand = document.getElementById("bName").value;
    signs[n].product = document.getElementById("pName").value;
    signs[n].description = document.getElementById("dName").value;
    signs[n].priceType = document.querySelector('input[name="priceType"]:checked').value;
    
    signs[n].regPrice = document.getElementById("rpValue").value;
    pDiv = document.getElementById("priceDiv").value;
    signs[n].price = document.getElementById("pValue").value;
    pricePer = signs[n].price / pDiv;
    if(pDiv != "1") signs[n].price = pDiv + "/" + signs[n].price;
    if(signs[n].priceType == "percent") signs[n].price = document.getElementById("percentOff").value;

    
    signs[n].youSave = (signs[n].regPrice - pricePer).toFixed(2);
    if(signs[n].youSave < 0) {
        signs.pop();
        alert("Error: Sale price is higher than regular price!");
        return;
    } else if(signs[n].youSave < 1) {
        signs[n].youSave = signs[n].youSave*100 + "¢";
    } else {
        signs[n].youSave = '$' + signs[n].youSave;
    }

    if(signs[n].regPrice < 1) {
        signs[n].regPrice = signs[n].regPrice*100 + "¢";
    } else {
        signs[n].regPrice = '$' + signs[n].regPrice;
    }

    
    
    signs[n].unitPrice = document.getElementById("uPrice").value;
    signs[n].uom = document.getElementById("UOM").value;
    signs[n].upc = document.getElementById("UPC").value;

    endDate = document.getElementById("endDate").valueAsDate;
    signs[n].end = (endDate.getUTCMonth()+1) + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear();
    signs[n].saleType = document.getElementById("signType").selectedIndex;
    signs[n].bulkType = document.getElementById("bulkType").selectedIndex;
    

    signs[n].thisVar = document.getElementById("thisVar").checked;
    signs[n].closeDate = document.getElementById("closeDate").checked;
    signs[n].famGroup = document.getElementById("famGroup").checked;


    document.getElementById("numSigns").innerHTML = signs.length;

    printSigns();
}

function debug() {
    signs = [
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "0.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "2/1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "25", priceType: "percent",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "bogo",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 1, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"4011", youSave: "40¢"},
        { brand: "Kraft", bulkType: 2, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"4011", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: true, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: true, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: true, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: true, description: "Turkey\n120g", end: "12/25/2017", famGroup: false, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"},
        { brand: "Kraft", bulkType: 0, closeDate: false, description: "Selected Varieties\n120g", end: "12/25/2017", famGroup: true, price: "1.99", priceType: "dollar",
        product: "Stove Top Stuffing Mix", regPrice: "$2.39", saleType: 0, thisVar: false, unitPrice: "1.04", uom: "100G", upc:"6618804390", youSave: "40¢"}];
}