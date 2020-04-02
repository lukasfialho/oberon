import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as path from 'path';
import * as swagger from 'swagger-express-ts';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

/**
 * This is a main App config
 * */
class App {
    /** Create public app to receive Express Application */
    public app: express.Application;

    /** In constructor, are called all methods */
    constructor() {
        this.app = express();
        this._defineEnv();
        this._config();
        // this._mongoSetup();
        // this._routes();
        this._configSwagger();
    }

    /** Here, are set up Cors, Debug log and bodyParser */
    public _config(): void {
        // this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));

        // this.app.use(cors({
        //     'origin': '*',
        //     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        // }));
    }

    /** Here are set up mongo connection */
    // public _mongoSetup(): void {
    //     (<any>mongoose).Promise = global.Promise;
    //     mongoose.set('useFindAndModify', false);
    //     mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});
    //     mongoose.connection.on('connected', () => console.log('Connected with MongoDB: ' + process.env.DB_URI));
    //     mongoose.connection.on('error', (error) => console.log('Error on connection. ' + error));
    //     mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));
    //     process.on('SIGINT', () => {
    //         mongoose.connection.close(() => {
    //             console.log('connection with MongoDB closed.');
    //             process.exit(0);
    //         });
    //     });
    // }

    /** Here are set up all app routes, see [Routes]{@link Routes} to more details */
    // public _routes(): void {
    //     this.app.use('/doc/', express.static(path.join('documentation')));
    //     this.app.use('/', Routes);
    // }

    /** Here are set up all swagger, see more details in [Swegger](http://localhost:3008/api-docs/swagger) */
    private _configSwagger(): void {
        this.app.use('/api-docs/swagger', express.static(path.join('swagger')));
        this.app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
        this.app.use(swagger.express({
            definition : {
                info : {
                    title : 'Appointment Micro Service' ,
                    version : '1.0'
                } ,
                externalDocs : {
                    url : `localhost:${process.env.PORT}/api-docs/swagger`
                },
                securityDefinitions : {
                    Bearer : {
                        type : 'apiKey',
                        in : 'header',
                        name : 'Authorization'
                    }
                },
                basePath: '/'
            }
        }));
    }

    /** Here are set up .env environment, the default is DEV */
    private _defineEnv(): void {
        dotenv.config();

        switch (process.env.NODE_ENV) {
            case 'DEV':
                dotenv.config({path: `${process.cwd()}/.env.dev`});
                break;
            case 'PROD':
                dotenv.config({path: `${process.cwd()}/.env.prod`});
                break;
            case 'QA':
                dotenv.config({path: `${process.cwd()}/.env.qa`});
                break;

            default:
                console.log('Environment not identified. Running default = development. NODE_ENV is set to ', process.env.NODE_ENV);
                dotenv.config({path: `${process.cwd()}/.env.dev`});
        }
    }
}

export default new App().app;
