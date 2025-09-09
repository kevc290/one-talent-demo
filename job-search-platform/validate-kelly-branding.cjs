const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function validateKellyBranding() {
    console.log('🚀 Starting Kelly Services branding validation...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    try {
        // Navigate to the application
        console.log('📱 Navigating to application...');
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
        
        // Take initial screenshot
        await page.screenshot({ path: 'kelly-branding-initial.png', fullPage: true });
        console.log('✅ Initial screenshot saved: kelly-branding-initial.png');
        
        // Check if Kelly Services is selected by default
        const brandName = await page.$eval('.text-xl.font-bold', el => el.textContent);
        console.log(`🏢 Current brand: ${brandName}`);
        
        // Validate Kelly Services accent color is being used
        const accentColorElements = await page.evaluate(() => {
            const elements = [];
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(el => {
                const computed = window.getComputedStyle(el);
                const color = computed.color;
                const backgroundColor = computed.backgroundColor;
                const borderColor = computed.borderColor;
                
                if (color.includes('rgb(0, 174, 66)') || 
                    backgroundColor.includes('rgb(0, 174, 66)') ||
                    borderColor.includes('rgb(0, 174, 66)') ||
                    color === '#00ae42' || 
                    backgroundColor === '#00ae42' ||
                    borderColor === '#00ae42') {
                    elements.push({
                        tag: el.tagName,
                        class: el.className,
                        text: el.textContent?.substring(0, 50)
                    });
                }
            });
            
            return elements;
        });
        
        console.log(`🎨 Found ${accentColorElements.length} elements with Kelly green accent color`);
        
        // Navigate to Jobs page to test job listings
        console.log('\n📋 Testing Jobs page...');
        await page.click('a[href="/jobs"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.screenshot({ path: 'kelly-branding-jobs.png', fullPage: true });
        console.log('✅ Jobs page screenshot saved: kelly-branding-jobs.png');
        
        // Test hover states on job cards
        console.log('🖱️  Testing hover states...');
        const jobCards = await page.$$('.group.relative.bg-white');
        if (jobCards.length > 0) {
            await jobCards[0].hover();
            await new Promise(resolve => setTimeout(resolve, 500));
            await page.screenshot({ path: 'kelly-branding-hover.png', fullPage: true });
            console.log('✅ Hover state screenshot saved: kelly-branding-hover.png');
        }
        
        // Test filter buttons
        console.log('🔍 Testing filter functionality...');
        const filterButtons = await page.$$('button[class*="px-3 py-2"]');
        if (filterButtons.length > 0) {
            await filterButtons[0].click();
            await new Promise(resolve => setTimeout(resolve, 500));
            await page.screenshot({ path: 'kelly-branding-filter-active.png', fullPage: true });
            console.log('✅ Active filter screenshot saved: kelly-branding-filter-active.png');
        }
        
        // Test brand switcher dropdown
        console.log('🔄 Testing brand switcher...');
        const brandSwitcherButton = await page.$('button[class*="flex items-center gap-2 px-3 py-2"]');
        if (brandSwitcherButton) {
            await brandSwitcherButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            await page.screenshot({ path: 'kelly-branding-switcher.png', fullPage: true });
            console.log('✅ Brand switcher screenshot saved: kelly-branding-switcher.png');
            
            // Switch to another brand and back to validate switching works
            const brandOptions = await page.$$('.absolute.top-full button');
            if (brandOptions.length > 1) {
                await brandOptions[1].click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                await page.screenshot({ path: 'kelly-branding-other-brand.png', fullPage: true });
                console.log('✅ Other brand screenshot saved: kelly-branding-other-brand.png');
                
                // Switch back to Kelly Services
                await page.click('button[class*="flex items-center gap-2 px-3 py-2"]');
                await new Promise(resolve => setTimeout(resolve, 500));
                const kellyOption = await page.$x("//button[contains(text(), 'Kelly Services')]");
                if (kellyOption.length > 0) {
                    await kellyOption[0].click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await page.screenshot({ path: 'kelly-branding-back-to-kelly.png', fullPage: true });
                    console.log('✅ Back to Kelly screenshot saved: kelly-branding-back-to-kelly.png');
                }
            }
        }
        
        // Check for hardcoded blue colors in CSS
        const hardcodedBlueElements = await page.evaluate(() => {
            const elements = [];
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(el => {
                const computed = window.getComputedStyle(el);
                const color = computed.color;
                const backgroundColor = computed.backgroundColor;
                const borderColor = computed.borderColor;
                
                // Check for blue color patterns that might indicate hardcoded styles
                const bluePatterns = [
                    'rgb(59, 130, 246)', // blue-500
                    'rgb(37, 99, 235)',  // blue-600
                    'rgb(29, 78, 216)',  // blue-700
                    '#3b82f6',           // blue-500 hex
                    '#2563eb',           // blue-600 hex
                    '#1d4ed8'            // blue-700 hex
                ];
                
                const hasBlue = bluePatterns.some(pattern => 
                    color.includes(pattern) || 
                    backgroundColor.includes(pattern) || 
                    borderColor.includes(pattern)
                );
                
                if (hasBlue) {
                    elements.push({
                        tag: el.tagName,
                        class: el.className,
                        text: el.textContent?.substring(0, 50),
                        color,
                        backgroundColor,
                        borderColor
                    });
                }
            });
            
            return elements;
        });
        
        console.log(`\n⚠️  Found ${hardcodedBlueElements.length} elements with potential hardcoded blue colors:`);
        hardcodedBlueElements.forEach((el, i) => {
            if (i < 10) { // Show only first 10 to avoid spam
                console.log(`   ${i + 1}. ${el.tag}.${el.class} - "${el.text}"`);
            }
        });
        if (hardcodedBlueElements.length > 10) {
            console.log(`   ... and ${hardcodedBlueElements.length - 10} more`);
        }
        
        // Final validation report
        console.log('\n📊 VALIDATION SUMMARY:');
        console.log('========================');
        console.log(`✅ Kelly Services brand detected: ${brandName === 'Kelly Services'}`);
        console.log(`🎨 Kelly accent color elements: ${accentColorElements.length}`);
        console.log(`⚠️  Potential hardcoded blue elements: ${hardcodedBlueElements.length}`);
        console.log(`📸 Screenshots saved: 7 total`);
        
        if (hardcodedBlueElements.length === 0) {
            console.log('\n🎉 SUCCESS: No hardcoded blue styling detected!');
            console.log('   Kelly Services branding appears to be consistent across the application.');
        } else {
            console.log('\n⚠️  WARNING: Found potential hardcoded blue styling.');
            console.log('   Review the elements listed above for Kelly Services compatibility.');
        }
        
    } catch (error) {
        console.error('❌ Error during validation:', error);
    } finally {
        await browser.close();
    }
}

// Run the validation
validateKellyBranding().catch(console.error);