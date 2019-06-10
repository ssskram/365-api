# Microsoft 365 Proxy

This repo contains a node application that serves as a proxy service between all City of Pittsburgh client applications that interface with the Microsoft 365 REST API.  By and large, these applications are targeting Sharepoint, because they rely on Sharepoint as a data store.  There are also endpoints targeting Outlook.

## Authorization

Bearer token.  Just ask for it

## Access & Refresh Tokens

Communication with the Sharepoint API is facilitated through an OAuth flow.  An access token must accompany every request.  Access tokens have a shelf life of approximately 10 minutes.  Access tokens are generated from refresh tokens, which have a shelf life of approximately 6 months.  So, every 6 months, the refresh token needs to be manually regenerated via the registration of a third party application within the 365 portal.

**If the refresh token expires, the proxy service will stop working.  And lots of things will break.**

Last refresh: 4/29/2019  
**Next refresh needed by 9/29/2019**

For a step-by-step guide to regenerating the refresh token, see [TOKEN.md](TOKEN.md)


## File structure
    .
    ├── models                  # Data transformations
    ├── routes                  # All endpoints, grouped by application
    ...                   
    ├── refresh.js              # Generates a new access token per call
    ├── server.js               # Entry point, Express config
    ...
    └── README.md

## API Documentation

Swagger UI: https://365proxy.azurewebsites.us/docs

## Running Locally

### Prerequisites

* [Node.js](https://nodejs.org) - JS runtime
* .env - See .env.example for all required secrets

### Installation
```
git clone https://github.com/CityofPittsburgh/365-api 
cd 365-api
npm install
node server.js
```

## Deployment

Both staging and production services are hosted in Azure.  Application is deployed directly from github, and can be triggered either (a) through the Azure GUI, (b) through the [CLI](https://docs.microsoft.com/en-us/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-sync), or (c) through the [proxy service](https://github.com/ssskram/azure-proxy).

For complete documentation on the azure environment, see [here](https://github.com/CityofPittsburgh/all-things-azure.git).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details