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
    define(['N/record', 'N/currentRecord', 'N/search','N/runtime','N/email','N/url'],function(record,currentRecord,search,runtime,email,url){
        let boVal = ''
        function pageInit(context){
            // alert('here')
            let htmlContent = `<!DOCTYPE html>
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
            </head>
            </head>
            <body>
                <button id="sign">Sign</button>
                <input type="file" accept=".pdf"  id="upload"/>
                <button type="button" id="save">Save</button>
                <div class="main">
                    <div id="pdfViewer"></div>
                    <div class="draggable-container" id="container">
                    </div>
                </div>
                <script>
                    window.jsPDF = window.jspdf.jsPDF;
                    const container = document.getElementById("container");
                    const uploadFile = document.getElementById("upload");
                    const savebtn = document.querySelector("#save");
                    let element = []
            
                    let img = new Image();
                    window.addEventListener('DOMContentLoaded',()=>{
                        container.style.display = 'none'
                    })
                    savebtn.addEventListener('click', () => {
                    // Function to draw an image on the canvas
                    async function drawImageOnCanvas(canvas, imageSrc, x, y, width, height) {
                        const ctx = canvas.getContext('2d');
                        const image = await loadImage(imageSrc);
                        ctx.drawImage(image, x, y, width, height);
                    }
            
                    // Function to load an image asynchronously
                    function loadImage(imageSrc) {
                        return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = imageSrc;
                        });
                    }
            
                    const newCanvas = document.createElement('canvas');
                    const context = newCanvas.getContext('2d');
                    newCanvas.width = 2000;
                    newCanvas.height = 3000;
                    const canvases = document.querySelectorAll("canvas");
                    let prevHeight = 0;
            
                    // Using Promise.all to wait for all canvas images to load
                    Promise.all(Array.from(canvases).map((canvas) => {
                        const parent = canvas.parentNode;
                        const newImg = canvas.toDataURL('image/png');
                        const imageObj = {
                        img: newImg,
                        x: parseInt(parent.style.left.replace("px", '')) || 0,
                        y: parseInt(parent.style.top.replace("px", '')) || prevHeight,
                        width: canvas.width,
                        height: canvas.height
                        };
                        prevHeight += canvas.height;
                        return imageObj;
                    }))
                        .then((imageObjects) => {
                        // Draw images on the newCanvas in sequence
                        return imageObjects.reduce((promise, imageObj) => {
                            return promise.then(() => drawImageOnCanvas(newCanvas, imageObj.img, imageObj.x, imageObj.y, imageObj.width, imageObj.height));
                        }, Promise.resolve());
                        })
                        .then(() => {
                        // Append the newCanvas as an image to the "main" div
                        const finalImg = document.createElement('img');
                        finalImg.src = newCanvas.toDataURL("image/png");
                        finalImg.width = "50%";
                        finalImg.height = "50%";
                        // document.querySelector(".main").appendChild(finalImg);
                        console.log('finalImg', finalImg);
                    
                        // Get the image width and height
                        const imgWidth = finalImg.width;
                        const imgHeight = finalImg.height;
                        // const doc1 = new window.PDFDocument()
                        // // Scale proprotionally to the specified width
                        // doc1.image(finalImg.src, 0, 15, {width: 300})
                        // doc1.end()
                        // window.open(doc1);
                        console.log('imgwidth',imgWidth);
                        console.log('imgheigth',imgHeight)
                        // Create a new jsPDF instance
                        const doc = new jsPDF();
                        // Add the image to the PDF
                        // doc.addImage(finalImg.src, 'PNG', 0, 0, imgWidth, imgHeight);
            
                        doc.addImage(finalImg.src, 'PNG', 10, 10, 300, 300);
                        // doc.addImage('monkey', 70, 10, 100, 120); // use the cached 'monkey' image, JPEG is optional regardless
            
            
            
                        // doc.output('datauri');
                        // Save the PDF
                        doc.save('SigendPdf.pdf');
                 
                        })
                        .catch((error) => {
                        console.error('Error while saving:', error);
                        });
                    });
            
                    // savebtn.addEventListener('click',()=>{
                    //     const newCanvas = document.createElement('canvas');
                    //     const context = newCanvas.getContext('2d');
                    //     let canvases = document.querySelectorAll("canvas");
                    //     let prevheight = 0
                    //     for(let canvas of canvases){
                    //         let parent = canvas.parentNode
                    //         let newImg = new Image();
                    //         newImg.src = canvas.toDataURL('image/png')
                    //         newImg.onload = function () {
                    //         console.log('newImg',newImg);
                    //         if(parent.style.left && parent.style.right){
                    //             context.drawImage(newImg,parseInt(parent.style.left.replace("px",'')),parseInt(parent.style.top.replace("px",'')),canvas.width,canvas.height)
                    //         }else{
                    //             context.drawImage(newImg,0,prevheight+canvas.height,canvas.width,canvas.height)
            
                    //         }
            
                    //         prevheight+=canvas.height;
                    //     }
                    //     }
                    //     let finalImg = document.createElement('img');
                    //     finalImg.src = newCanvas.toDataURL("image/png");
                    //     document.querySelector(".main").appendChild(finalImg)
                    //     console.log('finalImg',finalImg)
                    // })
                   
                    uploadFile.addEventListener("input",()=>{
                        const file = uploadFile.files[0];
                        const reader = new FileReader();
                        reader.addEventListener("loadend",()=>{
                            let data = reader.result;
                            pdfjsLib.getDocument(data).promise.then(pdf => {
                                // Get the number of pages in the PDF
                                const numPages = pdf.numPages;
            
                                // Set up a container to hold the PDF pages and the image
                                const pdfContainer = document.getElementById('pdfViewer');
                                let pdfChildrens = pdfContainer.hasChildNodes() 
                                if(pdfChildrens){
                                    pdfContainer.childNodes.forEach(child=>pdfContainer.removeChild(child))
                                }
                                // Loop through each page and create a canvas element to display it
                                for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                                    pdf.getPage(pageNum).then(page => {
                                    // Set the scale of the PDF. You can adjust this value as needed.
                                    const scale = 1.5;
            
                                    // Set the viewport based on the desired scale
                                    const viewport = page.getViewport({ scale });
            
                                    // Create a canvas element to display the page and the image
                                    const canvas = document.createElement('canvas');
                                    const context = canvas.getContext('2d');
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
                            });
            
                        })
                        reader.readAsArrayBuffer(file)
            
                  
                   
                    })
            
                
                    let mouseOffsetX, mouseOffsetY;
                    const signbtn = document.getElementById('sign');
                    signbtn.addEventListener('click',()=>{
                        let suitelet_Url = "https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2070&deploy=1&compid=TSTDRV1338970&h=dde2fdd0f9743e483eb7"
                        window.open(suitelet_Url ,'myWindow','width=750,height=500,resizable=no')
                    })
                  
                    window.addEventListener("message", function (event) {
                        // Ensure the message is from the expected origin
                        if (event.origin === "https://tstdrv1338970.extforms.netsuite.com") {
                            // Do something with the received data from the child window
                            console.log("Received value from popup window:", event.data);
                            img.src = event.data
                            img.onload = function() {
                                const canvas = document.createElement('canvas');
                                canvas.id = "signcanvas"
                                const context = canvas.getContext('2d');
                                // Render the image on the canvas
                                context.drawImage(img, 0, 0, 199, 100);
                                // element.push({img,x:0,x:0,w:199,h:100})
                                document.getElementById('container').childNodes.forEach(child=>{
                                    if(child.nodeName === "CANVAS"){
                                        document.getElementById('container').removeChild(child)
                                    }
                                })
                                document.getElementById('container').appendChild(canvas)
                                canvas.addEventListener("mousedown",dragImg);
                                canvas.addEventListener("click",()=>{
                                 
                                })
            
                                container.style.display = 'block'
                                // container.style.top = '10px'
                                // container.style.left = '10px'
                              };
                        }
                    });
              
                const draggableResizable = document.getElementById("container");
                let isDragging = false;
                let isResizing = false;
                let resizeStartX, resizeStartY;
                let originalWidth, originalHeight;
                function dragImg(event) {
                    // console.log('event',event.target)
                    if (event.target.classList.contains("draggable-container") || event.target.id === "signcanvas") {
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
                                draggableResizable.style.left = window.screenX +(event.clientX - offsetX) + "px";
                                draggableResizable.style.top = window.scrollY + (event.clientY - offsetY) + "px";
                            }
                            if(event.clientY > 600){
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
            
                draggableResizable.addEventListener("mousedown",dragImg);
                
            
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
                        let imageData = ctx.getImageData(0,0,signCanvas.width,signCanvas.height);
                    
                        // var ratio = width/width;
                        // console.log('imageData',imageData);
                        // console.log('signCanvas',signCanvas);
                        // console.log('signCanvas',signCanvas.offsetWidth);
                        // console.log('signCanvas',signCanvas.offsetHeight);
                        signCanvas.width = Math.floor(width/1.75)  ;
                        signCanvas.height = Math.floor(height/1.75)  ;
                        // ctx.scale(ratio, ratio);
                        ctx.drawImage(img, 0, 0, signCanvas.width ,signCanvas.height);
                        element.push({img,x:0,x:0,w:signCanvas.width,h:signCanvas.height})
                        const editorSymbol = document.getElementById("editor")
                        editorSymbol.style.left = (width -15) +"px"
            
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
                removeDiv.textContent="X"
                removeDiv.style.width = "10px";
                removeDiv.style.height = "10px";
                removeDiv.style.color = "red";
                removeDiv.style.position = "absolute";
                removeDiv.style.top = 0;
                removeDiv.style.left = 0;
                removeDiv.style.cursor = "pointer";
                draggableResizable.prepend(removeDiv);
                removeDiv.addEventListener("click", ()=>{
                    container.style.display = 'none'
                    container.removeChild(document.getElementById('signcanvas'))
            
                });
                const editSign = document.createElement("div");
                editSign.id = "editor"
                editSign.textContent="✎"
                editSign.style.width = "10px";
                editSign.style.height = "10px";
                editSign.style.color = "black";
                editSign.style.position = "absolute";
                editSign.style.top = 0;
                const rect = draggableResizable.getBoundingClientRect();
                console.log('rect',rect)
                editSign.style.left = (rect.width -15) + "px" ;
                editSign.style.cursor = "pointer";
                draggableResizable.prepend(editSign);
                editSign.addEventListener("click", ()=>{
                    let suitelet_Url = "https://tstdrv1338970.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2070&deploy=1&compid=TSTDRV1338970&h=dde2fdd0f9743e483eb7"
                    window.open(suitelet_Url ,'myWindow','width=750,height=500,resizable=no')
                });
            
            
            
                </script>
                
            </body>
            </html>
            `
           
            
        }
       
        function closeWindow(){
            window.close()
        }
     
 
        return{
            pageInit:pageInit,
            closeWindow:closeWindow,
        }
    
    })