/**
    * @NApiVersion 2.1
    * @NScriptType Suitelet
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
** @Dated       : 03-08-2023
** @Version     : 2.1
** @Description : for creating template and signing pdf 
***************************************************************************************/

define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/render', 'N/url', 'N/redirect', 'N/http', 'N/task', 'N/config', 'N/file', 'N/xml', 'N/format'],

    function (ui, search, record, render, url, redirect, http, task, config, file, xml, format) {

        /**
               * Definition of the Suitelet script trigger point.
               *
               * @param {Object} context
               * @param {ServerRequest} context.request - Encapsulation of the incoming request
               * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
               * @Since 2015.2
               */
        function onRequest(context) {

            var imageloader = "https://tstdrv1338970.app.netsuite.com/core/media/media.nl?id=69573&c=TSTDRV1338970&h=V0FB7atC4TdIVu9C_VVuYx3X8uzWJFZP0cLtWJMPNoln0A0z"
            if (context.request.method === 'GET') {

                var emailid = context.request.parameters.email;
                var timestamp = context.request.parameters.nonce;

                var cust_results = getCustomer_data(emailid, timestamp)
                var get_last_viewed = cust_results[0].getValue('custrecord_last_viewed_pdf')
                var internalid = cust_results[0].id


                var htmllastviewed = ``
                if (get_last_viewed != "") {
                    htmllastviewed = `<ul class="list-group w-50"">`
                    var datasplit = get_last_viewed.split(',');
                    if(cust_results[0].getValue('custrecord_st_signed_date') !="")
                    {
                        htmllastviewed += `<li class="list-group-item list-group-item-warning text-dark" ><i class='fa fa-pencil' style='font-size:36px'></i><span class="pull-right" style="font-size:20px;">Signed on ${cust_results[0].getValue('custrecord_st_signed_date')}</span></li>`
                    }
                    for (var i = datasplit.length - 1; i >= 0; i--) {
                        htmllastviewed += `<li class="list-group-item list-group-item-info text-dark" ><i class='fa fa-eye' style='font-size:36px'></i><span class="pull-right" style="font-size:20px;">Last Viewed on ${datasplit[i]}</span></li>`
                    }
                    htmllastviewed += `</ul>`
                }



                var id = record.submitFields({
                    type: 'customrecord_customer_sign_data',
                    id: internalid,
                    values: {
                        custrecord_last_viewed_pdf: formattedDateandTime()
                    }
                });




                let htmlContent = `
<!DOCTYPE html>
<html>

<head>
    <title>Draggable Containers</title>
    <style>
        .draggable-container {
            width: 200px;
            height: 200px;
            /* display: ; */
            /* background-color: lightblue; */
            border: 1px solid #ccc;
            position: absolute;
        }
        .btnModalY
                    {
	                    position: absolute; 
 	                    bottom: 10px;
 	                    float:left; 
 	                    /*float: center; margin:0px auto*/
                    }
                    .btnAP{
 
                        min-width:55px;
                        height:30px;                                                                                                  
                        border:1px solid #125ab2;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        font-size:14px;
                        font-family:Open Sans,Helvetica,sans-serif;
                        font-weight: 600 ; 
                        padding: 0 12px; 
                        margin-right:15px;
                        text-decoration:none;
                        display:inline-block;
                        color: #ffffff;
                        background-color: #4c9dff;
                        background-image: -webkit-gradient(linear, left top, left bottom, from(#4c9dff), to(#4c9dff));
                        background-image: -webkit-linear-gradient(top, #4c9dff, #4c9dff);
                        background-image: -moz-linear-gradient(top, #4c9dff, #4c9dff);
                        background-image: -ms-linear-gradient(top, #4c9dff, #4c9dff);
                        background-image: -o-linear-gradient(top, #4c9dff, #4c9dff);
                        background-image: linear-gradient(to bottom, #4c9dff, #4c9dff);
                        filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#4c9dff, endColorstr=#4c9dff);
                      }
                      .btnAP:hover
                      {
                        background: #1467cc;
                      }
                      .btnAP:focus
                      {
                        box-shadow:0 0 2px 2px rgba(24,123,242,.75);
                      }
                      .btnAP:active
                      {
                        background: #004599;
                      }

                      .jBox-title {
                        
                        font-size: 17px;
                        font-family: Open Sans, Helvetica, sans-serif;
                     }
                      
                      .btnAP:disabled
                      {
                        background: #e5e5e5;
                        border:1px solid #cccccc;
                        color: #777777;
                      }
                      .center {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        margin-top: 200px;
                      }
                     
                      
                #pdfViewer{
                    padding-left:20px;
                }
              
    </style>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfkit@0.10.0/js/pdfkit.standalone.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/StephanWagner/jBox@v1.3.3/dist/jBox.all.min.js"></script>
    <link href="https://cdn.jsdelivr.net/gh/StephanWagner/jBox@v1.3.3/dist/jBox.all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
</head>

<body>
<div style="margin-left:50px;position:sticky; top:20px;" id="addsavebutton">
</div>

                        <div id="image_loader">
                        <div style="margin-top:100px;" class="container h-100 d-flex align-items-center justify-content-center" id="img-spinner">
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

                            </div>
                        </div>
                     </div>
    <div id="main1" class="main">
        <div id="pdfViewer"></div>
    </div>
    <br/><br/>
    <div id="viewshow" style="display:none">
    <div id="lastviewed" class="d-flex justify-content-center">
    ${htmllastviewed}
   </div>
   </div>
    
    

    
    <script>

        window.jsPDF = window.jspdf.jsPDF;
        const savebtn = document.querySelector("#save");
        let element = []

        // window.addEventListener('DOMContentLoaded', () => {
        //     renderPdfFile()
        // })

        window.addEventListener("message", function (event) {
            // Ensure the message is from the expected origin
            if (event.origin === "https://tstdrv1338970.extforms.netsuite.com") {
                // Do something with the received data from the child window
                console.log("Received value from popup window:", event.data);
                // img.src = event.data

                var img_data = event.data
                const drag_img = document.querySelectorAll('#drag-div');

            for(var k=0;k<drag_img.length;k++)
            {
                drag_img[k].style.backgroundColor = 'transparent';
                drag_img[k].innerHTML = '<img height="'+drag_img[k].style.height+'px" width="'+drag_img[k].style.width+'px" top="'+drag_img[k].style.top+'px" left="'+drag_img[k].style.left+'px" src="'+img_data+'"/>'
            }
        }
                
        });


        function init(){
            $('div[id^="jBox"]').remove();
            $('#main1').show();
           // window.close()
       }

       function closeWindow()
       {
        $('div[id^="jBox"]').remove();
        window.close();
       }

        

        // const editSign = document.createElement("div");
        // editSign.id = "editor"
        // editSign.textContent = "✎"
        // editSign.style.width = "10px";
        // editSign.style.height = "10px";
        // editSign.style.color = "black";
        // editSign.style.position = "absolute";
        // editSign.style.top = 0;
        // const rect = draggableResizable.getBoundingClientRect();
        // console.log('rect', rect)
        // editSign.style.left = (rect.width - 15) + "px";
        // editSign.style.cursor = "pointer";
        // draggableResizable.prepend(editSign);
        // editSign.addEventListener("click", () => {
        //     let suitelet_Url = "https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2258&deploy=1&compid=TSTDRV1338970&h=4c4adb9172d7477b2cf5"
        //     window.open(suitelet_Url, 'myWindow', 'width=750,height=500,resizable=no')
        // });



    </script>

</body>

</html>
`

                var form = ui.createForm({ // create new form
                    title: 'Pdf signature'
                });

                form.clientScriptFileId = 69570;

                var body_content = form.addField({
                    id: 'custpage_bodycontent',
                    type: ui.FieldType.INLINEHTML,
                    label: "Body"
                });
                body_content.defaultValue = htmlContent;

                context.response.writePage(form);
            }

            else {
                var fileObjcontent = JSON.parse(context.request.body)?.content;
                var emailid = JSON.parse(context.request.body)?.email;
                var timestamp = JSON.parse(context.request.body)?.timestamp;
                var action = JSON.parse(context.request.body)?.action;
                var rec_result = getCustomer_data(emailid, timestamp);
                if (action == "savefile") {
                    log.debug("fileObjcontent", fileObjcontent)
                    log.debug("emailid", emailid)
                    const fileObj = file.create({
                        name: `${emailid}_${timestamp}.pdf`,
                        fileType: file.Type.PDF,
                        contents: fileObjcontent
                    });
                    fileObj.folder = 11156;
                    var fileId = fileObj.save();


                    var rec_id = rec_result[0].id;
                    var id = record.attach({
                        record: {
                            type: 'file',
                            id: fileId
                        },
                        to: {
                            type: 'customrecord_customer_sign_data',
                            id: rec_id
                        }
                    });

                    var id = record.submitFields({
                        type: 'customrecord_customer_sign_data',
                        id: rec_id,
                        values: {
                            custrecord_st_signed_date: formattedDateandTime()
                        }
                    });

                    log.debug("fileId", fileId)
                }
                else {
                    var signdate = rec_result[0].getValue('custrecord_st_signed_date');
                    if(signdate != "")
                    {
                        context.response.write('Yes');
                    }
                   

                }
            }

        }


        function getCustomer_data(emailid, timestamp) {

            log.debug("search emailid", emailid)
            var SearchObj = search.create({
                type: 'customrecord_customer_sign_data',
                filters: [
                    ['custrecord_cust_email_address', 'is', emailid],
                    'AND',
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecord_cust_time_stamp', 'is', timestamp]
                ],
                columns: [
                    search.createColumn({ name: "custrecord_last_viewed_pdf", label: "last view" }),
                    search.createColumn({ name: "custrecord_cust_email_address", label: "email" }),
                    search.createColumn({ name: "custrecord_st_signed_date"}),
                ],
            });

            var searchResults = SearchObj.run().getRange(0, 10);
            log.debug("search res", searchResults)
            return searchResults;
        }

        function formattedDateandTime() {

            var date = new Date();

            var formattedDate = format.format({
                value: date,
                type: format.Type.DATETIME,
                timezone: format.Timezone.timeZone
            });

            // var parsedDate = format.parse({
            //     value: formattedDate,
            //     type: format.Type.DATE,
            // });

            return formattedDate;

        }
        return {
            onRequest: onRequest
        }
    })