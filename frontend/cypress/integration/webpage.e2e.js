import React from "react";

/**
 * Test homepage
 */
describe('App E2E', () => {

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





