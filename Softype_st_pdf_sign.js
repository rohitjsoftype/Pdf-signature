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
    ** @Author      : Rohit Jha
    ** @Dated       : 03-08-2023
    ** @Version     : 2.1
    ** @Description : for creating template and signing pdf
    ***************************************************************************************/

    define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/render', 'N/url', 'N/redirect', 'N/http', 'N/task',  'N/config'],

       function(ui, search, record, render, url, redirect, http, task, config) {

  /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {
        try {
            var form = ui.createForm({ // create new form
                title: 'Pdf signature'
            });

            var body_content = form.addField({
                id: 'custpage_bodycontent',
                type: ui.FieldType.INLINEHTML,
                label: "Body"
            });
     
            form.addButton({
                id: 'custpage_cancelbutton',
                label: "Cancel",
                functionName: 'closeWindow'
            });
            form.addButton({
                id: 'custpage_submit',
                label: "Submit",
                functionName:'sendEmail'
            });
            context.response.writePage(form);
         
        }
            catch(err){
                log.error("err",err)
            }
        }
      
    return {
        onRequest:onRequest
    }
})