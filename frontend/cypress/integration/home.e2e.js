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
        cy.contains('General Settings').click();
        // if pull button is on page, then the general settings page was successfully loaded
        cy.contains('pull');
    });

    it('should direct to right page after Set Components button was clicked', () => {
        cy.visit('/');
        cy.contains('Set Visual Components').click();
        // if 'go to arrange components page' button was found, then the set components page was successfully loaded
        cy.contains('Go to \'Arrange Components\' page')
    });

    it('should direct to right page after Arrange Components button was clicked', () => {
        cy.visit('/');
        cy.contains('Arrange Visual Components').click();
        // if 'Finish' button was found, then the arrange components page was successfully loaded
        cy.contains('Finish')
    });
});