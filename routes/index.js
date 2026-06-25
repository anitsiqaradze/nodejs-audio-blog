var express = require('express');
var router = express.Router();


// GET /
router.get('/', (req, res) => {
    // Set headers to explicitly tell browsers this is an HTML response
    res.setHeader('Content-Type', 'text/html');
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #6e5237;
                    color: #f8fafc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    text-align: center;
                    background: #beba8f83;
                    padding: 3rem;
                 
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    max-width: 400px;
                }
                h1 { color: #f0f8fcbe; margin-top: 0; }
                p { color: #dde0e6; line-height: 1.6; }
                .btn {
                    display: inline-block;
                    margin-top: 1.5rem;
                    padding: 0.75rem 1.5rem;
                    background-color: #b7b9a2af;
                    color: #c2a985;
                    text-decoration: none;
                    font-weight: bold;
                 
                    transition: background 0.2s;
                }
                .btn:hover { background-color: #213842; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Audio Blog API </h1>
                <p>To explore, test, and view available endpoints...</p>
                <a href="/docs" class="btn">Explore API Docs</a>
            </div>
        </body>
        </html>
    `);
});


module.exports = router;