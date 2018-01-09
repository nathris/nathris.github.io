var bW = 108;   //'b' size sign width, in mm
var bH = 140;   //'b' size sign height, in mm


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
    font("Helvetica Neue", "medium", 34);
    doc.text(product, 5+x*w, 55+y*h);
    font("Helvetica Neue", "medium", 18);
    doc.text(sign.brand, 5+x*w, 43.5+y*h);
    if(typeof product === 'object')
        doc.text(sign.description, 5+x*w, 36.5+y*h+20*product.length);
    else 
        doc.text(sign.description, 5+x*w, 64.5+y*h);

    // Price
    switch(sign.priceType) {
        case "dollar":
            p = sign.price.split(".");  

            if(p[0] === "0") {
                font("Helvetica Neue", "normal", 120);
                doc.text((p[1]) ? p[1]:"00",    lm+76+x*w,      112+y*h,     align="right");
                font("Helvetica Neue", "normal", 60);
                doc.text("¢",                   lm+75+x*w,      95+y*h);
                if(sign.bulkType == 1) {
                    font("Helvetica Neue", "medium", 15);
                    doc.text("per\n100g",       lm+76+x*w,      104+y*h);                    
                } else if(sign.bulkType ==  2) {
                    font("Helvetica Neue", "medium", 15);
                    doc.text("per\nlb",          lm+76+x*w,     104+y*h);                    
                }
            } else {
                font("Helvetica Neue", "normal", 110);
                doc.text((p[0]) ? p[0]:"0",     lm+70.5+x*w,    112+y*h,   align="right");
                font("Helvetica Neue", "normal", 55);
                doc.text((p[1]) ? p[1]:"00",    lm+70.5+x*w,    98+y*h);

                if(sign.bulkType == 1) {
                    font("Helvetica Neue", "medium", 15);
                    doc.text("per\n100g",       lm+71+x*w,      104+y*h);                    
                } else if(sign.bulkType ==  2) {
                    font("Helvetica Neue", "medium", 15);
                    doc.text("per\nlb",          lm+71+x*w,      104+y*h);                    
                }
            }
            
            switch(sign.bulkType) {
                case 0:
                font("Helvetica Neue", "medium", 13);
                    doc.text("You Save " + sign.youSave + " ea", 5+x*w , 133.5+y*h);
                break;
                case 1:
                    font("Helvetica Neue", "medium", 13);
                    doc.text("You Save " + sign.youSave + " per 100g", 5+x*w , 133.5+y*h); 
                break;
                case 2:
                    font("Helvetica Neue", "medium", 13);
                    doc.text("You Save " + sign.youSave + " per lb", 5+x*w , 133.5+y*h);
                break;
            }

            if(!sign.bulkType){
                font("Helvetica Neue", "normal", 10);
                doc.text("Unit Price: $  ", lm+50+x*w, 125.5+y*h);
                doc.text(sign.unitPrice + " / " + sign.uom, lm+92+x*w, 125.5+y*h, align="right")
            }
        break;
        case "percent":
            var p = sign.price;
            font("Helvetica Neue", "normal", 110);
            doc.text((p) ? p:"00", lm+71+x*w, 112+y*h, align="right");
            font("Helvetica Neue", "normal", 55);
            doc.text("%", lm+71+x*w, 98+y*h);
            font("Helvetica Neue", "normal", 13);
            doc.text("Off\nAt Till", lm+72+x*w, 105+y*h);
            font("Helvetica Neue", "medium", 13);
            doc.text("Save Now!", lm+x*w , 133.5+y*h);
        break;
        case "bogo":
            drawBogo(x,y,w,h,55,75,1.5);
            doc.setTextColor(0,0,0);
            font("Helvetica Neue", "medium", 13);
            doc.text("You Save " + sign.regPrice + " ea", lm+x*w , 133.5+y*h);
        break;
    }
    
    // Details
    if(sign.bulkType) {
        font("Helvetica Neue", "bold", 16);
        doc.text("PLU# " + sign.upc, lm+80+x*w, 125.5+y*h,align="right");
    } else {
        font("Helvetica Neue", "normal", 9.5);
        doc.text(sign.upc, lm+50+x*w, 131.5+y*h);
    }

    font("Helvetica Neue", "normal", 9.5);
    switch(sign.saleType) {
        case 0://ad
            doc.setFillColor(0);
            doc.triangle(lm+70.5+x*w,130.5+y*h,    lm+71.5+x*w,129.25+y*h,    lm+72.5+x*w,130.5+y*h,'F');
            doc.triangle(lm+70.5+x*w,130.5+y*h,    lm+71.5+x*w,131.75+y*h,    lm+72.5+x*w,130.5+y*h,'F');
            doc.text(sign.end, lm+92+x*w, 131.5+y*h, align="right");
        break;
        case 1://ed
            doc.text("ED " + sign.end, lm+93+x*w, 131.5+y*h, align="right");
        break;
        case 2://pc
            doc.text("PC " + sign.end, lm+93+x*w, 131.5+y*h, align="right");
        break;
        case 3://ts
            doc.text("TS " + sign.end, lm+93+x*w, 131.5+y*h, align="right");
        break;
    }
        
}