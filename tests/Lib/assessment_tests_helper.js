let debug = process.env.DEBUG;
let travis = process.env.TRAVIS;
let login_details = getLoginDetails();

function getLoginDetails() { // Info about users can be found in the readme.md file
    if (travis)
        return require('./travis_login_details');
    else
        return require('./login_details_for_an_existing_installation');
}

module.exports = {
    getLoginDetails: function () {
        return getLoginDetails();
    },
    loginDefaultUser1: function () {
        this.logIfDebug('Loging as ' + login_details.username1 + ' - ' + login_details.password1);
        login(login_details.login_url, login_details.username1, login_details.password1);
    },
    goToAssessmentPage: function () {
        this.logIfDebug('Going to Assessment page');
        browser.click('a=Assessments');
    },
    goToMyAccountPage: function (name, description) {
        this.logIfDebug('Going to My Account page');
        browser.click('a=Account');
    },
    createAssessment: function (name, description) {
        this.logIfDebug('Creating new assessment ' + name);
        browser.setupInterceptor(); // capture ajax calls 
        browser.click('button=New')
                .setValue('#project-name-input', name)
                .setValue('#project-description-input', description)
                .click('button=Create');
        return browser.getRequest(1).response.body.id;
    },
    goToAssessment: function (id) {
        this.logIfDebug('Going to assessment ' + id);
        browser.click('#open-project-' + id);
    },
    deleteAssessment: function (id) {
        this.logIfDebug('Deleting assessment ' + id);
        browser.click('.delete-project[projectid="' + id + '"]')
                .click('#confirmdelete');
    },
    shareAssessment: function (username, id) {
        this.logIfDebug('Sharing assessment ' + id + ' with ' + username);
        browser.click('.share-project-openmodal[projectid="' + id + '"]')
                .setValue('#modal-share-project #sharename', username)
                .click('#modal-share-project #share-project')
                .click('#modal-share-project .close');
    },
    logout: function () {
        this.logIfDebug('Logging out');
        browser.click('.menu-assessment #logout-link');
    }
    ,
    logIfDebug(message) {
        if (debug)
            console.log(message);
    },
    clearAjaxCallsBuffer() {
        try {
            browser.getRequests();
        } catch (e) {
        }
    }
};
function login(url, username, password) {
    if (debug)
        console.log('Logging: ' + url + ' - ' + username + ' - ' + password);
    browser.url(url)
            .setValue('[name=username]', username)
            .setValue('[name=password]', password)
            .click('#login');
    if (isAlertPresent()) {
        browser.alertAccept()
    }
}
function isAlertPresent() {
    try {
        browser.alertText()
        return true
    } catch (err) {
        return false
    }
}