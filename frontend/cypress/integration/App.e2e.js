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
    cy.contains('pull');
  });

  it('should direct to right page after Set Components button was clicked', () => {
    cy.visit('/');
    cy.contains('Set Visual Components').click();
    cy.contains('Go to \'Arrange Components\' page')
  });

  it('should direct to right page after Arrange Components button was clicked', () => {
    cy.visit('/');
    cy.contains('Arrange Visual Components').click();
    cy.contains('Finish')
  });

  it('whole cycle: enter Github Repo link, select all, finish', () => {
    cy.visit('/');
    cy.contains('General Settings').click();
    cy.get('input').type('https://github.com/sarahzu/Visual-Components-Testcase.git');
    cy.contains('Save').click();
    cy.contains('Are you sure');
    cy.contains('Yes').click();
    cy.contains('Ok').click();
    cy.contains('Go to \'Set Components\' page').click();
    // check all checkboxes
    cy.get('[type="checkbox"]').check();
    cy.contains('Go to \'Arrange Components\' page').click();
    cy.reload();
    cy.contains('Finish').click();
    cy.contains('Success');
    cy.contains('Ok').click();

  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
});

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

/**
 * Test set components page
 */
describe('App E2E set components page', () => {
  it('should have a header', () => {
    cy.visit('/set');
    // check header
    cy.get('h1')
      .should('have.text', 'Set Components');
  });
});

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




