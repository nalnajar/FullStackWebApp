describe("vendor add test", () => {
  it("visits the root", () => {
    cy.visit("/");
  });
  it("clicks the menu button vendors option", () => {
    cy.get("mat-icon").click();
    cy.contains("a", "vendors").click();
  });
  it("clicks add icon", () => {
    cy.contains("control_point").click();
  });
  it("fills in fields", () => {
    cy.get("input[formcontrolname=name").type("John Doe");
    cy.get("input[formcontrolname=address1").type("somewhere");
    cy.get("input[formcontrolname=city").type("Yelloknife");
    cy.get("input[formcontrolname=postalcode").type("XXX-XXX");
    cy.get("input[formcontrolname=phone").type("99999999");
    cy.get("input[formcontrolname=email").type("someemail@someaddress.com");
    
    cy.get('mat-select[formcontrolname="province"]').click();
    cy.get('mat-option').contains('Ontario').click();

    cy.get('mat-select[formcontrolname="type"]').click();
    cy.get('mat-option').contains('Untrusted').click();
  });
  it("clicks the save button", () => {
    cy.get("button").contains("Save").click();
    cy.wait(500);
  });
  it("confirms add", () => {
    cy.contains("added!");
  });
});
