/************************************************
 * This test will login in an emonCMS installation.
 * It looks for the login details in the file '../Lib/login_details.js'
 * This files looks like: 
 *      module.exports = {
 *          login_url: 'http://your_emonCMS_installation',
 *          username1: 'an_existing_user',
 *          password1: 'the_password'
 *      };
 *   
 * **********************************************/

let login_details = require('../Lib/login_details.js');
let helper = require('../Lib/assessment_tests_helper.js');

describe('A MHEP user ', function () {
    it('can login', function () {
        helper.logIfDebug('\nSpecification: A MHEP user can login\n---------------------');
        helper.loginDefaultUser1();
        let page_url = browser.getUrl();
        expect(page_url).not.toBe(login_details.login_url);
        expect(browser.isExisting('a*=Logout')).toBe(true);
    });
    
    it('is in the Assessment page after login', function () {
        helper.logIfDebug('\nSpecification: is in the Assessment after login\n---------------------');
        expect(browser.getTitle()).toBe('Emoncms - assessment list');
    });

    it('can logout', function () {
        helper.logIfDebug('\nSpecification: A MHEP user can logout');
        helper.logout();
        let page_url = browser.getUrl();
        expect(page_url).toBe(login_details.login_url);
        expect(browser.isExisting('[name=username]')).toBe(true);
    });
});

