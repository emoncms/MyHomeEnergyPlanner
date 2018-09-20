/************************************************
 * This test will login in an emonCMS installation.
 * It looks for the login details in the file '../Lib/login_details.js'
 * It also shares an assessment with another user.
 * This files looks like: 
 *      module.exports = {
 *          login_url: 'http://your_emonCMS_installation',
 *          username1: 'an_existing_user',
 *          password1: 'the_password',
 *          username2: 'another_existing_user',
 *          password2: 'the_other_password'
 *      };
 *   
 * **********************************************/

let login_details = require('../Lib/login_details');
let helper = require('../Lib/assessment_tests_helper.js');

describe('A Group user', function () {

    let assessment_name = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    let assessment_description = "The description of the assessment";
    let assessment_id;

    beforeAll(function () {
        helper.logIfDebug('\nBefore all\n------------------');
        helper.loginDefaultUser1();
    });

    afterAll(function () {
        helper.logIfDebug('\nAfter all\n------------------');
        helper.logout();
    });

    beforeEach(function () {
        helper.logIfDebug('\n');
        helper.goToAssessmentPage();
    });

    it('can create an assessment', function () {
        helper.logIfDebug('\nSpecification: A MHEP user can create an assessment\n---------------------');
        assessment_id = helper.createAssessment(assessment_name, assessment_description);
        expect(browser.isExisting('td=' + assessment_name)).toBe(true);
    });

    it('can browse the new assessment', function () {
        helper.logIfDebug('\nSpecification: A MHEP user can browse the new assessment\n---------------------');
        helper.goToAssessment(assessment_id);
        expect(browser.getTitle()).toBe('Emoncms - assessment view');
        expect(browser.isVisible('#project-title=' + assessment_name)).toBe(true);
    });

    it('can share the assessment', function () {
        helper.logIfDebug('\nSpecification: A MHEP user can share an a assessment\n---------------------');
        browser.setupInterceptor(); // capture ajax calls 
        helper.shareAssessment(login_details.username2, assessment_id);
        expect(browser.getRequest(1).response.body).toBe('Assessment shared');
        browser.click('.share-project-openmodal[projectid="' + assessment_id + '"]');
        expect(browser.isVisible('td=' + login_details.username2)).toBe(true);
        browser.click('#modal-share-project .close');
    });

    it('can delete an assessment', function () {
        helper.logIfDebug('\nSpecification: A MHEP user can can delete an assessment\n---------------------');
        browser.setupInterceptor(); // capture ajax calls 
        helper.clearAjaxCallsBuffer();
        helper.deleteAssessment(assessment_id);
        expect(browser.getRequest(0).response.body[0]).toBe('Deleted');
        expect(browser.isExisting('td=' + assessment_name)).toBe(false);
    });
});

