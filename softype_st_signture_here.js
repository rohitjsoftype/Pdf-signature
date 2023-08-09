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

define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/render', 'N/url', 'N/redirect', 'N/http', 'N/task', 'N/config', 'N/file', 'N/xml'],

    function (ui, search, record, render, url, redirect, http, task, config, file, xml) {

        /**
               * Definition of the Suitelet script trigger point.
               *
               * @param {Object} context
               * @param {ServerRequest} context.request - Encapsulation of the incoming request
               * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
               * @Since 2015.2
               */
        function onRequest(context) {

            if (context.request.method === 'GET') {

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
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfkit@0.10.0/js/pdfkit.standalone.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/StephanWagner/jBox@v1.3.3/dist/jBox.all.min.js"></script>
    <link href="https://cdn.jsdelivr.net/gh/StephanWagner/jBox@v1.3.3/dist/jBox.all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
</head>
</head>

<body>

    <div id="main1" class="main">
        <div id="pdfViewer"></div>
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

                form.addButton({
                    id: 'custpage_save',
                    label: "Save",
                    functionName: 'createTemplate'
                });
                
                context.response.writePage(form);
            }

        }
        return {
            onRequest: onRequest
        }
    })