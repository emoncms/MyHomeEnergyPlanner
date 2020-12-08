let login_details = require('../Lib/travis_login_details.js');

describe('In a new emonCMS installation ', function () {
    it('a new user can register as an Administrator', function () {
        browser.url(login_details.login_url)
                .click('a=register')
                .setValue('[name=email]', 'email@email.com')
                .setValue('[name=username]', login_details.username1)
                .setValue('[name=password]', login_details.password1)
                .setValue("#confirm-password", login_details.password1)
                .click('#register');
        if (isAlertPresent()) {
            browser.alertAccept()
        }

        let page_url = browser.getUrl();
        expect(page_url).not.toBe(login_details.login_url);
        expect(browser.isExisting('.menu-assessment #logout-link')).toBe(true);
    });
    it(' the administrator can update the database', function () {
        browser.url(login_details.login_url + "/admin/db?apply=true");
        expect(browser.isVisible('.alert-success')).toBe(true);
    });
    it(' the adminisrtator can logout', function () {
        browser.click('.menu-assessment #logout-link');
        expect(browser.isExisting('[name=username]')).toBe(true);
    });
    it(' a new user can be created (for the MHEP tests) without getting any Jasmine errors', function () {
        browser.url(login_details.login_url)
                .click('a=register')
                .setValue('[name=email]', 'email@email.com')
                .setValue('[name=username]', login_details.username2)
                .setValue('[name=password]', login_details.password2)
                .setValue("#confirm-password", login_details.password2)
                .click('#register');
        if (isAlertPresent()) {
            browser.alertAccept()
        }
        browser.click('.menu-assessment #logout-link');
    });
});
function isAlertPresent() {
    try {
        browser.alertText()
        return true
    } catch (err) {
        return false
    }
}