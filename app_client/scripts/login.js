//************************************************************
//  login.js                                                //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 10/08/16.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  08Oct16     J. Carter   Initial Design                  //
//  16Nov16     J. Carter   Added AJAX calles to API for    //
//                          login and register              //
//************************************************************


/**
 * Serializes all input fields of the object
 *
 * @return {object} object containing the id's of input fields and their values
 */
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function()
    {
        if (o[this.name] !== undefined)
        {
            if (!o[this.name].push)
            {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value.toLowerCase() || '');
        }
        else
        {
            o[this.name] = this.value.toLowerCase() || '';
        }
    });
    return o;
};

Dominar.Validator.register('passConfirmation', function(confirmPassword) {
    return document.getElementById('register-form').password.value === confirmPassword;
});

Dominar.Validator.register('emailConfirmation', function(username) {
    return username.toLowerCase().indexOf('gatech.edu') !== -1;
});

document.getElementById('login-form').addEventListener('dominarSubmitPassed', function(event)
{
   event.preventDefault();

   $.ajax(
   {
        type: 'POST',
        url: '/users/login',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify($('#login-form').serializeObject()),
        dataType: 'json',
        success: function (data)
        {
            window.location.href = '/dashboard';
        },
        error: function (error)
        {
            handleError(error.status);
        }
    });
});

document.getElementById('register-form').addEventListener('dominarSubmitPassed', function(event)
{
    event.preventDefault();

    var o = $('#register-form').serializeObject();
    o.role = $("#instructor").prop('checked') ? 'instructor' : 'student';
    delete o.confirmPassword;
    $.ajax(
    {
       type: 'POST',
       url: '/users/',
       contentType: 'application/json; charset=utf-8',
       data: JSON.stringify(o),
       dataType: 'json',
       success: function (data)
       {
           swal(
               {
                   title            : "Register Success",
                   type             : "success",
                   showCancelButton : false,
                   confirmButtonText: "Awesome!",
                   closeOnConfirm   : true
               },
               function()
               {
                   $('#register-form input[id=username]').val('');
                   $('#register-form input[id=password]').val('');
                   $('#register-form input[id=confirmPassword]').val('');
                   activeTab('tabLogin');
               }
           );
       },
       error: function (error)
       {
           handleError(error.status);
       }
    });
});

function handleError(error)
{
    switch (error)
    {
        case 404:
        {
            sweetAlert('Username not found.', "", "error");
            invalidateInput('login-form', 'username');
            break;
        }
        case 401:
        {
            sweetAlert('Password incorrect.', "", "error");
            invalidateInput('login-form', 'password');
            break;
        }
        case 500:
        {
            sweetAlert('Username taken.', "", "error");
            invalidateInput('register-form', 'username');
            break;
        }
    }
}

/**
 * Clears all the input field contained in the form
 *
 * @param  {id} form  the form id that contains the input
 * @param  {id} input the input id to be cleared
 */
function invalidateInput(form, input)
{
    var field = $('#' + form + ' input[id=' + input + ']');
    field.val('');
    field.focus();
    field.blur();
}

/**
 * Activates the tab id passed in
 * 
 * @param  {id} tab the tab id to be actived
 */
function activeTab(tab)
{
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
}

var logval = new Dominar(document.getElementById('login-form'),
{
    username:
    {
        rules   : 'required|email|emailConfirmation',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message : false
    },
    password:
    {
        rules   : 'required|min:5|max:20',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message : false
    }
});

var regval = new Dominar(document.getElementById('register-form'),
{
    username:
    {
        rules   : 'required|email|emailConfirmation',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message : false
    },
    password:
    {
        rules   : 'required|min:5|max:20',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message : false
    },
    confirmPassword:
    {
        rules   : 'required|min:5|max:20|passConfirmation',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message : false
    }
});
