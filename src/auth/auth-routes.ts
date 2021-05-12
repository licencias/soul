import { Request, Response, Router } from 'express';
import { authController } from './auth-controller';
import * as cors from 'cors';
import { appConfig } from '../config/app-config';

class AuthRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {

    var corsOptions = {
      origin: [
        // allow deployed UI host
        `https://${appConfig.uiServer}`,
        // allow localhost with http/https and any port number / no port
        /https?:\/\/localhost(:[0-9]{0,5})?/
      ]
    }

    // use cors for all routes
    this.router.all('*', cors(corsOptions));

    this.router.get('/authorize', (req: Request, res: Response) =>
      authController.authorize(req, res)
    );

    this.router.post('/authorize', (req: Request, res: Response) =>
      authController.authorize(req, res)
    );

  }
}

export const authRoutes = new AuthRoutes().router;
