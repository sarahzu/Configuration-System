import React from "react";

/**
 * Test set components page
 */
describe('App E2E set components page', () => {
    it('should have a header', () => {
        cy.visit('/set');
        // check header
        cy.get('h1')
            .should('have.text', 'Set Visual Components');
    });
});