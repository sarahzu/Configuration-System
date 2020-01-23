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
    //cy.visit('/arrange');

    cy.get('h1').should('have.text', 'Arrange Visual Components');
    // open and close info box
    cy.get('button').eq(2).click();
    cy.contains('Info Box');
    cy.contains('Ok').click();

    function resizeComponents(classname, number,  x, y) {
      cy.get('.' + classname).find('span').eq(number).wait(1000)
          .trigger('mousedown', { clientX: 0 , clientY: 0 })
          .wait(1000)
          .trigger('mousemove', { clientX: x , clientY: y })
          .wait(1000)
          .trigger('mouseup', {force: true}).wait(1000);
    }

    // resize components
    resizeComponents('responsive-grid-background', 71, -338, -50);
    resizeComponents('responsive-grid-background', 35, -338, -50);
    resizeComponents('responsive-grid-background', 107, -338, -50);

    function dragAndDropComponents(compName, prevX, prevY ,x, y) {
      cy.contains(compName)
          .trigger('mousedown', { clientX: prevX , clientY: prevY })
          .wait(1000)
          .trigger('mousemove', { clientX: x , clientY: y })
          .wait(1000)
          .trigger('mouseup', {force: true}).wait(1000);
    }

    // move components
    dragAndDropComponents('Energy', 338, 338, 338, 1068);
    dragAndDropComponents('Stock Number of Vehicles', 338, 268, 338, -500);
    dragAndDropComponents('Stock in Tons of Materials', 338, 268, 338, -500);

    // check if parameter change from previous page (set visual components page) was registered
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

    /**
     * Finish configuration and check local storage to make sure that all data was stored correctly
     */
    // finish procedure
    cy.contains('Finish').click();
    cy.contains('Success');

    /**
     * ATTENTION:
     * Apparently there is a bug in the react-grid-layout which prevents the dragging and dropping
     * to not function well in Google Chrome browsers. This results in a localStorage update problem where the
     * localStorage is not updated when dragging and dropping as well as resizing the visual components.
     * Therefore, I cannot test this process here, because cypress uses Google Chrome to run its applications.
     * Thus, I only check if the parameter settings where successfully updated in the localStorage
     * but not the location and size of the visual components.
     */
    cy.contains('Ok').click().should(() => {
      expect(localStorage.getItem('fullComponentsInfo'))
          .to.eq('{"configuration":' +
          '{"1":' +
          '{"components":[' +
          '' +
          '{"name":"PieChart","parameter":[{"parameter":"breakpoint","type":"integer","value":"500"},{"parameter":"chartWidth","type":"integer","value":"200"},{"parameter":"legendPosition","type":"string","value":"bottom"},{"parameter":"modelA","type":"dynamic","value":"aum.mfa.in.PublicVehicles"},{"parameter":"modelB","type":"dynamic","value":"aum.mfa.out.PrivateVehicles"},{"parameter":"modelC","type":"dynamic","value":"aum.mfa.out.OtherBuildings"},{"parameter":"modelD","type":"dynamic","value":"aum.mfa.out.ResidentialBuildings"},{"parameter":"modelE","type":"dynamic","value":"aum.mfa.out.Industry"},{"parameter":"valueA--modelA--value.10.value","type":"dependent","value":"1"},{"parameter":"valueB--modelB--value.10.value","type":"dependent","value":4000},{"parameter":"valueC--modelC--value.10.value","type":"dependent","value":300},{"parameter":"valueD--modelD--value.10.value","type":"dependent","value":5000},{"parameter":"valueE--modelE--value.10.value","type":"dependent","value":3300},{"parameter":"click--changePublicVehicles--value.1.value","type":"dependent","value":"1"},{"parameter":"changePublicVehicles","type":"callback","value":"changeAverageVehicleLifetime"}],' +
          '"position":{"width":6,"height":12,"x":0,"y":0},"enabled":true,"toolbox":false},' +

          '{"name":"DonutChart2","parameter":[{"parameter":"title","type":"string","value":"Stock in Tons of Materials"},{"parameter":"firstFillStyle","type":"string","value":"verticalLines"},{"parameter":"secondFillStyle","type":"string","value":"squares"},{"parameter":"thirdFillStyle","type":"string","value":"horizontalLines"},{"parameter":"fourthFillStyle","type":"string","value":"circles"},{"parameter":"fiftFillStyle","type":"string","value":"slantedLines"},{"parameter":"modelA","type":"dynamic","value":"aum.mfa.out.PublicVehicles"},{"parameter":"modelB","type":"dynamic","value":"aum.mfa.out.PrivateVehicles"},{"parameter":"modelC","type":"dynamic","value":"aum.mfa.out.OtherBuildings"},{"parameter":"modelD","type":"dynamic","value":"aum.mfa.out.ResidentialBuildings"},{"parameter":"modelE","type":"dynamic","value":"aum.mfa.out.Industry"},{"parameter":"valueA--modelA--value.1.value","type":"dependent","value":"24"},{"parameter":"valueB--modelB--value.1.value","type":"dependent","value":"75"},{"parameter":"valueC--modelC--value.1.value","type":"dependent","value":"95"},{"parameter":"valueD--modelD--value.1.value","type":"dependent","value":"43"},{"parameter":"valueE--modelE--value.1.value","type":"dependent","value":"42"}],' +
          '"position":{"width":6,"height":12,"x":0,"y":12},"enabled":true,"toolbox":false},' +

          '{"name":"DonutChart","parameter":[{"parameter":"modelA","type":"dynamic","value":"aum.mfa.out.PublicVehicles"},{"parameter":"modelB","type":"dynamic","value":"aum.mfa.out.PrivateVehicles"},{"parameter":"modelC","type":"dynamic","value":"aum.mfa.out.OtherBuildings"},{"parameter":"modelD","type":"dynamic","value":"aum.mfa.out.ResidentialBuildings"},{"parameter":"modelE","type":"dynamic","value":"aum.mfa.out.Industry"},{"parameter":"valueA--modelA--value.3.value","type":"dependent","value":"440"},{"parameter":"valueB--modelB--value.3.value","type":"dependent","value":"554"},{"parameter":"valueC--modelC--value.3.value","type":"dependent","value":"552"},{"parameter":"valueD--modelD--value.3.value","type":"dependent","value":"433"},{"parameter":"valueE--modelE--value.3.value","type":"dependent","value":"224"}],' +
          '"position":{"width":6,"height":12,"x":0,"y":24},"enabled":true,"toolbox":false}],' +

          '"decisionCards":[{"name":"Decision Card 1","parameter":[{"parameter":"name","type":"string","value":"First Selected Decision Card"},{"parameter":"value","type":"integer","value":"2"},{"parameter":"functionality","type":"callback","value":"changeAverageVehicleLifetime"}],"enabled":true},{"name":"Decision Card 2","parameter":[{"parameter":"name","type":"string","value":"dc 2"},{"parameter":"value","type":"integer","value":"4"}],"enabled":true},{"name":"Decision Card 3","parameter":[{"parameter":"name","type":"string","value":"dc 3"},{"parameter":"value","type":"integer","value":"8"}],"enabled":true}],"githubRepository":"https://github.com/sarahzu/Visual-Components-Testcase.git"}}}')
    });

  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
  });
});





