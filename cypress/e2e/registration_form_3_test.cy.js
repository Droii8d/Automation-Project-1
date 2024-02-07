beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

//Visual tests
it('Check that radio button list is correct', () => {
    cy.get('input[type="radio"]').should('have.length', 4)

    cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
    cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
    cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
    cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')
    cy.get(':radio').should('not.be.checked')

    cy.get('input[type="radio"]').eq(0).check().should('be.checked')
    cy.get('input[type="radio"]').eq(1).check().should('be.checked')
    cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    cy.get('input[type="radio"]').eq(2).check().should('be.checked')
    cy.get('input[type="radio"]').eq(3).should('not.be.checked')
    cy.get('input[type="radio"]').eq(2).check().should('be.checked')
})

it('Check that country dropdown is correct', () => {
    cy.get('#country').children().should('have.length', 4)
    cy.get('#country').find('option').eq(0).should('have.text', '')
    cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
    cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
    cy.get('#country').find('option').eq(3).should('have.text', 'Austria')
    cy.get('#country').should('not.be.selected')
})

it('Selecting country changes the list of cities, the list is correct and country/city dependencies are correct', () => {
    cy.get('#country').select('Spain')
    cy.get('#city').children().should('have.length', 5)
    cy.get('#city').find('option').eq(0).should('have.text', '')
    cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
    cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
    cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
    cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo')
    cy.get('#city').select('Madrid')

    cy.get('#country').select('Estonia')
    cy.get('#city').should('not.contain', 'Madrid')
    cy.get('#city').children().should('have.length', 4)
    cy.get('#city').find('option').eq(0).should('have.text', '')
    cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
    cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu')
    cy.get('#city').find('option').eq(3).should('have.text', 'Tartu')
    cy.get('#city').select('Tartu')
    
    cy.get('#country').select('Austria')
    cy.get('#city').should('not.contain', 'Tartu')
    cy.get('#city').children().should('have.length', 4)
    cy.get('#city').find('option').eq(0).should('have.text', '')
    cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
    cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
    cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')
    cy.get('#city').select('Vienna')

    cy.get('#country').select('')
    cy.get('#city').should('not.contain', 'Vienna')

})

it('Check that check box list is correct and check boxes can be checked and unchecked', () => {
    cy.get('input[type="checkbox"]').should('have.length', 2)
    cy.get(':checkbox').should('not.be.checked')
    cy.get(':checkbox').check().should('be.checked')
    cy.get(':checkbox').uncheck().should('not.be.checked')
  
})

it('Check that cookie policy link is working', () => {
    cy.get('button').find("a").should("have.attr", "href", "cookiePolicy.html").should("have.text", "Accept our cookie policy").click()
    cy.url().should('contain', '/cookiePolicy.html')
    cy.go('back')
})

it('Email format validation', () => {
    cy.get('input[name="email"]').type('invalid')
    cy.get('#emailAlert').should('be.visible').and('contain.text', 'Invalid email address.')
    cy.get('input[name="email"]').scrollIntoView()
    cy.get('input[name="email').clear()
    cy.get('input[name="email').type('correct@email.com')
    cy.get('#emailAlert').should('not.be.visible')

})

//Functional tests
it('User can submit form with all fields added', () => {
    cy.get('#name').type('Lucius Annaeus Seneca')
    cy.get('input[name="email"]').type('seneca@corduba.es')
    cy.get('#country').select('Spain')
    cy.get('#city').select('Madrid')
    cy.contains('label', 'Date of registration').next().type('2024-02-07')
    cy.get('input[type="radio"]').check('Daily')
    cy.get('#birthday').type('1900-01-01')
    cy.get(':checkbox').check().should('be.checked')
    cy.get('input[type=file]').selectFile('testfile.txt')
    cy.get('input[type="submit"]').should('not.be.disabled').click()
    cy.get('h1').should('be.visible').and('contain.text', 'Submission received')
})

it('User can submit form with only mandatory fields filled/checked', () => {
    inputMandatoryData('Seneca')
    cy.get('input[type="submit"]').should('not.be.disabled').click()
    cy.get('h1').should('be.visible').and('contain.text', 'Submission received')
})

it('User can`t submit form without providing email address', () => {
    inputMandatoryData('Seneca')
    cy.get('input[name="email"]').scrollIntoView()
    cy.get('input[name="email"]').clear()
    cy.get('#emailAlert').should('be.visible').and('contain.text', 'Email is required.')
    cy.get('input[type="submit"]').should('be.disabled')
})

it('User can`t submit form without accepting privacy and cookie policy', () => {
    inputMandatoryData('Seneca')
    cy.get(':checkbox').uncheck().should('not.be.checked')
    cy.get('input[type="submit"]').should('be.disabled')
})

it('User can`t submit form without selecting country', () => {
    inputMandatoryData('Seneca')
    cy.get('#country').select('')
    cy.get('input[type="submit"]').should('be.disabled')

})

it('User can upload and submit file', () => {
    cy.get('input[type=file]').selectFile('testfile.txt')
    cy.get('input[type=file]').siblings().should("have.text", "Submit file").click()
    cy.get('h1').should('be.visible').and('contain.text', 'Submission received')

})

function inputMandatoryData(name) {
    cy.log('Name will be filled')
    cy.get('#name').type(name)
    cy.get('input[name="email"]').type('seneca@corduba.es')
    cy.get('#country').select('Spain')
    cy.get('#city').select('Madrid')
    cy.get(':checkbox').check().should('be.checked')
}