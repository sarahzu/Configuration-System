import React from "react";

/**
 * Test general settings page
 */
describe('App E2E general settings page', () => {
    it('should have a header', () => {
        cy.visit('/settings');
        // check header
        cy.get('h1')
            .should('have.text', 'Settings');
    });
});