var doc;
var w = 89;
var h = 57;
var lm = 8;

var signs = [];

var pages = 0;

window.onload = function() {
    newDoc();

    testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|'  +
    'Opera Mini|IEMobile|Mobile' , 
   'i');
   if (testExp.test(navigator.userAgent)) {
           document.getElementById("genButton").value="Download";
    }else{
        //addSign();
        printSigns();
    }

}

function newDoc(){
    doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
    });

    doc.addFont("HelveticaNeue Light.ttf","Helvetica Neue", "normal");
    doc.addFont("HelveticaNeueBold.ttf","Helvetica Neue", "bold");
    doc.addFont("HelveticaNeueMedium.ttf","Helvetica Neue", "medium");
}

function drawBackground(x,y) {
    doc.setFillColor(255,0,0);
    doc.rect(5+x*w, 24+y*h, 86, 10,'F');
    doc.setFillColor(0,150,0);
    doc.rect(5+x*w, 69+y*h, 41, 10,'F');
    doc.triangle(46+x*w,69+y*h,52+x*w,74+y*h,46+x*w,79+y*h,'F')
}

function generateSign(x, y, sign) {
    doc.setFont("Helvetica Neue");

    // Product Name
    doc.setFontStyle("bold");
    if(sign.product.length < 14) doc.setFontSize(15);
    else if (sign.product.length < 20) doc.setFontSize(14);
    else doc.setFontSize(12);
    doc.text(sign.product, lm+x*w, 46+y*h);

    // Brand and Description
    doc.setFontStyle("normal");
    doc.setFontSize(10);
    doc.text(sign.brand, lm+x*w, 41+y*h);
    doc.text(sign.description, lm+x*w, 50+y*h);

    // Price big
    doc.setFont("helvetica");
    p = sign.price.split(".");  
    if(p[0].length >= 3)  doc.setFontSize(60);
    else if(p[0].length == 2)  doc.setFontSize(66);
    else doc.setFontSize(68);
    doc.text((p[0]) ? p[0]:"0", lm+68+x*w, 64+y*h, align="right");
    // Price small
    if(p[0].length >= 3)  doc.setFontSize(30);
    else if(p[0].length == 2)  doc.setFontSize(33);
    else doc.setFontSize(34);
    doc.text((p[1]) ? p[1]:"00", lm+68+x*w, p[0].length >= 3 ? 56+y*h : 55+y*h);
    doc.setFont("Helvetica Neue");

    // You Save
    doc.setFontSize(11);
    doc.setFontStyle('bold');
    if(sign.youSave) {
        doc.text("You Save $" + sign.youSave + " ea", lm+x*w , 75.5+y*h);
    } else {
        doc.text("Save Now!", lm+x*w , 75.5+y*h);
    }

    // Details
    doc.setFontSize(8);
    doc.setFontStyle('normal');
    doc.text("Unit Price: $  ", lm+46+x*w, 73.5+y*h);
    doc.text(sign.unitPrice + " / " + sign.uom, lm+80+x*w, 73.5+y*h, align="right")
    doc.text(sign.upc, lm+45+x*w, 77.5+y*h);
    doc.text(sign.end, lm+81+x*w, 77.5+y*h, align="right");

    // Extras
    if(sign.thisVar) {
        doc.setFontSize(14);
        doc.setFontStyle('bold');
        doc.text("This Variety Only", lm+x*w, 66+y*h);
    }
    if(sign.closeDate) {
        doc.setFontSize(16);
        doc.setFontStyle('bold');
        doc.text("Close-Dated", lm+80+x*w, 41+y*h, align="right");
    }
    
    switch(sign.saleType) {
        case 0://ad
            doc.setFillColor(0);
            doc.triangle(lm+63+x*w,76.5+y*h,lm+64+x*w,75.25+y*h,lm+65+x*w,76.5+y*h,'F');
            doc.triangle(lm+63+x*w,76.5+y*h,lm+64+x*w,77.75+y*h,lm+65+x*w,76.5+y*h,'F');
        break;
        case 1://ed
            doc.text("ED", lm+62.5+x*w, 77.5+y*h);
        break;
        case 2://pc
            doc.text("PC", lm+62.5+x*w, 77.5+y*h);
        break;
        case 3://ts
            doc.text("TS", lm+62.5+x*w, 77.5+y*h);        
        break;
    }
    
}

function clearSigns() {
    signs = [];
    printSigns();
}

function printSigns() {
    showBackground = document.getElementById("bgCheck").checked;
    pages = 0;
    for(i = 0; i < signs.length; i++) {
        y = Math.floor(i/3);
        x = i%3;
        if(i%9 == 0 && i > 2) {
            pages++;
            doc.addPage();
        }
        if(showBackground) drawBackground(x,y-3*pages);
        //generateSign(x, y-3*pages, signs[i].brand, signs[i].product, signs[i].description, signs[i].price, signs[i].unit, signs[i].uom, signs[i].upc, signs[i].end,signs[i].sale,signs[i].youSave.toFixed(2));
        generateSign(x, y-3*pages, signs[i]);
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
    
    
    regPrice = document.getElementById("rpValue").value;
    pDiv = document.getElementById("priceDiv").value;
    signs[n].price = document.getElementById("pValue").value;
    pricePer = signs[n].price / pDiv;
    if(pDiv != "1") signs[n].price = pDiv + "/" + signs[n].price;
    
    signs[n].youSave = (regPrice - pricePer).toFixed(2);
    if(signs[n].youSave < 0) {
        signs.pop();
        alert("Error: Sale price is higher than regular price!");
        return;
    }
    
    
    signs[n].unitPrice = document.getElementById("uPrice").value;
    signs[n].uom = document.getElementById("UOM").value;
    signs[n].upc = document.getElementById("UPC").value;

    endDate = document.getElementById("endDate").valueAsDate;
    signs[n].end = (endDate.getUTCMonth()+1) + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear();
    signs[n].saleType = document.getElementById("signType").selectedIndex;

    tv = document.getElementById("thisVar").checked;
    cd = document.getElementById("closeDate").checked;
    signs[n].thisVar = tv;
    signs[n].closeDate = cd;


    document.getElementById("numSigns").innerHTML = signs.length;

    printSigns();
}
