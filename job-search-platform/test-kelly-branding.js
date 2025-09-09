import { chromium } from 'playwright';

async function testKellyBranding() {
  console.log('🧪 Starting Kelly Services branding validation test...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Navigate to the application
    console.log('📍 Navigating to application...');
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the homepage
    await page.screenshot({ path: 'kelly-homepage.png', fullPage: true });
    console.log('📸 Homepage screenshot saved as kelly-homepage.png');
    
    // Check if Kelly Services is selected
    const brandSwitcher = await page.locator('[class*="flex items-center gap-2"]').first();
    if (await brandSwitcher.isVisible()) {
      const brandText = await brandSwitcher.textContent();
      console.log('🏷️ Current brand:', brandText?.trim());
      
      // If not Kelly Services, switch to it
      if (!brandText?.includes('Kelly Services')) {
        console.log('🔄 Switching to Kelly Services...');
        await brandSwitcher.click();
        await page.click('text=Kelly Services');
        await page.waitForTimeout(1000);
      }
    }
    
    // Navigate to jobs page to test job cards
    console.log('📝 Navigating to jobs page...');
    await page.click('text=Find Jobs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of jobs page
    await page.screenshot({ path: 'kelly-jobs-page.png', fullPage: true });
    console.log('📸 Jobs page screenshot saved as kelly-jobs-page.png');
    
    // Test hover interactions on job cards
    console.log('🖱️ Testing job card hover interactions...');
    const jobCard = page.locator('[class*="group relative bg-white"]').first();
    if (await jobCard.isVisible()) {
      await jobCard.hover();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'kelly-job-card-hover.png' });
      console.log('📸 Job card hover screenshot saved');
    }
    
    // Check for any hardcoded blue colors in the page
    console.log('🔍 Checking for hardcoded blue colors...');
    const blueElements = await page.evaluateHandle(() => {
      const elements = [];
      const allElements = document.getElementsByTagName('*');
      
      for (let element of allElements) {
        const computedStyle = window.getComputedStyle(element);
        const classList = Array.from(element.classList);
        
        // Check for blue Tailwind classes
        const hasBlueClass = classList.some(cls => 
          cls.includes('blue-') || 
          cls.includes('text-blue') || 
          cls.includes('bg-blue') || 
          cls.includes('border-blue') ||
          cls.includes('hover:text-blue') ||
          cls.includes('hover:bg-blue')
        );
        
        // Check for blue CSS values
        const hasBlueColor = computedStyle.color.includes('rgb(59, 130, 246)') || // blue-600
                            computedStyle.backgroundColor.includes('rgb(59, 130, 246)') ||
                            computedStyle.borderColor.includes('rgb(59, 130, 246)');
        
        if (hasBlueClass || hasBlueColor) {
          elements.push({
            tagName: element.tagName,
            classList: classList,
            text: element.textContent?.substring(0, 50) || '',
            computedColor: computedStyle.color,
            computedBgColor: computedStyle.backgroundColor,
            computedBorderColor: computedStyle.borderColor
          });
        }
      }
      
      return elements.slice(0, 10); // Limit to first 10 findings
    });
    
    const blueElementsData = await blueElements.jsonValue();
    if (blueElementsData.length > 0) {
      console.log('⚠️ Found elements with hardcoded blue styling:');
      blueElementsData.forEach((element, index) => {
        console.log(`  ${index + 1}. ${element.tagName} - Classes: ${element.classList.join(', ')}`);
        console.log(`     Text: "${element.text.trim()}"`);
        if (element.computedColor !== 'rgba(0, 0, 0, 0)' && element.computedColor !== 'rgb(0, 0, 0)') {
          console.log(`     Color: ${element.computedColor}`);
        }
        if (element.computedBgColor !== 'rgba(0, 0, 0, 0)' && element.computedBgColor !== 'rgb(255, 255, 255)') {
          console.log(`     Background: ${element.computedBgColor}`);
        }
        console.log('');
      });
    } else {
      console.log('✅ No hardcoded blue styling detected in visible elements');
    }
    
    // Test Kelly Services green accent color usage
    console.log('🟢 Checking for Kelly Services green accent color usage...');
    const kellyGreenElements = await page.evaluateHandle(() => {
      const elements = [];
      const allElements = document.getElementsByTagName('*');
      
      for (let element of allElements) {
        const computedStyle = window.getComputedStyle(element);
        
        // Check for Kelly green color (#00ae42)
        if (computedStyle.color.includes('rgb(0, 174, 66)') || 
            computedStyle.backgroundColor.includes('rgb(0, 174, 66)') ||
            computedStyle.borderColor.includes('rgb(0, 174, 66)')) {
          elements.push({
            tagName: element.tagName,
            classList: Array.from(element.classList),
            text: element.textContent?.substring(0, 30) || '',
            computedColor: computedStyle.color,
            computedBgColor: computedStyle.backgroundColor
          });
        }
      }
      
      return elements.slice(0, 5); // Limit to first 5 findings
    });
    
    const kellyGreenData = await kellyGreenElements.jsonValue();
    if (kellyGreenData.length > 0) {
      console.log('✅ Found elements using Kelly Services green accent color:');
      kellyGreenData.forEach((element, index) => {
        console.log(`  ${index + 1}. ${element.tagName} - "${element.text.trim()}"`);
      });
    } else {
      console.log('⚠️ No elements found using Kelly Services green accent color');
    }
    
    console.log('✅ Kelly Services branding validation test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testKellyBranding();