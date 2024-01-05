describe('product add test', () => {
  it('visits the root and performs product addition', () => {
    cy.visit('/');
    cy.get('mat-icon').click();
    cy.contains('a', 'products').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname=id]').type('12Z34');
    cy.get('mat-select[formcontrolname="vendorid"]').click();
    cy.get('mat-option').should('have.length.gt', 0);
    cy.contains('Shady Sams').click();
    cy.get('input[formcontrolname=name]').type('Experiment');
    cy.get('input[formcontrolname=msrp]').clear().type('129.99');
    cy.get('input[formcontrolname=costprice]').clear().type('100.00').click();
    cy.contains('Inventory Information').click();
    cy.get('input[formcontrolname=rop]').clear().type('10').click();
    cy.get('input[formcontrolname=eoq]').clear().type('7').click();
    cy.get('input[formcontrolname=qoh]').clear().type('3').click();
    cy.get('input[formcontrolname=qoo]').clear().type('5').click();
    cy.get('button').contains('Save').click();
    cy.contains('added!');
  });
});
