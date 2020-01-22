import React from "react";

/**
 * Test homepage
 */
describe('App E2E', () => {

  it('whole cycle: enter Github Repo link, select all, finish', () => {
    cy.visit('/');
    /**
     * Go to general settings page and enter github repository link
     */
    cy.get('button').eq(2).click();
    cy.get('h1').should('have.text', 'Settings');
    cy.get('input').clear();
    cy.get('input').type('https://github.com/sarahzu/Visual-Components-Testcase.git')
        .should('have.value', 'https://github.com/sarahzu/Visual-Components-Testcase.git');
    cy.contains('Save').click();
    cy.contains('Are you sure');
    cy.contains('Yes').click();
    cy.contains('Success');
    cy.contains('Ok').click();

    /**
     * Go to select visual components page, select visual components as well as decision cards
     * and change parameter values
     */
    cy.contains('Go to \'Set Visual Components\' page').click();
    cy.get('h1').should('have.text', 'Set Visual Components');
    // check all checkboxes
    cy.get('[type="checkbox"]').check();

    // click on selector, select PieChart component and click enter
    cy.get('#selector-visual-components').click().find('input').focus();
    cy.focused().type('PieChart', {force:true}).click().type('{enter}');

    // select non-dynamic parameter data grid and enter parameter
    cy.get('.form').find('.react-grid-Cell__value').eq(2).type('500');
    cy.get('.form').type('{enter}');
    cy.get('.form').find('.react-grid-Cell__value').eq(2).should('have.text', '500');

    // select dynamic parameter data grid and enter parameter
    cy.get('.form').find('.react-grid-Cell__value').eq(11).type('aum.mfa.in.PublicVehicles');
    cy.get('.form').type('{enter}');

    /**
     * Go to arrange visual components page and re-arrange components
     */
    cy.contains('Go to \'Arrange Visual Components\' page').click();
    cy.reload();
    cy.get('h1').should('have.text', 'Arrange Visual Components');
    //cy.get('.responsive-grid-background').find('.react-grid-layout layout');

    // move PieChart
    cy.contains('Energy')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
    .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: 1068 })
    .wait(1000)
        .trigger('mouseup');

    // move DonutChart2
    cy.contains('Stock Number of Vehicles')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: -500 })
        .wait(1000)
        .trigger('mouseup');

    // move DonutChart
    cy.contains('Stock in Tons of Materials')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: -500 })
        .wait(1000)
        .trigger('mouseup');


    // check if parameter change was registered
    cy.contains('aum.mfa.in.PublicVehicles');

    // finish procedure
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





