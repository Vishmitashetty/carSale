'use strict';
jQuery(document).ready(function(){

    var check = 'true'; 

    // Define Date Field
    jQuery('form input.input-date').each(function(){
            var datepickerid = jQuery(this).attr('data-idunique');            
            jQuery('#'+datepickerid).datepicker({
                dateFormat : jQuery(this).attr("data-format")
            });        
    });

    jQuery('form').each(function(){
        var idformnew = jQuery(this).attr('data-uni');
        jQuery(this).find('#'+idformnew+' .form-control').tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
        jQuery(this).find('#'+idformnew+' .form-control').on('blur', function(){
            jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
        });
    });
    

    // validate and process form
    jQuery('form').find('.submit-button').on('click', function (e) {

        var idform = jQuery(this).attr('data-idform');
        var formnew = jQuery('#'+idform);

        formnew.find('.get_data').each(function(){

            // Validate or text and textarea field
            if(jQuery(this).attr('type') == 'text' || jQuery(this).attr('type') == 'textarea'){

                var name = jQuery(this).val();
                var data_placeholder = jQuery(this).attr('data-place');            

                // Check is empty
                if(jQuery(this).hasClass('require') && (name == '' || name == data_placeholder)){
                    jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('show');
                    jQuery(this).focus();
                    check = 'false';                    
                    return false;                    
                }else {
                    jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
                    check = 'true';
                }

                // Check email syntax
                if(jQuery(this).hasClass('input-email') && name != '' && name != data_placeholder){
                    var email = jQuery(this).val();
                    var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+.[a-zA-z0-9]{2,4}$/;            
                    if (!filter.test(email)) {
                        jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('show');
                        jQuery(this).focus();
                        check = 'false';
                        return false;
                    }else{
                        jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
                        check = 'true';                        
                    }
                };


                // Check Url syntax
                if(jQuery(this).hasClass('input-url') && name != '' && name != data_placeholder){
                    var url = jQuery(this).val();
                    var filter_url = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                    if (!filter_url.test(url)) {
                        jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('show');
                        jQuery(this).focus();
                        check = 'false';
                        return false;
                    }else{
                        jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
                        check = 'true';                        
                    }
                };

                // Check Number syntax
                if(jQuery(this).hasClass('input-number') && name != '' && name != data_placeholder){
                    var number = jQuery(this).val();
                    var filter_phone = /^[0-9-+]+$/;
                    if (!filter_phone.test(number)) {
                        jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('show');
                        jQuery(this).focus();
                        check = 'false';
                        return false;
                    }else{
                        jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
                        check = 'true';                        
                    }
                };

            }

            // Validate for dropdown field
            if(jQuery(this).hasClass('input-price') && jQuery(this).hasClass('require')){
                if(jQuery(this).find('option:selected').val() == '' && jQuery(this).find('option:selected').val() != 'undefine'){
                    jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('show');
                    jQuery(this).focus();
                    check = 'false';                    
                    return false;
                }else{
                    jQuery(this).tooltip({placement: 'top', trigger: 'manual'}).tooltip('hide');
                    check = 'true';
                }
            }
            

        }); 

    
        if(check == 'false'){
            e.preventDefault();
            return false;
        }
        e.preventDefault();


        var userinfo = '';
        var label_data = '';
        var value_data = '';
        
        
        // Get userinfo that user put in form register
        formnew.find('.get_data').each(function(){
            label_data = '';
            value_data = '';

            if (jQuery(this).attr('type') == 'checkbox'){
                if(jQuery(this).is(":checked")){
                    label_data = jQuery(this).attr('name');
                    value_data = jQuery(this).val();
                }
                
            }else if (jQuery(this).attr('type') == 'radio'){
                if(jQuery(this).is(":checked")){
                    label_data = jQuery(this).attr('name');
                    value_data = jQuery(this).val();     
                }
            }else{
                label_data = jQuery(this).attr('data-place');
                value_data = jQuery(this).val();    
            }

            if(label_data != '' && value_data != ''){
                userinfo = userinfo +'<strong>'+label_data +'</strong>:&nbsp;'+value_data + '<br/>';     
            }            
           
        });
        var order_id =  formnew.find('input.custom').val();

       

        jQuery(this).prop("disabled",true);
        formnew.find('.event_loading').addClass('show');

        // Store register to register list
        jQuery.post(ajax_object.ajaxurl, {
            action: 'ajax_action',
            data: {
                userinfo:userinfo,                
                orderid: order_id
            }
        }, function(reponse) {
            if(reponse == 'true'){
                var paypal_active = formnew.find('input.input-paypal_active').val();
                if(paypal_active == 1){
                    /* Register with paypal */
                    // Go to Paypal
                    var link_paypal = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
                    var paypal_environment = formnew.find('.input-register_environment').val();
                    if(paypal_environment == 1){
                        link_paypal = "https://www.paypal.com/cgi-bin/webscr";
                    }else{
                        link_paypal = "https://www.sandbox.paypal.com/cgi-bin/webscr";
                    }
                    var paypal_email = formnew.find('.input-paypal').val();
                    var currency_code = formnew.find('.input-currency_code').val();
                    var return_url = formnew.find('.input-return_url').val();
                    var cancel_return = formnew.find('.input-cancel_url').val();
                    var price = formnew.find('.unique_price_paypal').val();
                    var register_title_paypal = formnew.find('.input-register_title_paypal').val();
                    var register_notify_paypal_page = formnew.find('.register_notify_paypal_page').val();
                    var custom = formnew.find('.custom').val();

                    var paypal_url = link_paypal+'?cmd=_xclick&business='+paypal_email+'&item_name='+register_title_paypal+'&amount='+price+'&currency_code='+currency_code+'&return='+return_url+'&cancel_return='+cancel_return+'&notify_url='+register_notify_paypal_page+'&custom='+custom+'&item_number='+custom;
                    window.location = encodeURI(paypal_url);
                    return false;    
                }else{
                    /* Register free no paypal */
                    formnew.find('.form-alert').append('' +
                    '<div class=\"alert alert-success registration-form-alert fade in\">' +
                    '<button class=\"close\" data-dismiss=\"alert\" type=\"button\">&times;</button>' +
                    formnew.find('.register_success_msg').val() +
                    '</div>' +
                    '');
                    /*
                    formnew.find('.get_data').each(function(){
                        jQuery(this).val('');
                    });                    */
                    formnew[0].reset();
                    formnew.find('.form-control').focus().blur();

                    formnew.find('.submit-button').prop("disabled",false);
                    formnew.find('.event_loading').removeClass('show');
                }
                
                    
            }else{
               formnew.find('.form-alert').append('' +
                    '<div class=\"alert alert-error registration-form-alert fade in\">' +
                    '<button class=\"close\" data-dismiss=\"alert\" type=\"button\">&times;</button>' +
                    '<strong>Registration Form Error!</strong>.' +
                    '</div>' +
                    '');
               return false;
            }
        });

           
    });

    

});