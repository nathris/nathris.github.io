var doc;

window.onload = function() {
    //generateSign();
    doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
    });

    

}

function generateSign(x, y, productBrand, productName, productDescription, price, unitPrice, UOM, UPC, endDate) {
    doc.setFont('arial');

    w = 88;
    h = 57

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
    doc.text((p[1]) ? p[1]:"00", 83+x*w, 55+y*h);

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text("Save Now!", 11+x*w , 75+y*h);

    doc.setFontSize(9);
    doc.setFontStyle('normal');
    doc.text("Unit Price: $ " + unitPrice + " / " + UOM, 58+x*w, 74+y*h);
    doc.text(UPC + "   " + endDate, 57+x*w, 78+y*h);
}

function addSign() {
    brand = document.getElementById("bName").value;
    product = document.getElementById("pName").value;
    description = document.getElementById("dName").value;
    price = document.getElementById("pValue").value;
    unit = document.getElementById("uPrice").value;
    uom = document.getElementById("UOM").value;
    upc = document.getElementById("UPC").value;
    end = document.getElementById("endDate").value;

    for(i=0; i<3;i++){
        for(j=0; j<3;j++){
            generateSign(i, j, brand, product, description, price, unit, uom, upc, end);
        }
    }
    
    doc.save('test.pdf');
    
}

/*function generateSign() {
    sign = document.getElementById("sign");
    brand = document.getElementById("bName").value;
    product = document.getElementById("pName").value;
    description = document.getElementById("dName").value;
    price = document.getElementById("pValue").value.split(".");
    dollars = (price[0]) ? price[0]:"0";
    cents = (price[1]) ? price[1]:"00";

    document.getElementById("signBrand1").innerHTML = brand;
    document.getElementById("signProduct1").innerHTML = product;
    document.getElementById("signDescription1").innerHTML = description;
    document.getElementById("signPrice11").innerHTML = dollars;
    document.getElementById("signPrice22").innerHTML = cents;
}

function closePrint() {
    document.body.removeChild(this.__container__);
}

function setPrint() {
    this.contentWindow.__container__ = this;
    this.contentWindow.onbeforeunload = closePrint;
    this.contentWindow.onafterprint = closePrint;
    this.contentWindow.focus();
    this.contentWindow.print();
}

function printSigns() {
    printWindow = document.createElement("iframe");
    printWindow.onload = setPrint();
    printWindow.style.visibility = "hidden";
    printWindow.style.position = "fixed";
    printWindow.style.right = "0";
    printWindow.style.bottom = "0";
    printWindow.src = sURL;
    document.body.appendChild(printWindow);
}*/