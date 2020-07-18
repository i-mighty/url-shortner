# URL Shortner 

Created by Josiah Adegboye.

Made with ❤️, Express and Vue

## How to run

First clone the repo with

```
git clone https://github.com/i-mighty/url-shortner
```

Then 

```
cd ./url-shortner
```

Next, start the services with docker

```
docker-compose up
```

Or start the services individually i.e

```
docker-compose up mongodb //For the mongodb database
docker-compose up app //For the frontend Vue app service
docker-compose up server //For the express server
```

## Testing

To run tests, first start the mongodb service by running

```
docker-compose up mongodb
```

Next run

```
yarn run test
```

Running the above from the project root folder runs tests for both the vue app and the express server. 

Created by Josiah Adegboye