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
            <title>Audio Social API</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #0f172a;
                    color: #f8fafc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    text-align: center;
                    background: #1e293b;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    max-width: 400px;
                }
                h1 { color: #f0f8fcbe; margin-top: 0; }
                p { color: #94a3b8; line-height: 1.6; }
                .btn {
                    display: inline-block;
                    margin-top: 1.5rem;
                    padding: 0.75rem 1.5rem;
                    background-color: #38bdf8;
                    color: #0f172a;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 6px;
                    transition: background 0.2s;
                }
                .btn:hover { background-color: #0ea5e9; }
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