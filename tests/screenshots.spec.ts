import { test, expect } from '@playwright/test';

test.describe('Website Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for page to be fully loaded
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Homepage', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/01-homepage.png',
      fullPage: true 
    });
  });

  test('Katten Overzicht', async ({ page }) => {
    await page.goto('http://localhost:3000/katten');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/02-katten-overzicht.png',
      fullPage: true 
    });
  });

  test('Kat Detail met Adoptie Formulier', async ({ page }) => {
    await page.goto('http://localhost:3000/katten');
    await page.waitForLoadState('networkidle');
    
    // Click on first available cat's adoption button
    const firstCat = page.locator('button:has-text("adopteren")').first();
    await firstCat.click();
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'docs/screenshots/03-kat-detail.png',
      fullPage: true 
    });
  });

  test('Blog Overzicht', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/04-blog-overzicht.png',
      fullPage: true 
    });
  });

  test('Contact Pagina', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/05-contact.png',
      fullPage: true 
    });
  });

  test('Donatie Pagina', async ({ page }) => {
    await page.goto('http://localhost:3000/donatie');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/06-donatie.png',
      fullPage: true 
    });
  });

  test('Admin Login', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/07-admin-login.png',
      fullPage: true 
    });
  });

  test('Admin Dashboard', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/admin');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'Admin123!@#');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'docs/screenshots/08-admin-dashboard.png',
      fullPage: true 
    });
  });

  test('Admin Katten Beheer', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/admin');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'Admin123!@#');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Go to katten beheer
    await page.goto('http://localhost:3000/admin/katten');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'docs/screenshots/09-admin-katten.png',
      fullPage: true 
    });
  });

  test('Admin Blog Beheer', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/admin');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'Admin123!@#');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Go to blog beheer
    await page.goto('http://localhost:3000/admin/blog');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'docs/screenshots/10-admin-blog.png',
      fullPage: true 
    });
  });

  test('Admin Instellingen', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/admin');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'Admin123!@#');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Go to instellingen
    await page.goto('http://localhost:3000/admin/instellingen');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'docs/screenshots/11-admin-instellingen.png',
      fullPage: true 
    });
  });

  test('Admin Adoptie Aanvragen', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/admin');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'Admin123!@#');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Go to adoptie aanvragen
    await page.goto('http://localhost:3000/admin/adoptie-aanvragen');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'docs/screenshots/12-admin-adoptie-aanvragen.png',
      fullPage: true 
    });
  });

  test('Mobile - Homepage', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/13-mobile-homepage.png',
      fullPage: true 
    });
  });

  test('Mobile - Katten Overzicht', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/katten');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'docs/screenshots/14-mobile-katten.png',
      fullPage: true 
    });
  });
});
