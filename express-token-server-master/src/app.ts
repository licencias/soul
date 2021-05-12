import * as express from 'express';
import * as bodyParser from 'body-parser';
import { authRoutes } from './auth/auth-routes';
import { validateAppConfig } from './config/validate-config';
import { appConfig } from './config/app-config';

class App {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config() {
    // validate the env config
    validateAppConfig(appConfig);
    // support application/json
    this.app.use(bodyParser.json());
    // auth routing
    this.app.use('/auth', authRoutes);
    // health check
    this.app.get('/ping', (req, res) => {
      res.send('1');
    });
  }

}

export default new App().app;
