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
            o[this.name].push(this.value || '');
        }
        else
        {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

Dominar.Validator.register('passConfirmation', function(confirmPassword) {
    return document.getElementById('register-form').password.value === confirmPassword;
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
        error: function (e)
        {
            handleError(e.status);
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
           alert(JSON.stringify(data));
       },
       error: function (e)
       {
           alert(JSON.stringify(e));
           alert(JSON.stringify(e.responseJSON));
       }
    });
});

function handleError(error)
{
    switch (error)
    {
        case 404:
        {
            alert('Username not found.');
            $('#login-form input[id=username]').focus();
            $('#login-form input[id=username]').val('');
            $('#login-form input[id=username]').blur();
            break;
        }
        case 401:
        {
            alert('Password incorrect.');
            $('#login-form input[id=password]').focus();
            $('#login-form input[id=password]').val('');
            $('#login-form input[id=password]').blur();
            break;
        }
    }
}

var logval = new Dominar(document.getElementById('login-form'),
{
    username:
    {
        rules: 'required|min:12',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message: false
    },
    password:
    {
        rules: 'required|min:5|max:20',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message: false
    }
});

var regval = new Dominar(document.getElementById('register-form'),
{
    username:
    {
        rules: 'required|min:12',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message: false
    },
    password:
    {
        rules: 'required|min:5|max:20',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message: false
    },
    confirmPassword:
    {
        rules: 'required|min:5|max:20|passConfirmation',
        triggers: ['keyup', 'change', 'focusout'],
        feedback: false,
        message: false
    }
});
