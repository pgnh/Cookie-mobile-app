import { test, expect } from '@playwright/test'
import { createBrowserClient } from '../lib/supabase'

/**
 * Demo test showing automated browser testing with screenshots
 * Run: npm run test:headed
 */
test.describe('🍪 Cookie App - Automated Browser Demo', () => {
  
  test('capture splash screen', async ({ page }) => {
    await page.goto('/')
    
    // Wait for splash animation
    await page.waitForTimeout(1000)
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/splash-screen.png',
      fullPage: true 
    })
    
    console.log('✅ Screenshot saved: test-results/splash-screen.png')
  })

  test('capture login screen after splash', async ({ page }) => {
    await page.goto('/')
    
    // Wait for splash animation to complete
    await page.waitForTimeout(4500)
    
    // Take screenshot of login
    await page.screenshot({ 
      path: 'test-results/login-screen.png',
      fullPage: true 
    })
    
    console.log('✅ Screenshot saved: test-results/login-screen.png')
  })

  test('demo: phone login flow', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4500)
    
    // Click phone login
    await page.getByText('Continue with Phone').click()
    
    // Wait for phone input
    await page.waitForTimeout(500)
    
    // Type phone number
    await page.getByPlaceholder('+84 123 456 789').fill('+84123456789')
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/phone-input.png',
      fullPage: true 
    })
    
    console.log('✅ Screenshot saved: test-results/phone-input.png')
  })

  test('demo: guest mode navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4500)
    
    // Click explore as guest
    await page.getByText('Explore as Guest').click()
    
    // Wait for main app
    await page.waitForTimeout(1000)
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/main-app.png',
      fullPage: true 
    })
    
    // Click Reviews tab
    await page.getByText('Reviews').click()
    await page.waitForTimeout(500)
    
    await page.screenshot({ 
      path: 'test-results/reviews-tab.png',
      fullPage: true 
    })
    
    console.log('✅ Screenshots saved: main-app.png, reviews-tab.png')
  })

  test('demo: open profile and settings', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4500)
    await page.getByText('Explore as Guest').click()
    await page.waitForTimeout(1000)
    
    // Open profile by clicking Settings icon in header
    await page.locator('button', { has: page.locator('svg') }).filter({ hasText: '' }).first().click()
    
    await page.waitForTimeout(500)
    
    await page.screenshot({ 
      path: 'test-results/profile-modal.png',
      fullPage: true 
    })
    
    console.log('✅ Screenshot saved: test-results/profile-modal.png')
  })
})
