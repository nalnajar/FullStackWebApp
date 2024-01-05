describe('product delete test', () => {
  it('visits the root, selects product, deletes it, and confirms deletion', () => {
    cy.visit('/');
    cy.get('mat-icon').click();
    cy.contains('a', 'products').click();
    cy.contains('Vendor').click();
    cy.get('[aria-label="Next page"]').click();
    cy.contains('Experiment').click();
    cy.get('button').contains('Delete').click();
    cy.get('button').contains('Yes').click();
    cy.contains('deleted!');
  });
});
