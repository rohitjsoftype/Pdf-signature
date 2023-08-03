/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
 define(['N/ui/serverWidget'],
 function (ui) {
     function onRequest(context) {
         if (context.request.method === 'GET') {
         
             var form = ui.createForm('Signature pad');
             form.addField({
                 id: 'signature',
                 type: ui.FieldType.INLINEHTML,
                 label: 'Signature'
             }).defaultValue = '<!DOCTYPE html><html lang="en" >' +
             '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base target="_blank"><link rel="stylesheet" href="https://tstdrv1338970.app.netsuite.com/core/media/media.nl?id=58588&c=TSTDRV1338970&h=RkKmAeE2al1f0R1oXBY6k3QXuW8IioqSYGQC6SBo1xbD6X5z&_xt=.css"></head>' +
             '<div id="signature-pad" class="m-signature-pad"><div class="m-signature-pad--body"><canvas id="canvas"></canvas></div><div class="m-signature-pad--footer"><div class="description">Sign above</div><div class="left">' + '<button type="button" class="button_clear" data-action="clear">Clear</button></div><div class="right">' +
             '<button type="button" class="button_save" id="savebutton" data-action="save-png">Save</button>'
                 + '</div></div></div><script  src="https://tstdrv1338970.app.netsuite.com/core/media/media.nl?id=69564&c=TSTDRV1338970&h=Cnto5J-Mi-uwYE-q7EBvMXEfORrwuNOpgchaHfHlC8szZEDz&_xt=.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/docxtemplater/3.37.12/docxtemplater.js"></script><script src="https://unpkg.com/pizzip@3.1.4/dist/pizzip.js"></script><script src="https://unpkg.com/pizzip@3.1.4/dist/pizzip-utils.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script></body></html>';
             context.response.writePage(form);



         }
        
     }
     return {
         onRequest: onRequest,
     }
 });



