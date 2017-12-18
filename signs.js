var doc;
var w = 88;
var h = 57;

window.onload = function() {
    //generateSign();
    doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
    });

    testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|'  +
    'Opera Mini|IEMobile|Mobile' , 
   'i');

   if (testExp.test(navigator.userAgent)) {
           document.getElementById("genButton").value="Download";
    }else{
        addSign();
    }
}

function drawBackground(x,y) {
    doc.setFillColor(255,0,0);
    doc.rect(10+x*w, 26+y*h, 86, 10,'F');
    doc.setFillColor(0,150,0);
    doc.rect(10+x*w, 69+y*h, 40, 10,'F');
    doc.triangle(50+x*w,69+y*h,55+x*w,74+y*h,50+x*w,79+y*h,'F')
}

function generateSign(x, y, productBrand, productName, productDescription, price, unitPrice, UOM, UPC, endDate, saleType, youSave, options) {
    doc.setFont('arial');

    lm = 10.5;

    doc.setFontStyle("bold");
    doc.setFontSize(14.5);
    doc.text(productName, lm+x*w, 46+y*h);

    doc.setFontStyle("normal");
    doc.setFontSize(10);
    doc.text(productBrand, lm+x*w, 41+y*h);
    doc.text(productDescription, lm+x*w, 524+y*h);

    p = price.split(".");    
    doc.setFontSize(69);
    doc.text((p[0]) ? p[0]:"0", lm+67+x*w, 64+y*h, align="right");
    doc.setFontSize(34.5);
    doc.text((p[1]) ? p[1]:"00", lm+68+x*w, 55+y*h);

    doc.setFontSize(11);
    doc.setFontStyle('bold');
    if(youSave) {
        doc.text("You Save $" + youSave + " ea", lm+x*w , 75+y*h);
    } else {
        doc.text("Save Now!", lm+x*w , 75+y*h);
    }

    doc.setFontSize(8);
    doc.setFontStyle('normal');
    doc.text("Unit Price: $  " + unitPrice + " / " + UOM, lm+47+x*w, 73.5+y*h);
    doc.text(UPC, lm+45+x*w, 77.5+y*h);
    doc.text(endDate, lm+69+x*w, 77.5+y*h);

    if(options.thisVar) {
        doc.setFontSize(14);
        doc.setFontStyle('bold');
        doc.text("This Variety Only", lm+x*w, 66+y*h);
    }

    if(options.closeDate) {
        doc.setFontSize(16);
        doc.setFontStyle('normal');
        doc.text("Close-Dated", lm+85+x*w, 41+y*h, align="right");
    }
    

    switch(saleType) {
        case 0://ad
            doc.setFillColor(0);
            doc.triangle(lm+64+x*w,77+y*h,lm+65+x*w,75.75+y*h,lm+66+x*w,77+y*h,'F');
            doc.triangle(lm+64+x*w,77+y*h,lm+65+x*w,78.25+y*h,lm+66+x*w,77+y*h,'F');
        break;
        case 1://ed
            doc.text("ED", lm+63+x*w, 78+y*h);
        break;
        case 2://pc
            doc.text("PC", lm+63+x*w, 78+y*h);
        break;
        case 3://ts
            doc.text("TS", lm+63+x*w, 78+y*h);        
        break;
    }
    
}

function addSign() {
    brand = document.getElementById("bName").value;
    product = document.getElementById("pName").value;
    description = document.getElementById("dName").value;
    
    
    regPrice = document.getElementById("rpValue").value;
    pDiv = document.getElementById("priceDiv").value;
    price = document.getElementById("pValue").value;
    pricePer = price / pDiv;
    if(pDiv != "1") price = pDiv + "/" + price;
    
    youSave = regPrice - pricePer;
    if(youSave < 0) {
        alert("Error: Sale price is higher than regular price!");
        return;
    }
    
    
    unit = document.getElementById("uPrice").value;
    uom = document.getElementById("UOM").value;
    upc = document.getElementById("UPC").value;

    endDate = document.getElementById("endDate").valueAsDate;
    end = (endDate.getUTCMonth()+1) + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear();
    sale = document.getElementById("signType").selectedIndex;
    showBackground = document.getElementById("bgCheck").checked;

    tv = document.getElementById("thisVar").checked;
    cd = document.getElementById("closeDate").checked;
    options = {thisVar: tv, closeDate: cd};

    for(i=0; i<3;i++){
        for(j=0; j<3;j++){
            if(showBackground) drawBackground(i,j);
            generateSign(i, j, brand, product, description, price, unit, uom, upc, end,sale,youSave.toFixed(2), options);
        }
    }
    
    //doc.save('test.pdf');
    document.getElementById("preview").src = doc.output('datauristring');
    doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
    });
}
