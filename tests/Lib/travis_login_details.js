/************************************************************
 * Login details to be used when setting up emonCMS and running
 * tests in Travis 
 *************************************************************/

module.exports = {
    login_url: 'http://127.0.0.1/emoncms/',
    username1: 'admin', // same user than the one that travis uses when creating the emonCMS admin
    password1: 'admin',
    username2: 'user',
    password2: 'user'
};