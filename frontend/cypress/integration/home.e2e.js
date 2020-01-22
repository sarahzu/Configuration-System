import React from "react";

/**
 * Test homepage
 */
describe('App E2E homepage', () => {
    it('should have a header', () => {
        // visit base url
        cy.visit('/');
        // check header
        cy.get('h1')
            .should('have.text', 'Welcome to the Configuration System of the Post fossil cities project!');
        cy.get('h4')
            .should('have.text', 'This website enables you to make configuration to the visual components which are shown during the game session. Please follow the following guideline while configuring.');
    });

    it('should direct to right page after General Settings button was clicked', () => {
        cy.visit('/');
        cy.get('button').eq(2).click();
        //cy.contains('General Settings').click();
        // if pull button is on page, then the general settings page was successfully loaded
        cy.contains('pull');
    });

    it('should direct to right page after Set Components button was clicked', () => {
        cy.visit('/');
        cy.get('button').eq(3).click();
        //cy.contains('Set Visual Components').click();
        // if 'go to arrange components page' button was found, then the set components page was successfully loaded
        cy.contains('Go to \'Arrange Visual Components\' page')
    });

    it('should direct to right page after Arrange Components button was clicked', () => {
        cy.visit('/');
        cy.get('button').eq(4).click();
        //cy.contains('Arrange Visual Components').click();
        // if 'Finish' button was found, then the arrange components page was successfully loaded
        cy.contains('Finish')
    });

    it('open burger menu and click on each link', () => {
        cy.visit('/');

        // general settings link
        cy.get('.bm-burger-button').click();
        cy.get('#settings').click("center");
        cy.get('.bm-overlay').click("center");
        cy.contains('pull');

        // arrange components link
        cy.get('.bm-burger-button').click();
        cy.get('#arrange').click("center");
        cy.get('.bm-overlay').click("center");
        cy.contains('Finish');

        // home link
        cy.get('.bm-burger-button').click();
        cy.get('#home').click("left");
        cy.get('.bm-overlay').click("center");
        cy.contains('Welcome to the Configuration System of the Post fossil cities project!');

        // set components link
        cy.get('.bm-burger-button').click();
        cy.get('#set').click("center");
        cy.get('.bm-overlay').click("center");
        cy.reload();
        cy.contains('Go to \'Arrange Visual Components\' page');

    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

});