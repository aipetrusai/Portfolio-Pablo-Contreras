import os
import asyncio
from pyppeteer import launch

async def generate_pdf():
    # Path to index.html
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, '../index.html')
    file_url = f'file://{os.path.abspath(file_path)}'
    
    browser = await launch(args=['--no-sandbox'])
    page = await browser.newPage()
    
    await page.goto(file_url, {'waitUntil': 'networkidle0'})
    
    # Create cv directory
    cv_dir = os.path.join(current_dir, '../cv')
    if not os.path.exists(cv_dir):
        os.makedirs(cv_dir)
        
    pdf_path = os.path.join(cv_dir, 'Pablo_Contreras_CV.pdf')
    
    await page.pdf({
        'path': pdf_path,
        'format': 'A4',
        'printBackground': True,
        'margin': {
            'top': '0px',
            'right': '0px',
            'bottom': '0px',
            'left': '0px'
        }
    })
    
    await browser.close()
    print(f'PDF generated successfully at {pdf_path}')

if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(generate_pdf())
