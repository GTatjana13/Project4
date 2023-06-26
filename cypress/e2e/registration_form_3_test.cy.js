beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

//BONUS TASK: add visual tests for registration form 3
describe('Section 1: visual tests for registration form 3', () => {
    
it('Check that cerebrum_hub_logo is correct and has correct size', () => {
    cy.log('Will check cerebrum_hub_logo source and size')
    cy.get('[src="cerebrum_hub_logo.png"]').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
    // get element and check its parameter height, to be equal 178
    cy.get('[src="cerebrum_hub_logo.png"]').invoke('height').should('be.lessThan', 178)
        .and('be.greaterThan', 150)
})


it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never').and('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    
    })


    it('country dropdown is correct', () => {

        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('not.have.text') //first row is empty
        cy.get('#country').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['','object:3', 'object:4', 'object:5'])
        })
    })

    it('the list of cities is not displayed before selecting a country', () => {
        cy.get('#country').eq('') //country is not selected 
        cy.get('#city').should('be.disabled')
        
    })

    it('Spain contains list of cities', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['','string:Malaga', 'string:Madrid', 'string:Valencia','string:Corralejo'])
        })
    })

        it('Estonia contains list of cities', () => {
            cy.get('#country').select('Estonia')
            cy.get('#city').find('option').then(options => {
                const actual = [...options].map(option => option.value)
                expect(actual).to.deep.eq(['','string:Tallinn', 'string:Haapsalu', 'string:Tartu'])
            })
        })

            it('Austria contains list of cities', () => {
                cy.get('#country').select('Austria')
                cy.get('#city').find('option').then(options => {
                    const actual = [...options].map(option => option.value)
                    expect(actual).to.deep.eq(['', 'string:Vienna', 'string:Salzburg', 'string:Innsbruck'])
                })
            })

            it('Check that checkbox button list is correct', () => {
                // Array of found elements with given selector has 3 elements in total
                cy.get('input[type="checkbox"][ng-model="checkbox"]').should('have.class', 'ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required').check()
               // cy.get('input[type="checkbox"][ng-model="checkbox"]').check()
                cy.get('input[type="checkbox"]').check()
                cy.get('button').should('have.text', 'Accept our cookie policy')
                cy.get('button a').should('be.visible').click()
                cy.url().should('contain','/cookiePolicy.html')


            
            })
            it('Check visibility of error messages of the email', () => {
            
                cy.get('input[name="email"]').type('www');
                cy.get('#emailAlert').should('contain', 'Invalid email address')

                cy.get('input[name="email"]').clear();
                cy.get('#emailAlert').should('contain', 'Email is required.')

            })

            });
                
            
    //BONUS TASK: add functional tests for registration form 3


describe('Section 2: functional tests for registration form 3', () => {

    it('all fields are filled in + validation', () => {
        cy.get('#name').clear().type('Tatjana')
        cy.get('[name="email"]').type('rrr@ErrorEvent.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Valencia')
        cy.contains('Date of birth').next().type('1999-01-22')
        cy.get('[Value="Daily"]').check()
        cy.get('#birthday').type('1999-01-22')
        cy.get('[ng-model="checkbox"]').check()
        cy.get('[type="checkbox"]').last().check()
        cy.get('[type="submit"]').should('be.enabled')
        cy.get('[type="submit"]').last().click()
        cy.contains('Submission received').should('be.visible')
    })

    it('only mandatory fields are filled in + validations', () => {
        cy.get('#name').clear().type('Tatjana')           //bug is found - field is not mandatory
        cy.get('[name="email"]').type('rrr@ErrorEvent.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Valencia')
        cy.get('#birthday').type('1999-01-22')            //bug is found - field is not mandatory
        cy.get('[ng-model="checkbox"]').check()
        cy.get('[type="checkbox"]').last().check()        //bug is found - field is not mandatory
        cy.get('[type="submit"]').should('be.enabled')
        cy.get('[type="submit"]').last().click()
        cy.contains('Submission received').should('be.visible')
    })

    it('mandatory fields are absent + validations', () => {
        cy.get('#name').clear().type('Tatjana')
        cy.get('[name="email"]').type('rrr@ErrorEvent.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Valencia')
        cy.get('#birthday').type('1999-01-22')
        //cy.get('[ng-model="checkbox"]').check()         mandatory checkbox is not selected
        cy.get('[type="checkbox"]').last().check()
        cy.get('[type="submit"]').should('be.disabled')
        //cy.get('[type="submit"]').last().click()        submit button is unclickable
    })

    it('If city is already chosen and country is updated, then city choice should be removed', () => {
        cy.get('#name').clear().type('Tatjana')
        cy.get('[name="email"]').type('rrr@ErrorEvent.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Valencia')
        cy.get('#country').select('Estonia')    //country is updated
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['','Tallinn', 'Haapsalu', 'Tartu'])})
        cy.get('[ng-model="checkbox"]').check()
        cy.get('[type="checkbox"]').last().check()
        cy.get('[type="submit"]').should('be.disabled')
        
    })
    
    it('add file', () => {
        cy.get('input[type=file]').selectFile('cypress/e2e/form_1_test_exercise.cy.js')
        cy.get('[type="submit"]').first().click()
        cy.contains('Submission received').should('be.visible')
    })
    
});