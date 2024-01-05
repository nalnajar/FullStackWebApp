describe('product generator test', () => {
  it('visits the root', () => {
    cy.visit('/');
  });
  it('clicks the menu button products option', () => {
    cy.get('mat-icon').click();
    cy.contains('a', 'generator').click();
  });
  it('selects a vendor', () => {
    cy.wait(500);
    cy.get('mat-select[formcontrolname="vendorid"]').click();
    cy.contains('Noor Alnajar').click();
  });
  it('selects a product', () => {
    cy.wait(500);
    cy.get('mat-select[formcontrolname="productid"]').click();
    cy.contains('Desk').click();
  });
  it('selects qty of EOQ', () => {
    cy.wait(500);
    cy.get('mat-select[formcontrolname="qty"]').click();
    cy.contains('3').click();
    cy.wait(500);
    cy.get('mat-select[formcontrolname="qty"]').click();
    cy.contains('EOQ').click();
  });
  it('clicks the save button', () => {
    cy.get('button').contains('Save PO').click();
  });
  it('confirms purchase order added', () => {
    cy.contains('added!');
  });
});
