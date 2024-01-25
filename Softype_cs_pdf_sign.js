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
   ** @Author      :  Akash Chavan,Rohit Jha
   ** @Dated       : 03-05-2023
   ** @Version     : 2.1
   ** @Description : for sending email
   ***************************************************************************************/
   define(['N/search', 'N/xml', 'N/https', 'N/email','N/record','N/format'], function (search, xml, https, email,record,format) {
    let boVal = ''
    var successimg = "https://tstdrv1338970.app.netsuite.com/core/media/media.nl?id=69575&c=TSTDRV1338970&h=0EI5e8CMyPvbxf0UeJPyOY9O6uQCUIcPJlNLZLf3nE7QTZpR"
    function pageInit(context) {
        // alert('here')
        let options = {
            title: 'I am a Dialog with the default button',
            message: 'Click a button to continue.',
        };

        function success(result) {
            console.log('Success with value ' + result);
        }

        function failure(reason) {
            console.log('Failure: ' + reason);
        }

        // dialog.create(options).then(success).catch(failure);
        var fileSearchObj = search.create({
            type: "file",
            filters:
                [
                    ["filetype", "anyof", "PDF"],
                    'AND',
                    ['folder', 'is', '11155']
                ],
            columns:
                [
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Name"
                    }),
                    search.createColumn({ name: "folder", label: "Folder" }),
                    search.createColumn({ name: "documentsize", label: "Size (KB)" }),
                    search.createColumn({ name: "url", label: "URL" }),
                    search.createColumn({ name: "created", label: "Date Created" }),
                    search.createColumn({ name: "modified", label: "Last Modified" }),
                    search.createColumn({ name: "filetype", label: "Type" })
                ]
        });
        var searchResultCount = fileSearchObj.runPaged().count;
        log.debug("fileSearchObj result count", searchResultCount);
        let i = 0;
        let selectOptions = '<option value="">Select a option </option>'
        while (i < searchResultCount) {
            let resultArr = fileSearchObj.run().getRange(i, i + 999);
            for (let j = 0; j < resultArr.length; j++) {
                selectOptions += `<option value='${resultArr[j].getValue('url')}'>${resultArr[j].getValue("name")}</option>`
            }
            i += 999;

        }


        var html = '';
        html += '<div><h4>Upload or select a pdf.</h4></div>';
        // html+='<br/><br/>Click OK to update it or Cancel to select different parameters.<br/>';
        // html+='<br/><img id="spinner" src="'+$("#custpage_img_ajaxloader").val()+'" alt="Loading"/>';
        html += '<div style="margin-top:15px;"><input style="width:100%;" id="uploadfile" accept=".pdf" type="file" value="Upload"/></div>';
        html += '<div style="margin-top:15px;"><h4 style="text-align:center;">OR</h4></div>';//
        html += `<div style="margin-top:15px;"><select style="width:100%;" id="fileid">${selectOptions}</select></div>`

        html += '<div style="margin-top:15px;" class="btnModalY" style="gap:20px"><span><input class="btnAP" id="btnCancel" type="button" onClick="init()" value="Cancel" /></span>';
        html += '<span style="margin-left:30px"><input class="btnAP" id="okCancel" type="button" onClick="saveChoice()" value="Ok" /></span></div>';
        var option = {
            width: 500,
            height: 250,
            content: html,
            title: 'Choose a file',
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
        // recObj.setValue('custpage_bodycontent','<p>hello world<p>')
    }



    function createTemplate(context) {
        $('#main1').hide();
        $('#image_loader').show();
        var div_drag = document.querySelectorAll('#drag-div');
        var div_data = ""
        for (var i = 0; i < div_drag.length; i++) {
            div_data += div_drag[i].outerHTML;
        }
        var file = document.getElementById('uploadfile')?.files[0];

        var requestData;
        if (file) {

            var fileReader = new FileReader();
            // Read the file as binary and send it to SuiteScript
            fileReader.onload = function (event) {
                var fileData = event.target.result;
                console.log("fileData", fileData)
                requestData = {
                    file: {
                        name: file.name,
                        type: file.type,
                        contents: fileData.split(',')[1], // Extract the base64-encoded data from the data URL
                        isOnline: true // Set to true to store the file in the file cabinet
                    },
                    div_data: div_data
                };

                console.log("requestData", requestData)

                var response = https.post({
                    url: 'https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2254&deploy=1&compid=TSTDRV1338970&h=f05d0658b66b376313fc', // Replace with your SuiteScript script URL
                    body: JSON.stringify(requestData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response) {
                    console.log('response', response)

                    var htmlemail = `<div class="form-group">
                                     <label for="exampleInputEmail1">Email address</label>
                                     <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email">
                                     <small id="emailHelp" class="form-text text-muted">Please input 10 emails only with comma seperated</small>
                                     </div>`
                    htmlemail += '<div style="margin-top:15px;" class="btnModalY" style="gap:20px"><span><input class="btnAP" id="btnCancel" type="button" onClick="init()" value="Cancel" /></span>';
                    htmlemail += '<span style="margin-left:30px"><input class="btnAP" id="okSend" type="button" value="SEND" /></span></div>';

                    // var html = '';
                    // html += '<h4>Click below to sign</h4><br/>';
                    // html += `<a style="color:blue; font-size: 16px;" href='https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2259&deploy=1&compid=TSTDRV1338970&h=f966d848809f2747bfb3&templateId=${JSON.parse(response.body).templateId}'>Click Here!</a><br/>`
                    // html += '<div class="btnModalY" style="padding-top:10px; align:center;"><span><input class="btnAP" id="btnCancel" type="button" onClick="init()" value="Cancel" /></span>';
                    // html += '</div>';
                    var option = {
                        width: 500,
                        height: 185,
                        content: htmlemail,
                        title: 'Send Email',
                        ignoreDelay: true,
                        closeButton: false,
                        blockScroll: false,
                        closeOnClick: false,
                        // cancelButton:"",
                        onClose: function () {
                            console.log('hereaja')
                        }
                    };

                    var url_email = `https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2259&deploy=1&compid=TSTDRV1338970&h=f966d848809f2747bfb3&templateId=${JSON.parse(response.body).templateId}`

                    var M = new jBox('Modal', option);
                    var colorBg = "#607799"
                    $('#image_loader').hide();
                    M.open();
                    document.getElementById("okSend").addEventListener("click", function () {
                        SendEmail(url_email)
                    });
                    $('.jBox-Modal .jBox-title').css('background-color', colorBg);

                }

            };
            // Read the file as binary data
            fileReader.readAsDataURL(file);
        }
        else {
            let selectedFile = document.getElementById('fileid');
            var fileurl = selectedFile.value;
            requestData = {
                url: fileurl,
                div_data: div_data
            }

            var response = https.post({
                url: 'https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2254&deploy=1&compid=TSTDRV1338970&h=f05d0658b66b376313fc', // Replace with your SuiteScript script URL
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response) {
                console.log('reesponse', response)

                var htmlemail = `<div class="form-group">
                                     <label for="exampleInputEmail1">Email address</label>
                                     <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email">
                                     <small id="emailHelp" class="form-text text-muted">Please input 10 emails only with comma seperated</small>
                                     </div>`
                htmlemail += '<div style="margin-top:15px;" class="btnModalY" style="gap:20px"><span><input class="btnAP" id="btnCancel" type="button" onClick="init()" value="Cancel" /></span>';
                htmlemail += '<span style="margin-left:30px"><input class="btnAP" id="okSend" type="button" value="SEND" /></span></div>';

                // var html = '';
                // html += '<h4>Click below to sign</h4><br/>';
                // html += `<a style="color:blue; font-size: 16px;" href='https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2259&deploy=1&compid=TSTDRV1338970&h=f966d848809f2747bfb3&templateId=${JSON.parse(response.body).templateId}'>Click Here!</a><br/>`
                // html += '<div class="btnModalY" style="padding-top:10px; align:center;"><span><input class="btnAP" id="btnCancel" type="button" onClick="init()" value="Cancel" /></span>';
                // html += '</div>';
                var option = {
                    width: 500,
                    height: 185,
                    content: htmlemail,
                    title: 'Send Email',
                    ignoreDelay: true,
                    closeButton: false,
                    blockScroll: false,
                    closeOnClick: false,
                    // cancelButton:"",
                    onClose: function () {
                        console.log('hereaja')
                    }
                };

                var url_email = `https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2259&deploy=1&compid=TSTDRV1338970&h=f966d848809f2747bfb3&templateId=${JSON.parse(response.body).templateId}`

                var M = new jBox('Modal', option);
                var colorBg = "#607799"
                $('#image_loader').hide();
                M.open();
                document.getElementById("okSend").addEventListener("click", function () {
                    SendEmail(url_email)
                });
                $('.jBox-Modal .jBox-title').css('background-color', colorBg);

            }

        }



    }


    function SendEmail(url_email) {

        var inputString = $("#InputEmail").val();
        //alert(inputString);
        var emailArray = inputString.split(',');
        var send_email = true;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailArray.length > 0) {
            for (var j = 0; j < emailArray.length; j++) {
                if (!(emailArray[j].match(mailformat))) {
                    send_email = false;
                    alert("Please Enter Valid Email Address" + "-" + emailArray[j])
                }
            }
        }

        if (send_email) {
            

            for (var k = 0; k < emailArray.length; k++) {

                var sendurl = url_email;
                var timestamp = new Date().getTime();
                sendurl = sendurl+`&email=${emailArray[k]}&nonce=${timestamp}`
                email.send({
                    author: 19565,
                    recipients: emailArray[k],
                    subject: 'Signature PDF',
                    body: `<html><body><h4>Hi</h4><br/><h4>Please click on the link below and gothrough the PDF document that needs your signature.</h4><br/><a href="${sendurl}">Click here</a><br/><br/><br/><h4>Thank You.</h4><h4>Regards</h4><h4>Softype Team</h4></body></html>`,
                });
                var objRecord = record.create({
                    type: 'customrecord_customer_sign_data',
                    isDynamic: true,
                });

                objRecord.setValue({
                    fieldId: 'custrecord_cust_email_address',
                    value: emailArray[k]
                });

                objRecord.setValue({
                    fieldId: 'custrecord_cust_time_stamp',
                    value: timestamp
                });

                var rec_id = objRecord.save();
            }

            var html = '<h5>Sent Email Successfully</h5><br/>';
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
            $('#image_loader').hide();
            M.open();
            $('.jBox-Modal .jBox-title').css('background-color', colorBg);

        }
    }

    function formattedDateandTime() {

        var date = new Date();

        var formattedDate = format.format({
            value: date,
            type: format.Type.DATETIME,
            timezone: format.Timezone.timeZone
        });

        var parsedDate = format.parse({
            value: formattedDate,
            type: format.Type.DATE,
        });

        return parsedDate;

    }



    function sendDataDiv() {

        // var div_main = document.querySelector('#drag-div');
        // // var div_main = document.querySelector('.main').innerHTML;
        // var htmlvar = '';
        // htmlvar += '<!DOCTYPE html>'
        // htmlvar += '<html>'
        // // htmlvar += '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
        // // htmlvar += '<pdf>'
        // htmlvar += '<head>';
        // htmlvar += '</head>'
        // htmlvar += '<body padding="0.1in 0.1in 0.1in 0.1in" size="A4">'

        // // // console.log('djfj',div_main.outerHTML)
        // // // console.log('style',JSON.stringify(div_main.style))
        // var canvases = document.getElementsByTagName('canvas');




        // // // htmlvar += `<div style='${JSON.stringify(div_main.style)}'></div>`
        // // // var images = "";
        // // // var canvases = document.getElementsByTagName("canvas");

        // // // var totalheight=0;
        // // // for (var i = 0; i < canvases.length; i++) {
        // // //     totalheight += Number(canvases[i].height);
        // // //}
        // htmlvar += '<div style="position:relative">'

        // //var img_position = Math.ceil((div_main.style.top%totalheight)*canvases.length-1);
        // for (var i = 0; i < canvases.length; i++) {
        //     //do something to each div like
        //     // var can_element = document.createElement('canvas');
        //     //     var ctx = can_element.getContext('2d');
        //     //     var img = new Image();
        //     //     var canvasData = await new Promise((resolve,reject)=>{
        //     //        let can_data = canvases[i].toDataURL('image/png')
        //     //         resolve(can_data)
        //     //         })
        //     //         .then(data =>{
        //     //         img.src=data;
        //     //  });
        //     //     ctx.drawImage(img.src,0,0,canvases[i].width,canvases[i].height);
        //     //     if(i == img_position)
        //     //     {
        //     //         ctx.fillRect(div_main.style.top,div_main.style.left,div_main.style.width,div_main.style.height)
        //     //     }
        //     //     var canvasDataimg = await new Promise((resolve,reject)=>{
        //     //     let can_data = can_element.toDataURL('image/png')
        //     //         resolve(can_data)
        //     // }).then(data=>{
        //     //         img.src=data;
        //     //     });


        //Working

        var quotes = document.getElementById('main1');
        html2canvas(quotes).then((canvas) => {
            //! MAKE YOUR PDF
            var pdf = new jsPDF('p', 'pt', 'letter');

            for (var i = 0; i <= quotes.clientHeight / 1584; i++) {
                //! This is all just html2canvas stuff
                var srcImg = canvas;
                var sX = 120;
                if (i == 0) {
                    var sY = 50;
                }
                else {
                    var sY = 1980 * i; // start 980 pixels down for every new page
                }

                var sWidth = 1380;
                var sHeight = 1980;
                var dX = 0;
                var dY = 0;
                var dWidth = 1380;
                var dHeight = 1980;

                window.onePageCanvas = document.createElement("canvas");
                onePageCanvas.setAttribute('width', 1380);
                onePageCanvas.setAttribute('height', 1980);
                var ctx = onePageCanvas.getContext('2d');
                // details on this usage of this function: 
                // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

                // document.body.appendChild(canvas);
                var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                var width = onePageCanvas.width;
                var height = onePageCanvas.clientHeight;

                console.log("height", height);
                console.log("width", width);
                //! If we're on anything other than the first page,
                // add another page
                if (i > 0) {
                    pdf.addPage(); //8.5" x 11" in pts (in*72)
                }
                //! now we declare that we're working on that page
                pdf.setPage(i + 1);
                //! now we add content to that page!
                pdf.addImage(canvasDataURL, 'JPEG', 40, 30, 560, 720, 'undefined' + i, 'FAST');

            }
            //! after the for loop is finished running, we save the pdf.
            pdf.save('Test45.pdf');

        }
        )







        // var quotes = document.getElementById('main1')
        // html2canvas(quotes).then((canvas) => {
        //      //! MAKE YOUR PDF
        //      var pdf = new jsPDF('p', 'px', 'letter');

        //      for (var i = 0; i <= quotes.clientHeight/980; i++) {
        //          //! This is all just html2canvas stuff
        //          var srcImg  = canvas;
        //          var sX      = 0;
        //          var sY      = 980*i; // start 980 pixels down for every new page
        //          var sWidth  = 900;
        //          var sHeight = 980;
        //          var dX      = 0;
        //          var dY      = 0;
        //          var dWidth  = 750;
        //          var dHeight = 500;

        //          window.onePageCanvas = document.createElement("canvas");
        //          onePageCanvas.setAttribute('width', 750);
        //          onePageCanvas.setAttribute('height', 500);
        //          var ctx = onePageCanvas.getContext('2d');
        //          // details on this usage of this function: 
        //          // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
        //          ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

        //          // document.body.appendChild(canvas);
        //          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

        //          var width         = onePageCanvas.width;
        //          var height        = onePageCanvas.clientHeight;

        //          //! If we're on anything other than the first page,
        //          // add another page
        //          if (i > 0) {
        //              pdf.addPage(); //8.5" x 11" in pts (in*72)
        //          }
        //          //! now we declare that we're working on that page
        //          pdf.setPage(i+1);
        //          //! now we add content to that page!
        //          pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62),'undefined'+i,'FAST');

        //      }
        //      //! after the for loop is finished running, we save the pdf.
        //      pdf.save('Test.pdf');
        //    });






        //     var canvasdata = canvases[i].toDataURL('image/png')
        //     //     // doc.addImage(canvasdata, 'PNG',10, 10, 150, 300 , 'canvas'+i,'FAST');
        //     htmlvar += '<img height="1150px" width="750px" src="' + xml.escape(canvasdata) + '"/>'
        // }
        // // // // doc.save('SigendPdf.pdf');
        // var divHeight = $('#main1').height();
        // var divWidth = $('#main1').width();
        // console.log("divHeight", divHeight)
        // console.log("divWidth", divWidth)
        // console.log("top", div_main.style.top)
        // console.log("div_main.style.left", div_main.style.left)

        // htmlvar += `<div style='height:${div_main.style.height}; width:${div_main.style.width}; top:${div_main.style.top}; left:${div_main.style.left}; background-color:${div_main.style.backgroundColor}; position:${div_main.style.position}'></div>`
        // htmlvar += '</div></body>'
        // htmlvar += '</html>'

        // html2pdf(htmlvar);
        // htmlvar += '</pdf>';

        // var bodydata = {
        //     'div_main': htmlvar
        // }

        // console.log(bodydata);

        // var response = https.post({
        //     url: 'https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2254&deploy=1&compid=TSTDRV1338970&h=f05d0658b66b376313fc',
        //     body: bodydata
        // });

    }

    function closeWindow() {
        window.close()
    }
    function createSignHolder() {
        // alert('here')
        let scrollY = 0
        // let mousemoved = 0
        // function updateScrollY(){
        //     const windowHeight = window.innerHeight;
        //     const totalContentHeight = document.querySelector('#div__body').scrollHeight;
        //     const availableScrollHeight = totalContentHeight - windowHeight;
        //     console.log('clientY0',mousemoved)
        //     scrollY = (mousemoved / windowHeight) * availableScrollHeight;
        //     console.log(JSON.stringify({
        //     windowHeight,totalContentHeight,availableScrollHeight,scrollY
        //     }))
        // }
        // function updateMousePos(e){
        //     mousemoved = e.clientY
        // }
        // document.querySelector('#body').addEventListener('scrollend',updateScrollY)

        let div = document.createElement('div');
        div.id = 'drag-div'
        div.className = 'pdfblock'
        div.style.position='fixed'
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.backgroundColor = "#FCFCA5"
        div.style.position = 'absolute'
        let main = document.querySelector('.main')
        main.prepend(div)
        // div.addEventListener()
        const draggableResizable = document.getElementById("drag-div");
        let isDragging = false;
        let isResizing = false;
        let resizeStartX, resizeStartY;
        let originalWidth, originalHeight;
        function dragImg(event) {
            // console.log('event',event.target)
            if (event.target.id === "drag-div") {
                isDragging = true;
                // updateMousePos(event)
                // console.log('event.clientX ',event.clientX )
                // Calculate the offset between the mouse and the div's top-left corner
                const rect = event.target.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;

                // Update the position of the div based on the mouse movement
                document.addEventListener("mousemove", drag);
                function drag(event) {
                    if (isDragging) {
                        window.scroll(event.clientX, event.clientHeight)
                        // console.log('offsetX',offsetX);
                        // console.log('offsetY',offsetY);
                        draggableResizable.style.left = window.screenX + (event.clientX - offsetX) + "px";
                        // const windowHeight = window.innerHeight;
                        const totalContentHeight = document.querySelector('#div__body').scrollHeight;

                        // if(scrollY >= (windowHeight * 1.2)){
                        //     draggableResizable.style.top = (scrollY - event.clientY) + (event.clientY - offsetY) + "px";
                        // }else{
                        scrollY = document.querySelector('#body').scrollTop
                        if (scrollY < totalContentHeight) {
                            draggableResizable.style.top = scrollY + (event.clientY - offsetY) + "px";
                        }

                        // }
                    }
                    if (event.clientY > 600) {
                        // console.log('event.clientX ',event.clientY )

                        // window.scrollTo(event.clientX,event.clientY)
                    }
                }

                document.addEventListener("mouseup", function () {
                    isDragging = false;
                    document.removeEventListener("mousemove", drag);
                });
            }

        }
        // window.addEventListener("mousedown",(event)=>{
        //     console.log('eveent',window.scrollY)
        // })

        draggableResizable.addEventListener("mousedown", dragImg);


        // Function to enable resizing
        function initResize(event) {
            isResizing = true;
            resizeStartX = event.clientX;
            resizeStartY = event.clientY;
            originalWidth = parseInt(document.defaultView.getComputedStyle(draggableResizable).width, 10);
            originalHeight = parseInt(document.defaultView.getComputedStyle(draggableResizable).height, 10);

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        }

        // Function to update div size while resizing
        function resize(event) {
            if (isResizing) {
                const width = originalWidth + (event.clientX - resizeStartX);
                const height = originalHeight + (event.clientY - resizeStartY);
                draggableResizable.style.width = width + "px";
                draggableResizable.style.height = height + "px";
                let signCanvas = document.getElementById("signcanvas");
                const ctx = signCanvas.getContext("2d");

                const editorSymbol = document.getElementById("editor")
                editorSymbol.style.left = (width - 15) + "px"

            }
        }

        // Function to stop resizing
        function stopResize() {
            isResizing = false;
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        }

        // Add a resize handle to the div (bottom-right corner)
        const resizeHandle = document.createElement("div");
        resizeHandle.style.width = "10px";
        resizeHandle.style.height = "10px";
        resizeHandle.style.background = "gray";
        resizeHandle.style.position = "absolute";
        resizeHandle.style.bottom = 0;
        resizeHandle.style.right = 0;
        resizeHandle.style.cursor = "se-resize";
        draggableResizable.appendChild(resizeHandle);
        resizeHandle.addEventListener("mousedown", initResize);

        const removeDiv = document.createElement("div");
        removeDiv.textContent = "X"
        removeDiv.style.width = "10px";
        removeDiv.style.height = "10px";
        removeDiv.style.color = "red";
        removeDiv.style.position = "absolute";
        removeDiv.style.top = 0;
        removeDiv.style.left = 0;
        removeDiv.style.cursor = "pointer";
        draggableResizable.prepend(removeDiv);
        removeDiv.addEventListener("click", () => {
            draggableResizable.style.display = 'none'

        });

        const add_sign = document.createElement("div");
        add_sign.textContent = "Add Signature"
        add_sign.style.width = "70px";
        add_sign.style.height = "10px";
        add_sign.style.color = "black";
        add_sign.style.fontSize = "8px;"
        add_sign.style.position = "flex";
        add_sign.style.top = 0;
        add_sign.style.float = 'right'
        draggableResizable.prepend(add_sign);



    }
    return {
        pageInit: pageInit,
        closeWindow: closeWindow,
        createSignHolder: createSignHolder,
        sendDataDiv: sendDataDiv,
        createTemplate: createTemplate
    }

})