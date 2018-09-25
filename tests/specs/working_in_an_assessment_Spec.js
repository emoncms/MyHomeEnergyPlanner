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
let helper = require('./Lib/assessment_tests_helper.js');

describe('In an assessment a MHEP ', function () {

    let assessment_name = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    let assessment_description = "The description of the assessment";
    let assessment_id;

    beforeAll(function () {
        helper.logIfDebug('\nBefore all\n------------------');
        helper.loginDefaultUser1();
        helper.goToAssessmentPage();
        assessment_id = helper.createAssessment(assessment_name);
        helper.goToAssessment(assessment_id);
    });
    afterAll(function () {
        helper.logIfDebug('\nAfter all\n------------------');
        helper.goToAssessmentPage();
        helper.deleteAssessment(assessment_id);
        helper.logout();
    });
});