var User = require('./../models/userModel');

var getAll = function (req, res)
{
    User.find(function(err, users)
    {
        if (err)
        {
            res.status(500);
            res.send('Internal Error');
        }
        else
        {
            res.status(200);
            res.send(users);
        }
    });
};

var putUser = function (req, res)
{
    var addUser = new User(req.body);
    addUser.save(function(err, savedUser)
    {
        if (err)
        {
            res.status(500);
            res.send('failed to save user');
        }
        else
        {
            res.status(201);
            res.send(savedUser);
        }
    });
};

var getByID = function (req, res)
{
    User.findById(req.params.user_id, function(err, user)
    {
        if (err)
        {
            res.status(404);
            res.send('Not Found');
        }
        else
        {
            res.status(200);
            res.send(user);
        }
    });
};

module.exports =
{
    getAll: getAll,
    putUser: putUser,
    getByID: getByID
}
