var doc;
var w = 88;
var h = 57;

window.onload = function() {
    //generateSign();
    doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
    });

    if((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)){
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

function generateSign(x, y, productBrand, productName, productDescription, price, unitPrice, UOM, UPC, endDate, saleType) {
    doc.setFont('arial');

    doc.setFontStyle("bold");
    doc.setFontSize(14);
    doc.text(productName, 11+x*w, 46+y*h);

    doc.setFontStyle("normal");
    doc.setFontSize(12);
    doc.text(productBrand, 11+x*w, 41+y*h);
    doc.text(productDescription, 11+x*w, 51+y*h);

    p = price.split(".");    
    doc.setFontSize(66);
    doc.text((p[0]) ? p[0]:"0", 82+x*w, 64+y*h, align="right");
    doc.setFontSize(33);
    doc.text((p[1]) ? p[1]:"00", 83+x*w, 56+y*h);

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text("Save Now!", 11+x*w , 75+y*h);

    doc.setFontSize(9);
    doc.setFontStyle('normal');
    doc.text("Unit Price: $ " + unitPrice + " / " + UOM, 58+x*w, 74+y*h);
    doc.text(UPC, 55+x*w, 78+y*h);
    doc.text(endDate, 79+x*w, 78+y*h);

    switch(saleType) {
        case 0://ad
            doc.setFillColor(0);
            doc.triangle(75+x*w,77+y*h,76+x*w,76+y*h,77+x*w,77+y*h,'F');
            doc.triangle(75+x*w,77+y*h,76+x*w,78+y*h,77+x*w,77+y*h,'F');
        break;
        case 1://ed
            doc.text("ED", 74+x*w, 78+y*h);
        break;
        case 2://pc
            doc.text("PC", 74+x*w, 78+y*h);
        break;
        case 3://ts
            doc.text("TS", 74+x*w, 78+y*h);        
        break;
    }
    
}

function addSign() {
    brand = document.getElementById("bName").value;
    product = document.getElementById("pName").value;
    description = document.getElementById("dName").value;
    price = document.getElementById("pValue").value;
    unit = document.getElementById("uPrice").value;
    uom = document.getElementById("UOM").value;
    upc = document.getElementById("UPC").value;

    endDate = document.getElementById("endDate").valueAsDate;
    end = (endDate.getUTCMonth()+1) + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear();
    sale = document.getElementById("signType").selectedIndex;
    showBackground = document.getElementById("bgCheck").checked;
    for(i=0; i<3;i++){
        for(j=0; j<3;j++){
            if(showBackground) drawBackground(i,j);
            generateSign(i, j, brand, product, description, price, unit, uom, upc, end,sale);
        }
    }
    
    //doc.save('test.pdf');
    document.getElementById("preview").src = doc.output('datauristring');
    doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
    });
}
