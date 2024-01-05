describe('product update test', () => {
  it('visits the root, updates product, and confirms update', () => {
    cy.visit('/');
    cy.get('mat-icon').click();
    cy.contains('a', 'products').click();
    cy.contains('Vendor').click();
    cy.get('[aria-label="Next page"]').click();
    cy.contains('Experiment').click();
    cy.get('input[formcontrolname=msrp').clear().type('250.38');
    cy.get('button').contains('Save').click();
    cy.wait(500);
    cy.contains('updated!');
  });
});
