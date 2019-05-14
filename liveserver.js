/**
 * Live Server configuration
 * This is to launch an HTTP server for html, css and js files
 * with automatic browser reload
 */
// let browserSync = require("browser-sync").create();
// browserSync.init({
//     watch: true,
//     server: './app'
// });

let connect = require('connect');
let serveStatic = require('serve-static');
let app = connect();
let directory = './app';
let port = process.env.PORT || 3000;

app.use(serveStatic(directory, {
    index: ['index.html']
    })
);
app.listen(port);
