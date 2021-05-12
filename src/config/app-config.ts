import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AppConfig } from './app-config-model';

// load environment variables
// will fail silently when .env is not available,
// allowing a fallback to host's env vars
dotenv.config();

export const appConfig: AppConfig = {

    // true if the app is running in prod mode
    production: process.env.NODE_ENV === 'production',

    // should be a url like [project-name].soulmachines.cloud
    sessionServer: process.env.SESSION_SERVER,

    // should be the public url of this server
    orchestrationServer: process.env.ORCHESTRATION_SERVER || '',

    // should be a url like [project-name-ui].soulmachines.cloud
    uiServer: process.env.UI_SERVER,

    // certain features such as control via browser are only supported on dev servers
    productionPersona: process.env.PRODUCTION_PERSONA === 'true',

    // send all messages to orchestration server via the ui.
    // not allowed on production persona servers.
    // recommended for local development only.
    controlViaBrowser: process.env.CONTROL_VIA_BROWSER === 'true',

    // these can be generated on the session server
    jwt: {
        keyName: process.env.JWT_PUBLIC_KEY,
        key: process.env.JWT_PRIVATE_KEY,
    },

    // load the ssl key and cert from local files
    ssl: {
        key: process.env.SSL_KEY ? fs.readFileSync(process.env.SSL_KEY, 'utf8') : null,
        cert: process.env.SSL_CERT ? fs.readFileSync(process.env.SSL_CERT, 'utf8') : null,
    },

    // where to run the express process
    express: {
        port: process.env.EXPRESS_PORT || 3000,
        ip: process.env.EXPRESS_SERVER || '127.0.0.1'
    },
}
