## Running the app

```bash
# build
$ docker-compose build

# run
$ docker-compose up -d

## Libraries used
 axios - make  REST API calls
 dotenv - to load environment variables
 mongoose - ORM for mongoDB
 jest - for testing
 swagger - as interface to let user test services

## Reason to use MongoDB
 - Schema-less Design: (In this case the data can be so dinamyc)
 - Complexity: The data is hierarchical, with varying fields, MongoDB is more suitable
 - Flexibility

