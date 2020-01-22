import React from "react";

/**
 * Test homepage
 */
describe('App E2E', () => {

  it('whole cycle: enter Github Repo link, select all, finish', () => {
    cy.visit('/');
    //cy.contains('General Settings').click();
    // click on general settings button
    cy.get('button').eq(2).click();
    cy.get('input').type('https://github.com/sarahzu/Visual-Components-Testcase.git');
    cy.contains('Save').click();
    cy.contains('Are you sure');
    cy.contains('Yes').click();
    cy.contains('Success');
    cy.contains('Ok').click();
    cy.contains('Go to \'Set Visual Components\' page').click();
    // check all checkboxes
    cy.get('[type="checkbox"]').check();

    /**
     * click on selector, select PieChart component and click enter
     */
    cy.get('#selector-visual-components').click().find('input').focus();
    cy.focused().type('PieChart', {force:true}).click().type('{enter}');

    /**
     * select non-dynamic parameter data grid and enter parameter
     */
    //cy.get('#non-dynamic-data-grid').click(); //.find('react-grid-Cell__value'); //.find('input').focus();
    // cy.contains('aum.mfa.out.Public').click().focus();
    // cy.focused().select('aum.mfa.out.PrivateVehicles');
    //cy.get('.react-grid-Cell__value').eq(2).dblclick().type('500', {force:true}).click().type('{enter}');

    //cy.get('.react-grid-Cell__value').eq(2).dblclick().type('500', {validation: false, force: true});

    //cy.get('.react-grid-Cell__value').eq(2).find('[contenteditable]').type('some text');

    //cy.focused().type('500',  { force: true})
    //cy.get('#dynamic-data-grid').click(); //.find('react-grid-Cell__value'); //.find('input').focus();
    // cy.contains('aum.mfa.out.Public').click().focus();
    // cy.focused().select('aum.mfa.out.PrivateVehicles');
    //cy.get('.react-grid-Cell__value').eq(11).dblclick(); //.click().type('500', {force:true}).click().type('{enter}');
      //cy.get('.react-grid-Row react-grid-Row--even').click();

    cy.contains('Go to \'Arrange Visual Components\' page').click();
    cy.reload();
    //cy.get('.responsive-grid-background').find('.react-grid-layout layout');

    cy.contains('Energy')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
    .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: 1068 })
    .wait(1000)
        .trigger('mouseup');

    cy.contains('Stock Number of Vehicles')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: -500 })
        .wait(1000)
        .trigger('mouseup');

    cy.contains('Stock in Tons of Materials')
        .trigger('mousedown', { clientX: 338 , clientY: 268 })
        .wait(1000)
        .trigger('mousemove', { clientX: 338 , clientY: -500 })
        .wait(1000)
        .trigger('mouseup');

        //.trigger('mouseleave', { clientX: 339 , clientY: 258 })
        //.trigger('mouseover', { clientX: 318, clientY: 262});
    //cy.get('.react-grid-item components react-draggable cssTransforms react-resizable').eq(0);

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





