/**
* @NApiVersion 2.1
* @NScriptType ClientScript
* @NModuleScope SameAccount
*/
/***************************************************************************************
    ** Copyright (c) 1998-2024 Softype, Inc.
   ** Ventus Infotech Private Limited,
   ** All Rights Reserved.
   **
   ** This software is the confidential and proprietary information of Softype, Inc. ("Confidential Information").
   ** You shall not disclose such Confidential Information and shall use it only in accordance with the terms of
   ** the license agreement you entered into with Softype.
   **
   ** @Author      : Rohit Jha
   ** @Dated       : 03-05-2023
   ** @Version     : 2.1
   ** @Description : for sending email
   ***************************************************************************************/
   define(['N/search', 'N/xml', 'N/https', 'N/record', 'N/search', 'N/format'], function (search, xml, https, record, search, format) {
    function pageInit(context) {

        const searchParams = new URLSearchParams(document.URL);
        const templateId = searchParams.get("templateId");
        const emailid = searchParams.get('email');
        const timestamp = searchParams.get('nonce');
        var requestData = {
            'action' : "getSigndata",
            'email' : emailid,
            'timestamp' :timestamp
        }
        console.log("req_data",requestData)
        var response = https.post({
            url: 'https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2259&deploy=1&compid=TSTDRV1338970&h=f966d848809f2747bfb3', // Replace with your SuiteScript script URL
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/pdf'
            }
        });
        if (response.body != "") {
            console.log("response",response)
            var htmlemail = '<h4>You Have Already Signed The Document</h4><div style="margin-top:15px;" class="btnModalY" style="gap:20px"><span><input class="btnAP" id="btnCancel" type="button" onClick="closeWindow()" value="Close" /></span>';
            htmlemail += '<span style="margin-left:30px"><input class="btnAP" onClick="init()" type="button" value="Sign Again" /></span></div>';
            var option = {
                width: 500,
                height: 185,
                content: htmlemail,
                title: 'Alert',
                ignoreDelay: true,
                closeButton: false,
                blockScroll: false,
                closeOnClick: false,
                // cancelButton:"",
                onClose: function () {
                    console.log('hereaja')
                }
            };
            var M = new jBox('Modal', option);
            var colorBg = "#607799"
            $('#image_loader').hide();
            M.open();
            $('.jBox-Modal .jBox-title').css('background-color', colorBg);
        
        }

        var savediv = document.getElementById("addsavebutton");
        var saveButton = document.createElement('button');
        saveButton.className = 'btn btn-primary col-md-2 col-sm-2 col-lg-1'
        saveButton.textContent = "Save"
        saveButton.type = 'button'
        saveButton.style.borderRadius = '50px;'
        // saveButton.style.top = '0'

        // saveButton.style.marginBottom = '50px;'
        savediv.appendChild(saveButton);
        saveButton.addEventListener('click', () => {
            createTemplate(emailid, timestamp);
        });



        var rec_Obj = record.load({
            type: 'customrecord_st_pdf_template',
            id: templateId || '2'
        })
        var fileurl = rec_Obj.getValue('custrecord_st_file_link')
        var div_position = rec_Obj.getValue('custrecord_st_sign_cordinate')
        fileurl += 'https://tstdrv1338970.app.netsuite.com/';
        // renderPdfFile(fileurl, div_position,get_last_viewed);
        renderPdfFile(fileurl, div_position);
    


    }


    function renderPdfFile(data, div_position) {
        pdfjsLib.getDocument(data).promise.then(pdf => {
            // Get the number of pages in the PDF
            const numPages = pdf.numPages;

            // Set up a container to hold the PDF pages and the image
            const pdfContainer = document.getElementById('pdfViewer');

            let pdfChildrens = pdfContainer.hasChildNodes()
            if (pdfChildrens) {
                pdfContainer.childNodes.forEach(child => pdfContainer.removeChild(child))
            }
            // Loop through each page and create a canvas element to display it
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {

                    var divpage = document.createElement('div');
                    divpage.className = 'divpage';
                    // divpage.style.textAlign = 'center'
                    // Set the scale of the PDF. You can adjust this value as needed.
                    const scale = 2;
                    // Set the viewport based on the desired scale
                    const viewport = page.getViewport({ scale });
                    // Create a canvas element to display the page and the image
                    const canvas = document.createElement('canvas');
                    canvas.style.background = "#ffffff";
                    canvas.style.border = 'none';
                    const context = canvas.getContext('2d');
                    // console.log("viewpoerthh", viewport.height)
                    // console.log(" viewport.width",t)
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    divpage.appendChild(canvas);
                    pdfContainer.appendChild(divpage);
                    // Render the page content on the canvas
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    page.render(renderContext);
                });
            }
            $('#image_loader').hide();
            $('#viewshow').show();

            const div_main = document.getElementById('pdfViewer');
            div_main.innerHTML += div_position;

            const drag_img = document.querySelectorAll('#drag-div');

            for (var k = 0; k < drag_img.length; k++) {
                drag_img[k].addEventListener("click", function (event) {
                    let suitelet_Url = "https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2258&deploy=1&compid=TSTDRV1338970&h=4c4adb9172d7477b2cf5"
                    window.open(suitelet_Url, 'myWindow', 'width=750,height=500,resizable=no')
                });
            }

        });
    }

    function createTemplate(emailid, timestamp) {

        // const drag_img = document.querySelector('#drag-div');
        // const haschild = drag_img.hasChildNodes();
        console.log("length",$("#drag-div").find('img').length)
        if(!$("#drag-div").find('img').length)
        {
            alert("Please Sign The Document Before Saving It");
            return;
        }
        var html = `<div style="margin-top:50px;" class="container">
        <div class="spinner-grow text-primary" role="status">
        
      </div>
      <div class="spinner-grow text-secondary" role="status">
        
      </div>
      <div class="spinner-grow text-success" role="status">
        
      </div>
      <div class="spinner-grow text-danger" role="status">
        
      </div>
      <div class="spinner-grow text-warning" role="status">
        
      </div>
      <div class="spinner-grow text-info" role="status">
        
      </div>
      <div class="spinner-grow text-success" role="status">
        
      </div>
      <div class="spinner-grow text-dark" role="status">
        
      </div></div>`
        var optionloader = {
            width: 500,
            height: 160,
            content: html,
            title: 'Please Wait To Download File',
            ignoreDelay: true,
            closeButton: false,
            blockScroll: false,
            closeOnClick: false,
            // cancelButton:"",
            onClose: function () {
                console.log('hereaja')
            }
        };

        var Mloader = new jBox('Modal', optionloader);
        Mloader.open();


        var quotes = document.getElementById('main1');


        var canvaslength = document.getElementsByTagName('canvas').length;
        var canvaswidth = document.getElementsByTagName('canvas')[0].width;
        var divwidth = document.getElementById('pdfViewer').offsetWidth;

        console.log("divwidth", divwidth);
        var widthcut = ((divwidth - canvaswidth) / 2) * 0.5;
        console.log("widthcut", widthcut);
        var pdf = new jsPDF('p', 'pt', 'letter');
        var count = 0;
        html2canvas(quotes, { scale: 1 }).then((canvas) => {
            //! MAKE YOUR PDF

            var pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfheight1 = pdf.internal.pageSize.getHeight();
            console.log("pdfwidth", pdfWidth)
            var quotesHeight = quotes.clientHeight;
            var quotesWidth = quotes.clientWidth;

            console.log("quotesHeight", quotesHeight);
            console.log("quotesWidth", quotesWidth);
            console.log("screenH", screen.height);
            console.log("screenW", screen.width);

            var pageHeight = quotesHeight / canvaslength; // Height of each page in points

            var totalPages = Math.ceil(quotesHeight / pageHeight);

            for (var i = 0; i < totalPages; i++) {
                count++;
                var srcImg = canvas;
                var sX = 0;
                var sY = i * pageHeight;
                // console.log("sY", sY)
                var remainingHeight = quotesHeight - sY;
                var heightToCapture = Math.min(pageHeight, remainingHeight);

                // console.log("heightToCapture",heightToCapture)
                var onePageCanvas = document.createElement("canvas");
                onePageCanvas.setAttribute('width', quotesWidth);
                onePageCanvas.setAttribute('height', heightToCapture);

                var ctx = onePageCanvas.getContext('2d');
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, quotesWidth, pageHeight);

                ctx.drawImage(srcImg, Math.floor(sX), Math.floor(-sY), Math.floor(quotesWidth), Math.floor(quotesHeight));
                const pdfHeight = (heightToCapture * pdfWidth) / quotesWidth;

                var canvasDataURL = onePageCanvas.toDataURL("image/jpeg", 0.7);

                if (i > 0) {
                    pdf.addPage(); //8.5" x 11" in pts (in*72)
                }

                pdf.setPage(i + 1);
                //! now we add content to that page!

                pdf.addImage(canvasDataURL, 'JPEG', 5, 5, pdfWidth + widthcut * 1.8, pdfheight1, 'undefined' + i, 'FAST');
            }
            console.log("pdf", pdf)
            $('div[id^="jBox"]').remove();

            var pdfBlob = pdf.output('blob');
            console.log("pdfblob", pdfBlob);




            var fileReader = new FileReader();
            // Read the file as binary and send it to SuiteScript
            fileReader.onload = function (event) {
                var fileData = event.target.result;
                console.log("fileData", fileData)
                requestData = {
                    content: fileData.split(',')[1],
                    email: emailid,
                    timestamp: timestamp,
                    action: 'savefile'
                } // Extract the base64-encoded data from the data URL

                console.log("requestData", requestData)

                var response = https.post({
                    url: 'https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2259&deploy=1&compid=TSTDRV1338970&h=f966d848809f2747bfb3', // Replace with your SuiteScript script URL
                    body: JSON.stringify(requestData),
                    headers: {
                        'Content-Type': 'application/pdf'
                    }
                });
                if (response) {
                    console.log('response', response)
                    var datapdf = pdf.save(`${emailid}_${timestamp}.pdf`);
                    console.log("datapdf", datapdf)
                    var successimg = "https://tstdrv1338970.app.netsuite.com/core/media/media.nl?id=69575&c=TSTDRV1338970&h=0EI5e8CMyPvbxf0UeJPyOY9O6uQCUIcPJlNLZLf3nE7QTZpR"

                    var html = '<h5>PDF generated Successfully</h5><br/>';
                    html += `<center><img style="height:70px; width:95px;" id="img-success" src="${successimg}"/></center>`
                    html += '<div class="btnModalY" style="padding-top:10px; align:center;"><span><input class="btnAP" id="btnCancel" type="button" onClick="init()" value="Ok" /></span>';
                    html += '</div>';
                    var option = {
                        width: 500,
                        height: 220,
                        content: html,
                        title: 'Alert',
                        ignoreDelay: true,
                        closeButton: false,
                        blockScroll: false,
                        closeOnClick: false,
                        // cancelButton:"",
                        onClose: function () {
                            console.log('hereaja')
                        }
                    };


                    var M = new jBox('Modal', option);
                    var colorBg = "#607799"
                    $('#img-spinner').hide();
                    M.open();
                    $('.jBox-Modal .jBox-title').css('background-color', colorBg);
                }

            }
            // Read the file as binary data
            fileReader.readAsDataURL(pdfBlob);
        })






    }



    return {
        pageInit: pageInit,
        renderPdfFile: renderPdfFile,
        createTemplate: createTemplate
    }

})