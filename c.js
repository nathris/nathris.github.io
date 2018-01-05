var cW = 89;    //'c' size sign width, in mm
var cH = 57;    //'c' size sign height, in mm

function generateCSign(x, y, sign) {
    var w = cW; var h = cH;
    doc.setFont("Helvetica Neue");

    // Product Name
    if(sign.product.length < 14) {
        font("Helvetica Neue", "medium", 17);
        doc.text(sign.product,      lm+x*w,     46+y*h);
        font("Helvetica Neue", "light", 10);
        doc.text(sign.brand,        lm+x*w,     40.5+y*h);
        doc.text(sign.description,  lm+x*w,     50.5+y*h);
    } else if (sign.product.length < 20) {
        font("Helvetica Neue", "medium", 15);
        doc.text(sign.product,      lm+x*w,     46+y*h);
        font("Helvetica Neue", "light", 10);
        doc.text(sign.brand,        lm+x*w,     41+y*h);
        doc.text(sign.description,  lm+x*w,     50+y*h);
    } else {
        font("Helvetica Neue", "medium", 13);
        doc.text(sign.product,      lm+x*w,     46+y*h);
        font("Helvetica Neue", "light", 10);
        doc.text(sign.brand,        lm+x*w,     41+y*h);
        doc.text(sign.description,  lm+x*w,     50+y*h);
    }
    // Price
    switch(sign.priceType) {
        case "dollar":
            doc.setFontStyle("normal")
            p = sign.price.split(".");  
            if(p[0].length >= 3) {
                font("Helvetica Neue", "normal", 58);
                doc.text((p[0]) ? p[0]:"0",     lm+70.5+x*w,    62.5+y*h,   align="right");
                font("Helvetica Neue", "normal", 29);
                doc.text((p[1]) ? p[1]:"00",    lm+70.5+x*w,    54.5+y*h);
            } else if(p[0] === "0") {
                font("Helvetica Neue", "normal", 68);
                doc.text((p[1]) ? p[1]:"00",    lm+71+x*w,      64+y*h,     align="right");
                font("Helvetica Neue", "normal", 33);
                doc.text("¢",                   lm+70+x*w,      55+y*h);
                if(sign.bulkType == 1) {
                    font("Helvetica Neue", "medium", 9);
                    doc.text("per\n100g",       lm+71+x*w,      60+y*h);                    
                } else if(sign.bulkType ==  2) {
                    font("Helvetica Neue", "medium", 9);
                    doc.text("per lb",          lm+71+x*w,      60+y*h);                    
                }
            } else {
                font("Helvetica Neue", "normal", 74);
                doc.text((p[0]) ? p[0]:"0", (p[0].slice(-1)==1) ? lm+70+x*w : lm+68+x*w, 66+y*h, align="right");
                font("Helvetica Neue", "normal", 37);
                doc.text((p[1]) ? p[1]:"00",    lm+68+x*w,  56.5+y*h);
                if(sign.bulkType == 1) {
                    font("Helvetica Neue", "medium", 10);
                    doc.text("per\n100g",       lm+69+x*w,  61+y*h);                    
                } else if(sign.bulkType ==  2) {
                    font("Helvetica Neue", "medium", 10);
                    doc.text("per lb",          lm+69+x*w,  61+y*h);                    
                }
            }
            
            switch(sign.bulkType) {
                case 0:
                font("Helvetica Neue", "medium", 11);
                    doc.text("You Save " + sign.youSave + " ea", lm+x*w , 75.5+y*h);
                break;
                case 1:
                    font("Helvetica Neue", "medium", 10);
                    doc.text("You Save " + sign.youSave + " per 100g", lm+x*w , 75.5+y*h); 
                break;
                case 2:
                    font("Helvetica Neue", "medium", 10);
                    doc.text("You Save " + sign.youSave + " per lb", lm+x*w , 75.5+y*h);
                break;
            }

            if(!sign.bulkType){
                font("Helvetica Neue", "light", 8.5);
                doc.text("Unit Price: $  ", lm+46+x*w, 73.5+y*h);
                doc.text(sign.unitPrice + " / " + sign.uom, lm+80+x*w, 73.5+y*h, align="right")
            }
        break;
        case "percent":
            var p = sign.price;
            font("Helvetica Neue", "normal", 68);
            doc.text((p) ? p:"00", lm+71+x*w, 64+y*h, align="right");
            font("Helvetica Neue", "normal", 33);
            doc.text("%", lm+71+x*w, 55+y*h);
            font("Helvetica Neue", "normal", 8.5);
            doc.text("Off\nAt Till", lm+72+x*w, 60+y*h);
            font("Helvetica Neue", "medium", 11);
            doc.text("Save Now!", lm+x*w , 75.5+y*h);
        break;
        case "bogo":
            drawBogo(x,y,w,h,55,45,1);
            doc.setTextColor(0,0,0);
            font("Helvetica Neue", "medium", 11);
            doc.text("You Save " + sign.regPrice + " ea", lm+x*w , 75.5+y*h);
        break;
    }

    // Details
    font("Helvetica Neue", "light", 8.5);
    doc.text(sign.end, lm+81+x*w, 77.5+y*h, align="right");

    if(sign.bulkType) {
        font("Helvetica Neue", "bold", 16);
        doc.text("PLU# " + sign.upc, lm+81+x*w, 74+y*h,align="right");
    } else {
        font("Helvetica Neue", "light", 8.5);
        doc.text(sign.upc, lm+44+x*w, 77.5+y*h);
    }

    // Extras
    if(sign.thisVar) {
        font("Helvetica Neue", "bold", 14);
        doc.text("This Variety Only", lm+x*w, 66+y*h);
    }
    if(sign.closeDate) {
        font("Helvetica Neue", "bold", 16);
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