# Mobile Web Specialist Certification Course

## _Three Stage Course Material Project - Restaurant Reviews_

### Instructions
For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. 
In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different 
sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless 
offline experience for your users.
In **Stage Two** you will be provided with a server from where you need to fetch data, save it on the browser's database (indexedDB) and fetch from it. While
maintaining the previous work on Stage One, you need to work on performance, accessibility and progressive web app. You can audit your app
by using the audits tool provided with the Google developers tools on Google Chrome browser.

## Project Overview: Stage 1

### Problem

Page doesn't respond well to different viewports and cannot work offline. Also, lacks some accessibility features.

### Work Done

Little tweaks on the CSS were made so it can be responsive as possible on different viewports 
(Mobiles, Desktops, etc). Page also can be accessed by screen readers following the recommendations from the WCAG standards (https://www.w3.org/TR/WCAG21/). 
Service Worker had been added so the app can work even in offline mode.

### How to test it?

1. In this folder, start up a simple HTTP server by running this script on a command prompt or bash shell: ```python -m SimpleHTTPServer 8000``` to serve up the site files on your local computer. 
Note that you need to have installed Python to run the script mentioned before. Other option is to install XAMPP from Apache Friends. You can get it from here: https://www.apachefriends.org/index.html.
Note that if you use the XAMPP app, the files should be on the htdocs folder for simplicity.

2. Open your web browser and copy this URL: **http://127.0.0.1/mws-restaurant-review**. This project uses the Google Maps API. You need to provide your own API key.

3. Done. Now you can debug the page locally.

## Project Overview: Stage 2

### Problem

App have some issues with performance that needs to be addressed so it can be usable in offline mode. Accessibility needs to be a priority. 

### Work Done

Minification of css and js files to improve the performance of the app. Service worker update to handle the cached files. Addition of a routine to check if indexedDB is supported. 
Data coming from the remote server is now stored in the browser's database (indexedDB) to be fetched while in offline mode. Addition of image sourceset for different viewports.
Improvements on accessibility. 

### How to test it?

1. You need to have NodeJS installed on your computer. Get it from here: https://nodejs.org.
2. Run this command on your command prompt or bash shell: ```npm install```. This will install all dependencies needed to run the project.
3. After all dependencies are installed, run this command to optimize files before launching app: ```node run optimize```.
4. Once all files are optimized, you are ready to launch the app by entering this command: ```npm start```.
5. Done. Your default browser will be showing up the app, ready to use.

### Note about ES6

Most of the code in this project has been written with the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. 
As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 



