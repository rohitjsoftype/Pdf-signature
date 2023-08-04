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
define(['N/search', 'N/xml', 'N/https'], function (search, xml, https) {
    let boVal = ''
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
                    ["filetype", "anyof", "PDF"]
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
        html += '<h2>Upload or select a pdf.</h2><br/>';
        // html+='<br/><br/>Click OK to update it or Cancel to select different parameters.<br/>';
        // html+='<br/><img id="spinner" src="'+$("#custpage_img_ajaxloader").val()+'" alt="Loading"/>';
        html += '<div id="btnModalY"><div><input id="uploadfile" accept=".pdf" class="btnAP" type="file" value="Upload"/>';
        html += '<div><br/><h2 style="text-align:center;">OR</h2><br/>';//
        html += `<div><select id="fileid">${selectOptions}</select><div><br/></div>`
        html += '<div style="gap:20px"><span><input id="btnCancel" type="button" onClick="init()" value="Cancel" /></span>';
        html += '<span style="margin-left:30px"><input id="okCancel" type="button" onClick="saveChoice()" value="Ok" /></span></div>';
        var option = {
            width: 500,
            height: 220,
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
        M.open();
        $('.jBox-Modal .jBox-title').css('background-color', colorBg);
        // recObj.setValue('custpage_bodycontent','<p>hello world<p>')
    }

    async function sendDataDiv() {

        var div_main = document.querySelector('#drag-div');
        var htmlvar = '';
        htmlvar += '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
        htmlvar += '<pdf>'
        htmlvar += '<head>';

        htmlvar += '<macrolist>'
        htmlvar += '<macro id="nlfooter"><table class="footer" style="width: 100%;"><tr>'
        htmlvar += '<td></td>'
        htmlvar += '<td align="right"><pagenumber/> of <totalpages/></td>'
        htmlvar += '</tr></table></macro></macrolist>'
        htmlvar += '</head>'
        htmlvar += '<body footer="nlfooter" footer-height="20pt" padding="0.1in 0.1in 0.1in 0.1in" size="A4">'

        console.log('djfj',div_main.outerHTML)
        console.log('style',JSON.stringify(div_main.style))
        htmlvar += `<div style='height:${div_main.style.height}; width:${div_main.style.width}; top:${div_main.style.top}; left:${div_main.style.left}; background-color:${div_main.style.backgroundColor}; position:${div_main.style.position}'></div>`
        // htmlvar += `<div style='${JSON.stringify(div_main.style)}'></div>`
       // var images = "";
        var canvases = document.getElementsByTagName("canvas");

        var totalheight=0;
        for (var i = 0; i < canvases.length; i++) {
            totalheight += Number(canvases[i].height);
        }
        
        var img_position = Math.ceil((div_main.style.top%totalheight)*canvases.length-1);
        for (var i = 0; i < canvases.length; i++) {
            //do something to each div like
            var can_element = document.createElement('canvas');
            var ctx = can_element.getContext('2d');
            var img = new Image();
            var canvasData = await new Promise((resolve,reject)=>{
               let can_data = canvases[i].toDataURL('image/png')
                resolve(can_data)
                })
                .then(data =>{
                img.src=data;
         });
            ctx.drawImage(img.src,0,0,canvases[i].width,canvases[i].height);
            if(i == img_position)
            {
                ctx.fillRect(div_main.style.top,div_main.style.left,div_main.style.width,div_main.style.height)
            }
            var canvasDataimg = await new Promise((resolve,reject)=>{
            let can_data = can_element.toDataURL('image/png')
                resolve(can_data)
        }).then(data=>{
                img.src=data;
            });
            htmlvar += '<img height="1000px" width="750px" src="'+img.src+'"/>'
        }
        

        htmlvar += '</body>'
        htmlvar += '</pdf>';

        var bodydata = {
            'div_main': htmlvar
        }

        console.log(bodydata);

        var response = https.post({
            url: 'https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2254&deploy=1&compid=TSTDRV1338970&h=f05d0658b66b376313fc',
            body: bodydata
        });

    }

    function closeWindow() {
        window.close()
    }
    function createSignHolder() {
        alert('here')
        let div = document.createElement('div');
        div.id = 'drag-div'
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.backgroundColor = 'black'
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
                // console.log('event.clientX ',event.clientX )
                // Calculate the offset between the mouse and the div's top-left corner
                const rect = event.target.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;

                // Update the position of the div based on the mouse movement
                document.addEventListener("mousemove", drag);
                function drag(event) {
                    if (isDragging) {
                        // console.log('offsetX',offsetX);
                        // console.log('offsetY',offsetY);
                        draggableResizable.style.left = window.screenX + (event.clientX - offsetX) + "px";
                        draggableResizable.style.top = window.scrollY + (event.clientY - offsetY) + "px";
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



    }
    return {
        pageInit: pageInit,
        closeWindow: closeWindow,
        createSignHolder: createSignHolder,
        sendDataDiv: sendDataDiv
    }

})