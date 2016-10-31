$(document).ready(function () {
    $('#lpassword').tooltip({
        trigger:'manual',
        title: 'Password between 5 and 20 characters',
        placement: 'right'
    });
});

$('#lpassword').click(function() {
    $('#lpassword').tooltip('hide');
});

document.getElementById('login-form').addEventListener('dominarSubmitFailed', function(event) {
    $(this).find('#lpassword').tooltip('show');
});

var logval = new Dominar(document.getElementById('login-form'),
{
    lemail:
    {
        rules: 'required|min:12',
        triggers: ['keyup', 'change'],
        feedback: false,
        message: false
    },
    lpassword:
    {
        rules: 'required|min:5|max:20',
        triggers: ['keyup', 'change'],
        feedback: false,
        message: false
    }
});

var regval = new Dominar(document.getElementById('register-form'),
{
    remail:
    {
        rules: 'required|min:12',
        triggers: ['keyup', 'change'],
        feedback: false,
        message: false
    },
    rpassword:
    {
        rules: 'required|min:5|max:20',
        triggers: ['keyup', 'change'],
        feedback: false,
        message: false
    },
    rconfirmPassword:
    {
        rules: 'required|min:5|max:20',
        triggers: ['keyup', 'change'],
        feedback: false,
        message: false
    }
});
