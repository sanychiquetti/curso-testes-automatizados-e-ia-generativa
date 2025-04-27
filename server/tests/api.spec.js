import { test, expect } from '@playwright/test'

const baseUrl = process.env.API_URL || 'http://localhost:3001'

test.describe('API Tests for /customers Endpoint', () => {
  test.describe('Successful requests', () => {
    test('retrieves customers with default query parameters', async ({ request }) => {
      // Arrange
      const endpoint = `${baseUrl}/customers`
      const expectedKeys = ['customers', 'pageInfo']

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      expect(Object.keys(body)).toEqual(expect.arrayContaining(expectedKeys))
      expect(Array.isArray(body.customers)).toBeTruthy()
      expect(body.pageInfo).toHaveProperty('currentPage')
      expect(body.pageInfo).toHaveProperty('totalPages')
      expect(body.pageInfo).toHaveProperty('totalCustomers')
    })

    test('retrieves customers filtered by size', async ({ request }) => {
      // Arrange
      const size = 'Medium'
      const endpoint = `${baseUrl}/customers?size=${size}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      expect(Array.isArray(body.customers)).toBeTruthy()
      body.customers.forEach(customer => {
        expect(customer.size).toBe(size)
        expect(customer.employees).toBeGreaterThanOrEqual(100)
        expect(customer.employees).toBeLessThan(1000)
      })
    })

    test('retrieves customers filtered by industry', async ({ request }) => {
      // Arrange
      const industry = 'Technology'
      const endpoint = `${baseUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      expect(Array.isArray(body.customers)).toBeTruthy()
      body.customers.forEach(customer => {
        expect(customer.industry).toBe(industry)
      })
    })

    test('retrieves customers with pagination', async ({ request }) => {
      // Arrange
      const page = 2
      const limit = 5
      const endpoint = `${baseUrl}/customers?page=${page}&limit=${limit}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      expect(body.pageInfo.currentPage).toBe(page)
      expect(body.pageInfo.totalPages).toBeGreaterThan(0)
    })
  })

  test.describe('Failed requests', () => {
    test('returns 400 for invalid page parameter (negative value)', async ({ request }) => {
      // Arrange
      const page = -1
      const endpoint = `${baseUrl}/customers?page=${page}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('returns 400 for invalid limit parameter (zero value)', async ({ request }) => {
      // Arrange
      const limit = 0
      const endpoint = `${baseUrl}/customers?limit=${limit}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('returns 400 for unsupported size value', async ({ request }) => {
      // Arrange
      const size = 'InvalidSize'
      const endpoint = `${baseUrl}/customers?size=${size}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toBe(
        'Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.'
      )
    })

    test('returns 400 for unsupported industry value', async ({ request }) => {
      // Arrange
      const industry = 'InvalidIndustry'
      const endpoint = `${baseUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const body = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toBe(
        'Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.'
      )
    })
  })
})
