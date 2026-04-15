import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('splash screen visual check', async ({ page }) => {
    await page.goto('/')
    
    // Wait for splash to render
    await page.waitForTimeout(500)
    
    // Take screenshot of splash
    await expect(page).toHaveScreenshot('splash-screen.png', {
      maxDiffPixels: 100
    })
  })

  test('login screen visual check', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000) // Wait for splash animation
    
    // Take screenshot of login
    await expect(page).toHaveScreenshot('login-screen.png', {
      maxDiffPixels: 100
    })
  })

  test('main app visual check - guest mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)
    await page.getByText('Explore as Guest').click()
    
    // Wait for content to load
    await page.waitForTimeout(1000)
    
    // Take screenshot of main app
    await expect(page).toHaveScreenshot('main-app-guest.png', {
      maxDiffPixels: 200
    })
  })

  test('mobile viewport - login screen', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    
    await page.goto('/')
    await page.waitForTimeout(4000)
    
    await expect(page).toHaveScreenshot('login-mobile.png', {
      maxDiffPixels: 100
    })
  })
})
