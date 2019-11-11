# volleymania-scraper

Gets all the data from [this](https://volleymania.com/standings) vollayball ranking website and stores all the scraped data in MongoDB collections.

## How to run the scraper
In the root directory: 
1. Add a .env file containing ```DB_CONNECTION=your-MongoDB-connection-string```
2. Open the terminal in the root directory, then use this:  
  ```npm run scraper```