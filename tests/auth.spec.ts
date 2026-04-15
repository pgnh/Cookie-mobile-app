import { test, expect } from '@playwright/test'

test.describe('Cookie App Authentication', () => {
  test('should display splash screen and navigate to login', async ({ page }) => {
    await page.goto('/')
    
    // Wait for splash screen
    await expect(page.getByText('Cookie')).toBeVisible()
    await expect(page.getByText('Lifestyle & Recipes')).toBeVisible()
    
    // Wait for splash to complete (3.5s animation)
    await page.waitForTimeout(4000)
    
    // Should show login screen
    await expect(page.getByText('Discover and share amazing recipes')).toBeVisible()
    await expect(page.getByText('Continue with Google')).toBeVisible()
    await expect(page.getByText('Continue with Apple')).toBeVisible()
    await expect(page.getByText('Continue with Phone')).toBeVisible()
  })

  test('should show phone input when clicking phone button', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000) // Wait for splash
    
    // Click phone button
    await page.getByText('Continue with Phone').click()
    
    // Should show phone input
    await expect(page.getByPlaceholder('+84 123 456 789')).toBeVisible()
    await expect(page.getByText('Send OTP')).toBeVisible()
  })

  test('can explore as guest without login', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000) // Wait for splash
    
    // Click explore as guest
    await page.getByText('Explore as Guest').click()
    
    // Should see main app content
    await expect(page.getByText('Explore')).toBeVisible()
    await expect(page.getByText('Reviews')).toBeVisible()
  })

  test('should show error for empty phone number', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)
    
    // Click phone button twice to trigger send
    await page.getByText('Continue with Phone').click()
    await page.getByText('Send OTP').click()
    
    // Should show error
    await expect(page.getByText('Please enter your phone number')).toBeVisible()
  })

  test('can navigate through main app sections', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)
    await page.getByText('Explore as Guest').click()
    
    // Click Reviews tab
    await page.getByText('Reviews').click()
    await expect(page.getByText('Reviews')).toHaveClass(/active|selected/)
    
    // Click Explore tab
    await page.getByText('Explore').click()
    await expect(page.getByText('Explore')).toHaveClass(/active|selected/)
  })

  test('can open profile modal', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)
    await page.getByText('Explore as Guest').click()
    
    // Click profile icon in bottom nav
    const profileButton = page.locator('button[aria-label="Profile"]').first()
    await profileButton.click()
    
    // Should see profile content
    await expect(page.getByText('Posts')).toBeVisible()
    await expect(page.getByText('Recipes')).toBeVisible()
  })

  test('can open settings from profile', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)
    await page.getByText('Explore as Guest').click()
    
    // Open profile
    const profileButton = page.locator('button[aria-label="Profile"]').first()
    await profileButton.click()
    
    // Click settings gear icon
    await page.locator('[data-testid="settings-icon"]').click()
    
    // Should see settings menu
    await expect(page.getByText('Account Info')).toBeVisible()
    await expect(page.getByText('Security')).toBeVisible()
    await expect(page.getByText('Privacy')).toBeVisible()
    await expect(page.getByText('Dark Mode')).toBeVisible()
  })
})
