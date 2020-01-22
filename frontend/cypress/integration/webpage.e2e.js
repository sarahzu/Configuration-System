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
    // open and close info box
    cy.get('button').eq(4).click();
    cy.contains('Info Box');
    cy.contains('Ok').click();
    // enter Github Repo link
    cy.get('input').clear();
    cy.get('input').type('https://github.com/sarahzu/Visual-Components-Testcase.git')
        .should('have.value', 'https://github.com/sarahzu/Visual-Components-Testcase.git');
    // save settings
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
    // open and close info box
    cy.get('button').eq(2).click();
    cy.contains('Info Box');
    cy.contains('Ok').click();
    // check all checkboxes
    cy.get('[type="checkbox"]').check();

    /**
     * modify visual components
     */
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

    // select callback parameter data grid and enter parameter
    cy.get('.form').find('.react-grid-Cell__value').eq(26).type('changeAverageVehicleLifetime');
    cy.get('.form').type('{enter}');

    /**
     * modify decision cards
     */
    // click on selector, select PieChart component and click enter
    cy.get('#selector-decision-cards').click().find('input').focus();
    cy.focused().type('Decision Card 1', {force:true}).click().type('{enter}');

    // select non-dynamic parameter data grid and enter parameter
    cy.get('.form').find('.react-grid-Cell__value').eq(29).type('First Selected Decision Card');
    cy.get('.form').type('{enter}');
    cy.get('.form').find('.react-grid-Cell__value').eq(29).should('have.text', 'First Selected Decision Card');

    // select callback parameter data grid and enter parameter
    cy.get('.form').find('.react-grid-Cell__value').eq(35).type('changeAverageVehicleLifetime');
    cy.get('.form').type('{enter}');

    cy.scrollTo('top');

    /**
     * Go to arrange visual components page and re-arrange components
     */
    cy.contains('Go to \'Arrange Visual Components\' page').click().click();
    cy.reload();
    cy.get('h1').should('have.text', 'Arrange Visual Components');
    // open and close info box
    cy.get('button').eq(2).click();
    cy.contains('Info Box');
    cy.contains('Ok').click();

    // resize DonutChart2
    cy.get('.responsive-grid-background').find('span').eq(71)
        .trigger('mousedown', { clientX: 0 , clientY: 0 })
        .wait(1000)
        .trigger('mousemove', { clientX: -338 , clientY: -50 })
        .wait(1000)
        .trigger('mouseup', {force: true}).wait(1000);
    // resize PieChart
    cy.get('.responsive-grid-background').find('span').eq(35)
        .trigger('mousedown', { clientX: 0 , clientY: 0 })
        .wait(1000)
        .trigger('mousemove', { clientX: -338 , clientY: -50 })
        .wait(1000)
        .trigger('mouseup', {force: true}).wait(1000);
    // resize DonutChart
    cy.get('.responsive-grid-background').find('span').eq(107)
        .trigger('mousedown', { clientX: 0 , clientY: 0 })
        .wait(1000)
        .trigger('mousemove', { clientX: -338 , clientY: -50 })
        .wait(1000)
        .trigger('mouseup', {force: true}).wait(1000);

    // move PieChart
    cy.contains('Energy')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
    .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: 1068 })
    .wait(1000)
        .trigger('mouseup', {force: true}).wait(1000);
    // move DonutChart2
    cy.contains('Stock Number of Vehicles')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: -500 })
        .wait(1000)
        .trigger('mouseup', {force: true}).wait(1000);
    // move DonutChart
    cy.contains('Stock in Tons of Materials')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: -500 })
        .wait(1000)
        .trigger('mouseup', {force: true}).wait(1000);

    // check if parameter change was registered
    // dynamic parameter
    cy.contains('aum.mfa.in.PublicVehicles');
    // callback parameter
    cy.contains('Change Average Lifetime Input Value');

    // open preview, check if all visual components are there and close preview
    cy.get('button').eq(4).click();
    cy.contains('Energy');
    cy.contains('Stock Number of Vehicles');
    cy.contains('Stock in Tons of Materials');
    cy.get('button').eq(2).click();

    // move DonutChart visual component to toolbox, check if it is there and move it back
    cy.get('.hide-button').eq(2).click();
    cy.get('.toolbox__items__item').eq(0).should('have.text','DonutChart');
    cy.get('.toolbox__items__item').eq(0).click();
    // resize component from toolbox
    cy.get('.responsive-grid-background').find('span').eq(107)
        .trigger('mousedown', { clientX: 0 , clientY: 0 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: 250 })
        .wait(1000)
        .trigger('mouseup', {force: true});
    // check if still all visual components are on screen
    cy.contains('Energy');
    cy.contains('Stock Number of Vehicles');
    cy.contains('Stock in Tons of Materials');

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





