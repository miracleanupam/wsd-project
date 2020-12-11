# Behaviour Reporting
This project was created as a requirement to pass 'Web Software Development' course in Aalto University.

## Author
Anupam Dahal

## About this project
This is a simple web application created using Deno runtime and PostgreSQL as database. In this project, users can register/login to report their daily habits and track their estimated summary of their data. The users can report their daily
- Hours of sleep (for eg. 5.4 or 3)
- Quality of sleep (from 1 to 5, 1 being the worst and 5 being the best)
- General mood at the time (from 1 to 5, 1 being the worst and 5 being the best)
- Hours spent in studies (for eg. 5.4 or 3)
- Hours spent in sports and exercies (for eg. 5.4 or 3)
- Eating Quality (from 1 to 5, 1 being the worst and 5 being the best)

## App Organization
### Web Pages
When user goes to the homepage of the app, he can start using the app by registering first and then loggin into the app. On the home page after loggin in, the user can see the general mood trend of today as compared to yesterday if there is data available for comparision. Along with this, the user can see several links for other functionalities of the app. The user will be able to add the report for morning or evening at the time of his choosing. Also, the summaries of his trends and behaviours can be seen in the summary page with the help of the links provided.

There is also a title bar where user can find a link to go to the home page of the app on the left. On the right, there is an text indicator that will display the email of the currently logged in user and also a logout functionality together.

I believe that using this app is straightforward.

### API
User can also use API provided by the app although, functionality with API can be limited. User can register/login in the app, report data for morning or evening, view summary of last seven days or last 30 days or of any day of choosing. The endpoints of the API are discussed later in this document.

## Technical Aspects
### Data Storage
PostgreSQL is used to store the user data. The database schema has been designed in a way that I felt would provide an easy access to the data for creating various summarizations.

The database has three main tables:
| Schema |        Name        | Type  |
| ------ | ------------------ | ----- |
| public | reportings_evening | table |
| public | reportings_morning | table |
| public | users              | table |

Table 'users' has following columns:
| id |          email          |                           password                            |
| -- | ----------------------- | ------------------------------------------------------------- |
| 1  | anupam.dahal@aalto.fi    | $2a$10$t6cDaPeal3oWPWjjM4dFHusZwwsqqYprET9YDb8q7TqTwrARo00k.  |
| 2  | miracleanupam@gmail.com | $2a$10$pekMIUOxZv1Iiv2o2RReN.T6pHMlaDRGJwe3r4NooFEOEk4YJUOtq  |

Table 'reportings_morning' has following columns:
| id  | report_for | user_id | sleep_hours | sleep_quality | mood |
|-----|------------|---------|-------------|---------------|------|
|  23 | 2020-12-02 |       1 |           7 |             3 |    4 |
|  24 | 2020-12-03 |       1 |           3 |             2 |    2 |

Table 'reportings_evening' has following columns:
| id  | report_for | user_id | sports_hours | study_hours | eating_quality | mood | 
|-----|------------|---------|--------------|-------------|----------------|------|
|  27 | 2020-12-02 |       1 |            4 |           2 |              3 |    5 |

More details on the database schema can be found in sql_v1 file. However, noteworthy things to mention is that indices have been created so that joining and queries the data is easier. See the file mentioned for details.

### Runtime
Deno has been used as runtime environment of this project.

### Styling
Bootstrap Framework has been used to style the web pages in uniform way.

## API Endpoints
1. /api/auth/register - POST "email=someemail@domain.com&password&somepassword&verification&somepassword"
                      - Response: 'Success'
                     
2. /api/auth/login - POST "email=someemail@domain.com&password&somepassword"
                   - Response 'Success'
                   
3. /api/auth/logout - GET 'Cookie: sid=<session id>' 
                    - 'Success'
  
 4. /api/report-evening - POST 'Cookie: sid=<session id>' "study_hours=5&sports_hours=1&eating_quality=3&mood=4&report_for='2020-12-11'"
                        - Response 200
 
 5 /api/report-morning - POST 'Cookie: sid=<session id>' "sleep_hours=5&sleep_quality=5&mood=5&report_for='2020-12-11'"
                        - Response 200
  
 6. /api/summary-last-week - GET 'Cookie: sid=<session id>'
                           - Response: Summary of the last 7 days in JSON
 7. /api/summary-last-month - GET 'Cookie: sid=<session id>'
                            - Response: Summary of the last 30 days in JSON
 8. /api/summary/:year/:month/:day - GET 'Cookie: sid=<session id>'
                                   - Response: Summary of the date 
  
## Testing
There are test cases written to test the functionality of the app. Testing can be done by staring the runtime environment mode using environment variables to feed the database credentials. Or, the credentials can also be supplied in config.js file.

## Instruction for running
1. Build the docker image
      docker build -t ad/deno .
2. Change the environment variables for database credentials in docker-compose.yaml file. Change the host directory to where the source code is in line 14. So, it should be the direcotry where the project is cloned to.
3. Change/Remove the lines 32 and 33
4. Run docker-compose up

## Live Website
[Heroku Site](https://wsd-anupam.herokuapp.com/)
