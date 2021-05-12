# Express Token Server

This Express application provides an endpoint where a front-end application may request a JWT token for use with a Soul Machines websocket connection. 

One token server should be deployed for each environment.


## Deploying Token Server

The steps to deploying the Token Server are as follows:

1. Provision a server environment
2. Configure environment variables
3. Set up Nginx with SSL
4. Deploy the Express server
5. Verify that the Token Server is available

Detailed instructions below.

### 1. Provision a server environment
You will need to provision an environment where Token Server can be deployed and run. Instructions for this will vary depending on your hosting provider. In every case, for each environment you will need:

- Server with Node v10 installed, and support for running Node.js apps.
- A way to configure environment variables for the server.

### 2. Configure environment variables

You will need to set environment variables for each environment where the Token Server is deployed. These variables determine how the JWT tokens are signed, and which domains have permission to request tokens.

Configure your server environment with the variables shown in the `.env.template` file included with this project. When the Express app runs, it will use the variables available in your environment.

See the section [Environment Variables](#environment-variables) below for documentation.

### 3. Set up Nginx with SSL

You will need Nginx in front of your Token Server to manage the HTTP interface.

The Express app will run in the server environment you have configured, while Nginx will securely expose endpoints via SSL.

Nginx should:
- apply your SSL Certificate
- expose port 443 for SSL
- bridge your Express port (5000) to 443

See [How to Use Nginx as a Load Balancer](https://futurestud.io/tutorials/how-to-use-nginx-as-a-load-balancer)

### 4. Deploy the Express server

Deploy the Token Server code to your server, install all dependencies and then start the app.

- Deploy the code to your server
- Run `npm install` to install all dependencies
- Run `npm build`
- Run `npm start`

You may like to set up some form of automated deployment, and automatic application restart handling. This implementation will depend on your hosting provider.

### 5. Verify that the Token Server is available

There is a healthcheck URL available to test if the server is live.

- In a browser, navigate to `[your-server.com]/ping`
- If the server is available, it will return `1`


## Local Development

If you are doing local development of a user interface to interact with a Soul Machines Digital Human, you may wish to run a Token Server locally for ease of development. 

### Installing dependencies

- You will need Node v10 installed on your system
- You will need to run `npm install` from the project root

### Setting environment variables

- Copy `.env.template` to a new file called `.env`
- Update `.env` with the settings specific to your dev server

### Generating a Self-Signed SSL Key and Cert


#### For Linux or Mac

You can use the script below (for linux/mac) users:
- `mkdir certs`
- `cd certs`
- `../scripts/generate-ssl.sh localhost`


#### For Windows

Install `OpenSSL`, [follow these instructions](https://www.xolphin.com/support/OpenSSL/OpenSSL_-_Installation_under_Windows).

Run the following commands in your command line.
```
mkdir certs
cd certs
OpenSSL.exe req -new -nodes -subj /C=NZ/commonName=localhost -keyout localhost.key -out localhost.csr
OpenSSL.exe x509 -req -days 3650 -in localhost.csr -signkey localhost.key -out localhost.crt
cd ..
```
**NOTE** You can replace `localhost` with another name if you choose

### Running the server

To run the dev server use the command `npm run dev`

### Bypass Chrome Security

To connect to your server from your frontend app, you will need to allow your self-signed cert to be used in Chrome.

Navigate to your token server in your browser `https://localhost:5000/ping` and choose to "proceed to unsafe site".

This will add your self-signed cert to Chrome's trusted certs for a limited time (a few weeks).

When the override expires your UI will no longer be able to connect. At that time the above process can be repeated to renew the override.


## Environment Variables

#### `SESSION_SERVER`
The server where your digital human is hosted. This should be provided by your contact person at Soul Machines.

examples:
- `SESSION_SERVER=mycompany-video-dev.soulmachines.cloud` [dev environment]
- `SESSION_SERVER=mycompany-video.soulmachines.cloud` [prod environment]

#### `ORCHESTRATION_SERVER` [OPTIONAL]
The server where your private control and orchestration server is hosted. This is a server hosted by your company, it is not provided by Soul Machines.

**Most projects will not have an orchestration server.** If you do not have an orchestration server, this variable should not be set in your environment.

examples:
- `ORCHESTRATION_SERVER=mycompany-orch-dev.com` [dev orchestration server]
- `ORCHESTRATION_SERVER=mycompany-orch.com` [prod orchestration server]

#### `UI_SERVER`
The server where the user interface is hosted for this environment. This is a server hosted by your company, it is not provided by Soul Machines. Only token requests from this domain will be allowed.

example:
- `UI_SERVER=projectname-dev.mycompany.com` [development]

#### `EXPRESS_SERVER`
The server where the Express application should be hosted. 

Example:
- `EXPRESS_SERVER=127.0.0.1`

#### `EXPRESS_PORT`
The port where the Express application should be made available.

Example:
- `EXPRESS_PORT=5000`

#### `PRODUCTION_PERSONA`
Should be true in all cases.

Example:
- `PRODUCTION_PERSONA=true` [all environments]

#### `CONTROL_VIA_BROWSER` [OPTIONAL]
Should always be set to false or not defined when an orchestration server is not provided.

When an orchestration server is being used, this may be set to `true` during local development in order to allow the browser websocket to pass messages between the local orchestration server and the remote session server.

This is necessary for local development as the session server can not establish a websocket connection directly to an orchestration server running on localhost.

Control via browser is only allowed when PRODUCTION_PERSONA=false

Control via browser is disabled on all production session servers.

Example:
- `CONTROL_VIA_BROWSER=false` [all environments]

#### `JWT_PUBLIC_KEY`
Provided by SM. This key is unique per-environment.

Example:
- `JWT_PUBLIC_KEY=sm-abcdef1234567890` [all environments]

#### `JWT_PRIVATE_KEY`
Provided by SM. This key is unique per-environment, and is used to sign your JWT tokens. Treat this as a password, do not publish.

Example:
- `JWT_PRIVATE_KEY=abcdef1234567890` [all environments]

#### `SSL_CERT`
When running the Token Server for local development, you need to provide a self-signed SSL certificate.

See the section [Local Development](#local-development) for more information.

Example:
- `SSL_CERT=certs/server.crt` [local server only]

#### `SSL_KEY`
When running the Token Server for local development, you need to provide a key for your self-signed SSL certificate.

Example:
- `SSL_KEY=certs/server.key` [local server only]
