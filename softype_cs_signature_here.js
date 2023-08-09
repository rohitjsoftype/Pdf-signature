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
define(['N/search', 'N/xml', 'N/https', 'N/record'], function (search, xml, https, record) {
    function pageInit(context) {
        const searchParams = new URLSearchParams(document.URL);
        const templateId = searchParams.get("templateId");
        var rec_Obj = record.load({
            type: 'customrecord_st_pdf_template',
            id: templateId || '2'
        })
        var fileurl = rec_Obj.getValue('custrecord_st_file_link')
        var div_position = rec_Obj.getValue('custrecord_st_sign_cordinate')
        fileurl += 'https://tstdrv1338970.app.netsuite.com/';
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
                    // Set the scale of the PDF. You can adjust this value as needed.
                    const scale = 2;
                    // Set the viewport based on the desired scale
                    const viewport = page.getViewport({ scale });
                    // Create a canvas element to display the page and the image
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    // console.log("viewpoerthh", viewport.height)
                    // console.log(" viewport.width",t)
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    pdfContainer.appendChild(canvas);

                    // Render the page content on the canvas
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    page.render(renderContext);
                });
            }

            const div_main = document.getElementById('pdfViewer');
            div_main.innerHTML += div_position;

            const drag_img = document.querySelectorAll('#drag-div');

            for(var k=0;k<drag_img.length;k++)
            {
                drag_img[k].addEventListener("click", function (event) {
                    let suitelet_Url = "https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2258&deploy=1&compid=TSTDRV1338970&h=4c4adb9172d7477b2cf5"
                    window.open(suitelet_Url, 'myWindow', 'width=750,height=500,resizable=no')
                });
            }


            
            

        });
    }

    function createTemplate()
    {
        // var quotes = document.getElementById('main1');
        // html2canvas(quotes).then((canvas) => {
        //     //! MAKE YOUR PDF
        //     var pdf = new jsPDF('p', 'pt', 'letter');

        //     var quotes_len =  Math.ceil(quotes.clientHeight / 1584)
        //     for (var i = 0; i < quotes_len-1; i++) {
        //         //! This is all just html2canvas stuff
        //         console.log("quotes.clientHeight / 1584",quotes_len)
        //         var srcImg = canvas;
        //         var sX = 40;
        //         if (i == 0) {
        //             var sY = 50;
        //         }
        //         else {
        //             var sY = 1980 * i; // start 980 pixels down for every new page
        //         }

        //         var sWidth = 1380;
        //         var sHeight = 1980;
        //         var dX = 0;
        //         var dY = 0;
        //         var dWidth = 1380;
        //         var dHeight = 1980;

        //         window.onePageCanvas = document.createElement("canvas");
        //         onePageCanvas.setAttribute('width', 1380);
        //         onePageCanvas.setAttribute('height', 1980);
        //         var ctx = onePageCanvas.getContext('2d');
        //         // details on this usage of this function: 
        //         // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
        //         ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

        //         // document.body.appendChild(canvas);
        //         var canvasDataURL = onePageCanvas.toDataURL("image/jpeg", 0.5);

        //         var width = onePageCanvas.width;
        //         var height = onePageCanvas.clientHeight;

        //         console.log("height", height);
        //         console.log("width", width);
        //         //! If we're on anything other than the first page,
        //         // add another page
        //         if (i > 0) {
        //             pdf.addPage(); //8.5" x 11" in pts (in*72)
        //         }
        //         //! now we declare that we're working on that page
        //         pdf.setPage(i + 1);
        //         //! now we add content to that page!
        //         pdf.addImage(canvasDataURL, 'JPEG', 40, 30, 530, 720, 'undefined' + i, 'FAST');

        //     }
        //     //! after the for loop is finished running, we save the pdf.
        //     pdf.save('Test45.pdf');

        // }
        // )


        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // Loop through each .pdf-page element

        var div_obj = {};

        var div_grag = document.querySelectorAll('#drag-div');
        const canvas_height = (document.getElementsByTagName('canvas')[0]).height;
        console.log("canvas_height",canvas_height);
        for(k=0;k<div_grag.length;k++)
        {
            var div_drag_top = div_grag[k].style.top;
            console.log("div_drag_top",div_drag_top);
            div_drag_top = div_drag_top.replace("px","");
            var pageno = Math.floor(div_drag_top/canvas_height);
            if(!div_obj[pageno])
            {
            div_obj[pageno]= [div_grag[k]];
            }
            else
            {
                div_obj[pageno].push(div_grag[k]);
            }
        }

        console.log("div_obj[index]",JSON.stringify(div_obj));
        const pdfPages = document.getElementsByTagName('canvas')
        pdfPages.forEach(function (page, index) {
            // Use html2canvas to capture the page content and convert it to an image
            html2canvas(page).then(function (canvas) {
                const imgData = canvas.toDataURL('image/jpeg');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                if (index !== 0) {
                    pdf.addPage(); // Add a new page for each subsequent page
                }
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                if(div_obj[index])
                {
                    console.log("div_obj[index]",JSON.stringify(div_obj));
                    let signatures = div_obj[index];
                    signatures.forEach((s)=>{
                        console.log("s.style.left",s.style.left);
                        console.log("s.style.top",s.style.top);
                        console.log("s.style.height",s.style.height);
                        console.log("s.firstChild.src",s.firstChild.src);
                        pdf.addImage(s.firstChild.src,'JPEG',(s.style.left).replace("px",""),(s.style.top).replace("px",""),(s.style.width).replace("px",""),(s.style.height).replace("px",""))
                    })
                }
                // If this is the last page, save the PDF
                if (index === pdfPages.length - 1) {
                    pdf.save('multi-page-pdf.pdf');
                }
            });
        });
    }



    return {
        pageInit: pageInit,
        renderPdfFile: renderPdfFile,
        createTemplate:createTemplate
    }

})