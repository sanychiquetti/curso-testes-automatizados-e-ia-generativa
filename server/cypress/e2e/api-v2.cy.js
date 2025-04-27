describe('API Tests for /customers Endpoint', () => {
   const apiUrl = Cypress.env('API_URL')
 
   it('returns a list of large enterprise customers from the logistics industry on page 1 with a limit of 5', () => {
     cy.request('GET', `${apiUrl}/customers?page=1&limit=5&size=Large Enterprise&industry=Logistics`).then(({ status, body }) => {
       expect(status).to.eq(200)
       const { customers, pageInfo } = body
       expect(customers).to.be.an('array').and.have.length.within(0, 5)
       expect(pageInfo.currentPage).to.eq(1)
       customers.forEach(({ size, industry }) => {
         expect(size).to.eq('Large Enterprise')
         expect(industry).to.eq('Logistics')
       })
     })
   })
 
   it('returns a response with default values when no query parameters are provided', () => {
     cy.request('GET', `${apiUrl}/customers`).then(({ status, body }) => {
       expect(status).to.eq(200)
       const { customers, pageInfo } = body
       expect(customers).to.be.an('array')
       expect(pageInfo.currentPage).to.eq(1)
     })
   })
 
   it('returns a 400 status for an invalid page parameter', () => {
     cy.request({
       method: 'GET',
       url: `${apiUrl}/customers?page=-1`,
       failOnStatusCode: false
     }).then(({ status }) => {
       expect(status).to.eq(400)
     })
   })
 
   it('returns a 400 status for an invalid limit parameter', () => {
     cy.request({
       method: 'GET',
       url: `${apiUrl}/customers?limit=abc`,
       failOnStatusCode: false
     }).then(({ status }) => {
       expect(status).to.eq(400)
     })
   })
 
   it('returns a 400 status for an unsupported size parameter', () => {
     cy.request({
       method: 'GET',
       url: `${apiUrl}/customers?size=Unknown`,
       failOnStatusCode: false
     }).then(({ status }) => {
       expect(status).to.eq(400)
     })
   })
 
   it('returns a 400 status for an unsupported industry parameter', () => {
     cy.request({
       method: 'GET',
       url: `${apiUrl}/customers?industry=Unknown`,
       failOnStatusCode: false
     }).then(({ status }) => {
       expect(status).to.eq(400)
     })
   })
 })