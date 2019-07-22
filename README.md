# APIs Automation test using Mocha and Chai
## Pre-requisite
1. Node.js installed.
2. Api should be running on local machine on localhost i.e. `http://localhost:51544`
## How to install & Run 
1. Please extract the project at your desired path
1. Go to `/api-tests/data/application.json` file and update configurations. 
	* Update `url` in application.properties file ,i.e. where api is hosted  e.g. `localhost:51544`
1. Open the command prompt and go to the project path.
1. Run `npm install` command to install all the dependencies
1. Run `npm test`to command to execute all tests and generate html and json reports for test results. Please find the reports under `mochaawesome-report` directory. 


