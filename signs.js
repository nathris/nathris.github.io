var doc; //jsPDF document

var cW = 89;    //'c' size sign width, in mm
var cH = 57;    //'c' size sign height, in mm
var bW = 108;   //'b' size sign width, in mm
var bH = 140;   //'b' size sign height, in mm

var lm = 8;     //left margin, width of excess paper on c signs

var signs = []; //sign array
var size = 'c'; //current sign size

var pages = 0;

window.onload = function() {
    newDoc();
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
        doc.rect(2+x*w, 127+y*h, 60, 10,'F');
        doc.triangle(63+x*w,127+y*h,69+x*w,132+y*h,63+x*w,138+y*h,'F')
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

function splitBTitle(title) {
    var max = 12;
    if(title.length <= max) return title;

    var sTitle = title.split(' ');
    if(sTitle.length == 1) return title;

    var fTitle = ["",""];
    fTitle[0] = sTitle[0];
    fTitle[1] = "";
    for(var i = 1; i < sTitle.length; i++) {
        if(fTitle[0].length + sTitle[i].length < max) fTitle[0] += ' ' + sTitle[i];
        else {
            if (fTitle[1].length == 0) fTitle[1] = sTitle[i];
            else fTitle[1] += ' ' + sTitle[i];
        }
    }
    return fTitle;
}

function generateBSign(x, y, sign) {
    var w = bW; var h = bH;
    var product = splitBTitle(sign.product);
    doc.setFont("Helvetica Neue");
    doc.setFontStyle("medium");
    doc.setFontSize(34);
    doc.text(product, 5+x*w, 52+y*h);
    doc.setFontStyle("light");
    doc.setFontSize(15);
    doc.text(sign.brand, 5+x*w, 40.5+y*h);
    if(typeof product === 'object')
        doc.text(sign.description, 5+x*w, 32.5+y*h+20*product.length);
    else 
        doc.text(sign.description, 5+x*w, 60.5+y*h);
        
}

function generateCSign(x, y, sign) {
    var w = cW; var h = cH;
    doc.setFont("Helvetica Neue");

    // Product Name
    doc.setFontStyle("medium");
    if(sign.product.length < 14) {
        doc.setFontSize(17);
        doc.text(sign.product, lm+x*w, 46+y*h);
        doc.setFontStyle("light");
        doc.setFontSize(10);
        doc.text(sign.brand, lm+x*w, 40.5+y*h);
        doc.text(sign.description, lm+x*w, 50.5+y*h);
    } else if (sign.product.length < 20) {
        doc.setFontSize(15);
        doc.text(sign.product, lm+x*w, 46+y*h);
        doc.setFontStyle("light");
        doc.setFontSize(10);
        doc.text(sign.brand, lm+x*w, 41+y*h);
        doc.text(sign.description, lm+x*w, 50+y*h);
    } else {
        doc.setFontSize(13);
        doc.text(sign.product, lm+x*w, 46+y*h);
        doc.setFontStyle("light");
        doc.setFontSize(10);
        doc.text(sign.brand, lm+x*w, 41+y*h);
        doc.text(sign.description, lm+x*w, 50+y*h);
    }
    // Price
    switch(sign.priceType) {
        case "dollar":
            doc.setFontStyle("normal")
            p = sign.price.split(".");  
            if(p[0].length >= 3) {
                doc.setFontSize(58);
                doc.text((p[0]) ? p[0]:"0", lm+70.5+x*w, 62.5+y*h, align="right");
                doc.setFontSize(29);
                doc.text((p[1]) ? p[1]:"00", lm+70.5+x*w, 54.5+y*h);
            } else if(p[0] === "0") {
                doc.setFontSize(68);
                doc.text((p[1]) ? p[1]:"00", lm+71+x*w, 64+y*h, align="right");
                doc.setFontSize(33);
                doc.text("¢", lm+70+x*w, 55+y*h);
                if(sign.bulkType == 1) {
                    doc.setFontStyle("medium");
                    doc.setFontSize(9);
                    doc.text("per\n100g", lm+71+x*w, 60+y*h);                    
                } else if(sign.bulkType ==  2) {
                    doc.setFontStyle("medium");                    
                    doc.setFontSize(9);
                    doc.text("per lb", lm+71+x*w, 60+y*h);                    
                }
            } else {
                doc.setFontSize(74);
                doc.text((p[0]) ? p[0]:"0", (p[0].slice(-1)==1) ? lm+70+x*w : lm+68+x*w, 66+y*h, align="right");
                doc.setFontSize(37);
                doc.text((p[1]) ? p[1]:"00", lm+68+x*w, 56.5+y*h);
                if(sign.bulkType == 1) {
                    doc.setFontStyle("medium");
                    doc.setFontSize(10);
                    doc.text("per\n100g", lm+69+x*w, 61+y*h);                    
                } else if(sign.bulkType ==  2) {
                    doc.setFontStyle("medium");                    
                    doc.setFontSize(10);
                    doc.text("per lb", lm+69+x*w, 61+y*h);                    
                }
            }
            
            switch(sign.bulkType) {
                case 0:
                    doc.setFontSize(11);
                    doc.setFontStyle('medium');
                    doc.text("You Save $" + sign.youSave + " ea", lm+x*w , 75.5+y*h);
                break;
                case 1:
                    doc.setFontSize(10);
                    doc.setFontStyle('medium');
                    doc.text("You Save $" + sign.youSave + " per 100g", lm+x*w , 75.5+y*h); 
                break;
                case 2:
                    doc.setFontSize(10);
                    doc.setFontStyle('medium');
                    doc.text("You Save $" + sign.youSave + " per lb", lm+x*w , 75.5+y*h);
                break;
            }

            if(!sign.bulkType){
                doc.setFontSize(8.5);
                doc.setFontStyle('light');
                doc.text("Unit Price: $  ", lm+46+x*w, 73.5+y*h);
                doc.text(sign.unitPrice + " / " + sign.uom, lm+80+x*w, 73.5+y*h, align="right")
            }
        break;
        case "percent":
            doc.setFontStyle("normal")
            var p = sign.price;
            doc.setFontSize(68);
            doc.text((p) ? p:"00", lm+71+x*w, 64+y*h, align="right");
            doc.setFontSize(33);
            doc.text("%", lm+71+x*w, 55+y*h);
            doc.setFontSize(8.5);
            doc.text("Off\nAt Till", lm+72+x*w, 60+y*h);
            doc.setFontSize(11);
            doc.setFontStyle('medium');
            doc.text("Save Now!", lm+x*w , 75.5+y*h);
        break;
        case "bogo":
            doc.setFillColor(0,0,0);
            doc.roundedRect(lm+55+x*w, 45+y*h, 25, 25, 2, 2, 'F');
            doc.setTextColor(255,255,255);
            doc.setFontStyle('bold');
            doc.setFontSize(18);
            doc.text("BUY", lm+58+x*w, 52+y*h);
            doc.text("GET", lm+58+x*w, 57.5+y*h);
            doc.setFontSize(20);
            doc.text("FREE", lm+58+x*w, 63.5+y*h);
            doc.setFontSize(40);
            doc.text("1", lm+70.5+x*w, 57.5+y*h);

            doc.setFontSize(5);
            doc.text("Same Item of Equal", lm+67+x*w, 66+y*h, align="center");
            doc.text("or Lesser Value", lm+67+x*w, 68+y*h, align="center");
        

            doc.setTextColor(0,0,0);
            doc.setFontSize(11);
            doc.setFontStyle('medium');
            doc.text("You Save $" + sign.regPrice + " ea", lm+x*w , 75.5+y*h);
        break;
    }

    // Details
    doc.setFontSize(8.5);
    doc.setFontStyle('light');
    if(!sign.famGroup)
        doc.text(sign.end, lm+81+x*w, 77.5+y*h, align="right");

    if(sign.bulkType) {
        doc.setFontStyle('bold');
        doc.setFontSize(16);
        doc.text("PLU# " + sign.upc, lm+81+x*w, 74+y*h,align="right");
    } else {
        doc.setFontSize(8.5);
        doc.setFontStyle('light');
        doc.text(sign.upc, lm+44+x*w, 77.5+y*h);
    }

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
            doc.text("ED", lm+61.5+x*w, 77.5+y*h);
        break;
        case 2://pc
            doc.text("PC", lm+61.5+x*w, 77.5+y*h);
        break;
        case 3://ts
            doc.text("TS", lm+61.5+x*w, 77.5+y*h);        
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
