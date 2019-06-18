# Refresh token

A refresh token is used to generate an access token.  An access token is required with every call to Sharepoint endpoints within the 365 REST API.  

**A new refresh token must be generated every six months.**

To complete this process, you must be set up as a Sharepoint administrator in 365.

## Step 1: Register the app
Navigate [here](https://cityofpittsburgh.sharepoint.com/_layouts/15/appregnew.aspx ), and register a new third party application in the Sharepoint tenant.

| Field      | Value |
| ----------- | ----------- |
| Client Id      | { Click "Generate" } |
| Client Secret   | { Click "Generate" } |
| Title   | 365 Proxy { add short UUID here } |
| App Domain   | www.azurewebsites.us |
| Redirect URI   | https://localhost/ |

Click "Create," and save this information for further steps.

## Step 2: Get the tenant realm
Fire up an API client, and make a GET call to retrieve the realm ID of the 365 Sharepoint tenant:

`
curl -H "Authorization: Bearer" https://cityofpittsburgh.sharepoint.com/_vti_bin/client.svc 
`

In the response object, inspect the headers for the "WWW-
Authenticate" attribute.  Here you will find the realm:

`
WWW-Authenticate  -> Bearer realm="xxxxxx-xxxxx-xxxxx-xxxx", ...
`

Save this UUID for further steps.

## Step 3: Get the auth code from Azure ACS.
Construct the following url with the client ID generated in step 1.  Here, line breaks and indents have been added for readability.  But this is just one long string with query parameters:

https://cityofpittsburgh.sharepoint.com/_layouts/oauthauthorize.aspx?  
>client_id={ Client Id from step 1 }  
>&scope=AllSites.Manage   
>&response_type=code  
>&redirect_uri=https%3A%2F%2Flocalhost%2F 

Navigate to this URL from a browser.  You will be prompted to approve the permissions granted to the application created in step 1 ("Do you trust  365 Proxy...").  Click "Trust It."

After granting trust, you will be redirected to the redirect URI defined in step 1, appended with a temporary authorization code included as a query string:

`
https://localhost/?code={ auth code }
`

This authorization code expires in 5 minutes.  So, save it for further steps, and start moving faster...

## Step 4: Generate the refresh token
To generate the refresh token, construct the following POST call, with all supplied values properly encoded and passed as query parameters:

POST https://accounts.accesscontrol.windows.net/{ Tenant realm from step 2 }/tokens/OAuth/2?
>grant_type=authorization_code   
>&client_id={ Client Id from step 1 }@{ Tenant realm  from step 2 }  
>&client_secret={ Client secret from step 1 }  
>&code={ Authorization code from step 3 }  
>&redirect_uri={ Redirect URI from step 1 }   
>&resource=00000003-0000-0ff1-ce00-000000000000/cityofpittsburgh.sharepoint.com@{ Tenant realm from step 2 }

Fire off the POST request, and inspect the response body for the refresh token:

```
{
    "token_type": "Bearer",
    ...
    "refresh_token": { BINGO }
    ...
}
```

This token is good for 6 months.

## Step 5: Generate an access token
To generate a new access token, construct the following POST call, with all supplied values properly encoded and passed as query parameters:

POST https://accounts.accesscontrol.windows.net/{ Tenant realm from step 2 }/tokens/OAuth/2?
>grant_type=refresh_token
>&client_id={ Client Id from step 1 }@{ Tenant realm  from step 2 }  
>&client_secret={ Client secret from step 1 }  
>&refresh_token={ Refresh token from step 4 }  
>&redirect_uri={ Redirect URI from step 1 }   
>&resource=00000003-0000-0ff1-ce00-000000000000/cityofpittsburgh.sharepoint.com@{ Tenant realm from step 2 }

Fire off the POST request, and inspect the response body for the access token:

```
{
    "token_type": "Bearer",
    ...
    "access_token": { BINGO }
    ...
}
```

The access token expires quickly.

## Step 6: Update environment variables on server, and in dev
For both the production service and the staging service, update all application settings with the new values for the following environment variables:

```
SP_ID=<New client ID>
SP_SECRET=<New client secret>
SP_TOKEN=<New refresh token>
```

Update the values locally as well.
