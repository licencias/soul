import * as jwt from 'jsonwebtoken';
import { appConfig } from '../config/app-config';

export const createJWTToken = (controlServer: string) => {

    var publicKey: string = appConfig.jwt.keyName;
    var privateKey: jwt.Secret = appConfig.jwt.key;
    
    var smControl = controlServer ? `wss://${appConfig.orchestrationServer}` : '';
    var smControlViaBrowser = appConfig.controlViaBrowser === true;
    var smSessionServer = appConfig.sessionServer;

    var payload: any = {
		'sm-control': smControl,
        'sm-control-via-browser': smControlViaBrowser,
        'sm-session-server': smSessionServer,
        'iss': publicKey
    };

    var options: jwt.SignOptions = {
        algorithm: 'HS256',
        expiresIn: '30m',
    };

    let token = jwt.sign(payload, privateKey, options);

    return token;

}
