import React from "react";

/**
 * Test arrange components page
 */
describe('App E2E arrange components page', () => {
    it('should have a header', () => {
        cy.visit('/arrange');
        // check header
        cy.get('h1')
            .should('have.text', 'Arrange Components');
    });
});