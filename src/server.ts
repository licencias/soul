import * as https from 'https';
import * as http from 'http';
import app from './app';
import { appConfig } from './config/app-config';


/**
 * Create an http server for production
 *
 * The production app does not need to be https as it is behind
 * a load balancer with security configured.
 */
const getHttpServer = (app) => {
    return http.createServer(app)
}

/**
 * Create an https server for local development
 *
 * The local app needs to use https as all UIs are run under
 * https and therefore must access only secure resources.
 */
const getHttpsServer = (app, sslCredentials) => {
    return https.createServer(sslCredentials, app);
}

/**
 * Create the web server
 */

// use http for prod, https for local dev
const useSsl = appConfig.ssl.cert && appConfig.ssl.key;
const webServer = useSsl
    ? getHttpsServer(app, appConfig.ssl)
    : getHttpServer(app);


webServer.listen(appConfig.express.port, () => {
    console.log(`Express server listening on port ${appConfig.express.port}`);
});
