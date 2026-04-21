import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('Starting PDF generation...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
        const page = await browser.newPage();
        
        // Load the local index.html
        const filePath = path.resolve(__dirname, '../index.html');
        const fileUrl = `file://${filePath}`;
        
        console.log(`Navigating to ${fileUrl}...`);
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        // Create cv directory if it doesn't exist
        const cvDir = path.resolve(__dirname, '../cv');
        if (!fs.existsSync(cvDir)) {
            fs.mkdirSync(cvDir);
        }
        
        // Generate PDF with minimalist settings
        console.log('Generating PDF...');
        await page.pdf({
            path: path.resolve(cvDir, 'Pablo_Contreras_CV.pdf'),
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0cm',
                right: '0cm',
                bottom: '0cm',
                left: '0cm'
            },
            displayHeaderFooter: false
        });

        console.log('PDF generated successfully at cv/Pablo_Contreras_CV.pdf');
    } catch (error) {
        console.error('Error during PDF generation:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

generatePDF().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
