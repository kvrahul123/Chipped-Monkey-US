/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WhatsappController } from './../controllers/WhatsappController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/UserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TransactionRequestController } from './../controllers/TransactionRequestController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProfileController } from './../controllers/ProfileController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductController } from './../controllers/ProductController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PetLookUpController } from './../controllers/PetLookUpController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PagesController } from './../controllers/PagesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PackageController } from './../controllers/PackageController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MicrochipOrdersController } from './../controllers/MicrochipOrderController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MicrochipController } from './../controllers/MicrochipController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FrontendController } from './../controllers/FrontendController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FileManagerController } from './../controllers/FileManagerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeffraController } from './../controllers/DeffraController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DashboardController } from './../controllers/DashboardController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BlogsController } from './../controllers/BlogsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/AuthController';
import { expressAuthentication } from './../middleware/expressAuthentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "WhatsappTemplate": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "msg_type": {"dataType":"string","required":true},
            "label": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateWhatsappTemplateDto": {
        "dataType": "refObject",
        "properties": {
            "label": {"dataType":"string"},
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "company_name": {"dataType":"string"},
            "company_logo": {"dataType":"string"},
            "account_type": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "otp": {"dataType":"string"},
            "is_sent_otp": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "email_verified_at": {"dataType":"datetime"},
            "title": {"dataType":"string"},
            "surf_name": {"dataType":"string"},
            "emergency_number": {"dataType":"string"},
            "date_of_birth": {"dataType":"string"},
            "address_1": {"dataType":"string"},
            "address_2": {"dataType":"string"},
            "address_3": {"dataType":"string"},
            "company_address": {"dataType":"string"},
            "small_description": {"dataType":"string"},
            "city": {"dataType":"string"},
            "county": {"dataType":"string"},
            "country": {"dataType":"string"},
            "postcode": {"dataType":"string"},
            "password": {"dataType":"string","required":true},
            "status": {"dataType":"string"},
            "encrypt_password": {"dataType":"string"},
            "remember_token": {"dataType":"string"},
            "reset_token": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "reset_token_expires_at": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}]},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionRequest": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "user_id": {"dataType":"double"},
            "transaction_id": {"dataType":"string"},
            "sort_code": {"dataType":"string"},
            "account_number": {"dataType":"string"},
            "requested_amount": {"dataType":"string"},
            "bank_name": {"dataType":"string"},
            "account_holders_name": {"dataType":"string"},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_User_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"double"},"name":{"dataType":"string"},"email":{"dataType":"string"},"type":{"dataType":"string"},"company_name":{"dataType":"string"},"company_logo":{"dataType":"string"},"account_type":{"dataType":"string"},"phone":{"dataType":"string"},"otp":{"dataType":"string"},"is_sent_otp":{"dataType":"string"},"slug":{"dataType":"string"},"email_verified_at":{"dataType":"datetime"},"title":{"dataType":"string"},"surf_name":{"dataType":"string"},"emergency_number":{"dataType":"string"},"date_of_birth":{"dataType":"string"},"address_1":{"dataType":"string"},"address_2":{"dataType":"string"},"address_3":{"dataType":"string"},"company_address":{"dataType":"string"},"small_description":{"dataType":"string"},"city":{"dataType":"string"},"county":{"dataType":"string"},"country":{"dataType":"string"},"postcode":{"dataType":"string"},"password":{"dataType":"string"},"status":{"dataType":"string"},"encrypt_password":{"dataType":"string"},"remember_token":{"dataType":"string"},"reset_token":{"dataType":"string"},"reset_token_expires_at":{"dataType":"datetime"},"created_at":{"dataType":"datetime"},"updated_at":{"dataType":"datetime"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Product": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "title": {"dataType":"string"},
            "slug": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "price": {"dataType":"double"},
            "image": {"dataType":"string"},
            "meta_title": {"dataType":"string"},
            "specifications": {"dataType":"string"},
            "meta_description": {"dataType":"string"},
            "meta_img": {"dataType":"string"},
            "meta_keywords": {"dataType":"string"},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
            "deleted_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateProductRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string"},
            "image": {"dataType":"string"},
            "price": {"dataType":"double"},
            "specifications": {"dataType":"string"},
            "description": {"dataType":"string"},
            "meta_title": {"dataType":"string","required":true},
            "meta_img": {"dataType":"string"},
            "meta_description": {"dataType":"string"},
            "meta_keywords": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pages": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "type": {"dataType":"string"},
            "title": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "content": {"dataType":"string"},
            "faq_content": {"dataType":"string"},
            "meta_title": {"dataType":"string"},
            "meta_description": {"dataType":"string"},
            "keywords": {"dataType":"string"},
            "meta_image": {"dataType":"string"},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
            "deleted_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FaqItem": {
        "dataType": "refObject",
        "properties": {
            "question": {"dataType":"string","required":true},
            "answer": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreatePageRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string"},
            "meta_image": {"dataType":"string"},
            "content": {"dataType":"string"},
            "meta_title": {"dataType":"string","required":true},
            "meta_description": {"dataType":"string"},
            "keywords": {"dataType":"string"},
            "faqs": {"dataType":"array","array":{"dataType":"refObject","ref":"FaqItem"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderStatus": {
        "dataType": "refEnum",
        "enums": ["pending","cancelled","completed"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMicrochipOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "microchip_count": {"dataType":"double","required":true},
            "status": {"ref":"OrderStatus","required":true},
            "id": {"dataType":"double","required":true},
            "email": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateAssignedMicrochipOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "order_id": {"dataType":"string","required":true},
            "assigned_numbers": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "assigned_to": {"dataType":"string"},
            "microchip_count": {"dataType":"double","required":true},
            "OP_id": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Contact": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "user_id": {"dataType":"double"},
            "vendorTxCode": {"dataType":"string"},
            "microchip_number": {"dataType":"string"},
            "pet_keeper": {"dataType":"string"},
            "phone_number": {"dataType":"string"},
            "email": {"dataType":"string"},
            "address": {"dataType":"string"},
            "company_name": {"dataType":"string"},
            "selected_plan": {"dataType":"double"},
            "payment_encrypted_response": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "payment_response": {"dataType":"string"},
            "payment_type": {"dataType":"string"},
            "county": {"dataType":"string"},
            "postcode": {"dataType":"string"},
            "country": {"dataType":"string"},
            "pet_name": {"dataType":"string"},
            "pet_status": {"dataType":"string"},
            "payment_status": {"dataType":"string"},
            "type": {"dataType":"string"},
            "breed": {"dataType":"string"},
            "sex": {"dataType":"string"},
            "color": {"dataType":"string"},
            "dob": {"dataType":"string"},
            "medical_condition": {"dataType":"string"},
            "markings": {"dataType":"string"},
            "otp": {"dataType":"string"},
            "is_claimed": {"dataType":"string"},
            "photo": {"dataType":"string"},
            "form_type": {"dataType":"string"},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Gender": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "title": {"dataType":"double"},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "title": {"dataType":"string"},
            "slug": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "price": {"dataType":"double"},
            "image": {"dataType":"string"},
            "meta_title": {"dataType":"string"},
            "specifications": {"dataType":"string"},
            "meta_description": {"dataType":"string"},
            "meta_img": {"dataType":"string"},
            "meta_keywords": {"dataType":"string"},
            "status": {"dataType":"string"},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
            "deleted_at": {"dataType":"datetime"},
            "image_file_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "images": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartItem": {
        "dataType": "refObject",
        "properties": {
            "productId": {"dataType":"double","required":true},
            "quantity": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Blogs": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "short_description": {"dataType":"string"},
            "description": {"dataType":"string"},
            "image": {"dataType":"string"},
            "meta_title": {"dataType":"string"},
            "meta_img": {"dataType":"string"},
            "meta_description": {"dataType":"string"},
            "meta_keywords": {"dataType":"string"},
            "status": {"dataType":"string","required":true},
            "created_at": {"dataType":"datetime"},
            "updated_at": {"dataType":"datetime"},
            "deleted_at": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateBlogRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string"},
            "image": {"dataType":"string"},
            "short_description": {"dataType":"string"},
            "description": {"dataType":"string"},
            "meta_title": {"dataType":"string","required":true},
            "meta_img": {"dataType":"string"},
            "meta_description": {"dataType":"string"},
            "meta_keywords": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginUserRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "user_type": {"dataType":"string","required":true},
            "microchipNumber": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string"},
            "user_type": {"dataType":"string"},
            "url": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        app.get('/whatsapp/lists',
            ...(fetchMiddlewares<RequestHandler>(WhatsappController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsappController.prototype.getWhatsappLists)),

            async function WhatsappController_getWhatsappLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new WhatsappController();

              await templateService.apiHandler({
                methodName: 'getWhatsappLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/whatsapp/update/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(WhatsappController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsappController.prototype.updateWhatsappTemplate)),

            async function WhatsappController_updateWhatsappTemplate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateWhatsappTemplateDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new WhatsappController();

              await templateService.apiHandler({
                methodName: 'updateWhatsappTemplate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/lists/:type',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersLists)),

            async function UserController_getUsersLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    type: {"in":"path","name":"type","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsersLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/listsdata',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersListsDATA)),

            async function UserController_getUsersListsDATA(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsersListsDATA',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/users/:id/status',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateTransactionRequestStatus)),

            async function UserController_updateTransactionRequestStatus(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"any"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"any","required":true}}},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateTransactionRequestStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/transaction_request/lists',
            ...(fetchMiddlewares<RequestHandler>(TransactionRequestController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionRequestController.prototype.getTransactionRequestLists)),

            async function TransactionRequestController_getTransactionRequestLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TransactionRequestController();

              await templateService.apiHandler({
                methodName: 'getTransactionRequestLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/transaction_request/:id/status',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionRequestController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionRequestController.prototype.updateTransactionRequestStatus)),

            async function TransactionRequestController_updateTransactionRequestStatus(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"any"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"any","required":true}}},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TransactionRequestController();

              await templateService.apiHandler({
                methodName: 'updateTransactionRequestStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/transaction_request/delete/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionRequestController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionRequestController.prototype.deleteTransactionRequest)),

            async function TransactionRequestController_deleteTransactionRequest(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TransactionRequestController();

              await templateService.apiHandler({
                methodName: 'deleteTransactionRequest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/profile/edit',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.getProfileForEdit)),

            async function ProfileController_getProfileForEdit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'getProfileForEdit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/profile/update',
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.updateProfile)),

            async function ProfileController_updateProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"Partial_User_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'updateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/profile/change/password',
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.changePassword)),

            async function ProfileController_changePassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"confirm_password":{"dataType":"string","required":true},"token":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'changePassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/products/lists',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getProductLists)),

            async function ProductController_getProductLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getProductLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/products/orders/lists',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getOrderProductLists)),

            async function ProductController_getOrderProductLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getOrderProductLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/products/create',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.createProducts)),

            async function ProductController_createProducts(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateProductRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'createProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/products/update/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.editBlog)),

            async function ProductController_editBlog(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"CreateProductRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'editBlog',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/products/edit/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getProductForEdit)),

            async function ProductController_getProductForEdit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getProductForEdit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/products/orders/details/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getOrderProductForEdit)),

            async function ProductController_getOrderProductForEdit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getOrderProductForEdit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/products/delete/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.deleteProducts)),

            async function ProductController_deleteProducts(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'deleteProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/products/order/delete/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.deleteOrderProducts)),

            async function ProductController_deleteOrderProducts(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'deleteOrderProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1.0/AAHALookup',
            ...(fetchMiddlewares<RequestHandler>(PetLookUpController)),
            ...(fetchMiddlewares<RequestHandler>(PetLookUpController.prototype.petLookUp)),

            async function PetLookUpController_petLookUp(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"query","name":"id","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PetLookUpController();

              await templateService.apiHandler({
                methodName: 'petLookUp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pages/lists',
            ...(fetchMiddlewares<RequestHandler>(PagesController)),
            ...(fetchMiddlewares<RequestHandler>(PagesController.prototype.getPagesLists)),

            async function PagesController_getPagesLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PagesController();

              await templateService.apiHandler({
                methodName: 'getPagesLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pages/edit/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PagesController)),
            ...(fetchMiddlewares<RequestHandler>(PagesController.prototype.getPageForEdit)),

            async function PagesController_getPageForEdit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PagesController();

              await templateService.apiHandler({
                methodName: 'getPageForEdit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/pages/update/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PagesController)),
            ...(fetchMiddlewares<RequestHandler>(PagesController.prototype.editBlog)),

            async function PagesController_editBlog(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"CreatePageRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PagesController();

              await templateService.apiHandler({
                methodName: 'editBlog',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/package/lists',
            ...(fetchMiddlewares<RequestHandler>(PackageController)),
            ...(fetchMiddlewares<RequestHandler>(PackageController.prototype.getProductLists)),

            async function PackageController_getProductLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PackageController();

              await templateService.apiHandler({
                methodName: 'getProductLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip_orders/create',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.createOrUpdateMicrochipOrder)),

            async function MicrochipOrdersController_createOrUpdateMicrochipOrder(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMicrochipOrderRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'createOrUpdateMicrochipOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip_orders/assigned_microchips/create',
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.createMicrochipAssignedOrder)),

            async function MicrochipOrdersController_createMicrochipAssignedOrder(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateAssignedMicrochipOrderRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'createMicrochipAssignedOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip_orders/lists',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.getMicrochipOrderLists)),

            async function MicrochipOrdersController_getMicrochipOrderLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'getMicrochipOrderLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip_orders/views/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.getMicrochipOrderViews)),

            async function MicrochipOrdersController_getMicrochipOrderViews(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'getMicrochipOrderViews',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip_orders/microchip/lists/:id',
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.getMicrochipOrderListsById)),

            async function MicrochipOrdersController_getMicrochipOrderListsById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'getMicrochipOrderListsById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip_orders/assigned/lists/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.getAssignedMicrochipOrderLists)),

            async function MicrochipOrdersController_getAssignedMicrochipOrderLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'getAssignedMicrochipOrderLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip_orders/assigned/details/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.getAssignedMicrcohipDetails)),

            async function MicrochipOrdersController_getAssignedMicrcohipDetails(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'getAssignedMicrcohipDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/microchip_orders/delete/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.deleteMicrochipOrder)),

            async function MicrochipOrdersController_deleteMicrochipOrder(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'deleteMicrochipOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip_orders/create/transactionDetails',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.createTransaction)),

            async function MicrochipOrdersController_createTransaction(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"string"},"date":{"dataType":"string"},"message":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"transactionRequest_id":{"dataType":"string"}}},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'createTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip_orders/create/implantedMicrochip',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.createImplantedMicrochips)),

            async function MicrochipOrdersController_createImplantedMicrochips(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"string"},"breeder_phone":{"dataType":"string","required":true},"breeder_email":{"dataType":"string","required":true},"breeder_name":{"dataType":"string","required":true},"microchip_number":{"dataType":"string","required":true}}},{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"string"},"breeder_phone":{"dataType":"string","required":true},"breeder_email":{"dataType":"string","required":true},"breeder_name":{"dataType":"string","required":true},"microchip_number":{"dataType":"double","required":true}}}}]},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'createImplantedMicrochips',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip_orders/microchip/implanted/lists',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipOrdersController.prototype.getMicrochipImplantedList)),

            async function MicrochipOrdersController_getMicrochipImplantedList(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipOrdersController();

              await templateService.apiHandler({
                methodName: 'getMicrochipImplantedList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip/lists',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.getMicrochipLists)),

            async function MicrochipController_getMicrochipLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'getMicrochipLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip/payment/lists',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.getMicrochipPaymentLists)),

            async function MicrochipController_getMicrochipPaymentLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'getMicrochipPaymentLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip/payment/invoice/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.downloadInvoice)),

            async function MicrochipController_downloadInvoice(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    res: {"in":"res","name":"500","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'downloadInvoice',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip/create',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.createMicrochip)),

            async function MicrochipController_createMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'createMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip/dashboard/update/:actionType',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.updateDashboardMicrochip)),

            async function MicrochipController_updateDashboardMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'updateDashboardMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/microchip/update/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.updateMicrochip)),

            async function MicrochipController_updateMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'updateMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip/edit/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.getMicrochipForEdit)),

            async function MicrochipController_getMicrochipForEdit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'getMicrochipForEdit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/microchip/delete/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.deleteMicrochip)),

            async function MicrochipController_deleteMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'deleteMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip/implanter/amount/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.getImplanterAmountByUser)),

            async function MicrochipController_getImplanterAmountByUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'getImplanterAmountByUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/microchip/create/implanter/amount',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController)),
            ...(fetchMiddlewares<RequestHandler>(MicrochipController.prototype.createImplantersAmount)),

            async function MicrochipController_createImplantersAmount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MicrochipController();

              await templateService.apiHandler({
                methodName: 'createImplantersAmount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/microchip/create',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.createMicrochip)),

            async function FrontendController_createMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'createMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/microchip/check',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.checkMicrochip)),

            async function FrontendController_checkMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"microchip_number":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'checkMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/gender/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getGenders)),

            async function FrontendController_getGenders(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getGenders',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/implanters/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getImplanters)),

            async function FrontendController_getImplanters(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    postcode: {"in":"query","name":"postcode","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getImplanters',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/pages/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getPages)),

            async function FrontendController_getPages(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"query","name":"id","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getPages',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/blogs/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getMicrochipLists)),

            async function FrontendController_getMicrochipLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getMicrochipLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/blogs/details',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getMicrochipDetails)),

            async function FrontendController_getMicrochipDetails(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    slug: {"in":"query","name":"slug","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getMicrochipDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/implanter/details',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getImplanterDetails)),

            async function FrontendController_getImplanterDetails(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    slug: {"in":"query","name":"slug","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getImplanterDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/transfer/check-microchip',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.checkMicrochipNumber)),

            async function FrontendController_checkMicrochipNumber(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"microchip_number":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'checkMicrochipNumber',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/transfer/verify-otp',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.verifyOtp)),

            async function FrontendController_verifyOtp(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"otp":{"dataType":"string","required":true},"data":{"dataType":"any"},"microchip_number":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'verifyOtp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/products/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getProducts)),

            async function FrontendController_getProducts(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/products/list/:slug',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getProductBySlug)),

            async function FrontendController_getProductBySlug(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getProductBySlug',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/cart/details',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getCartDetails)),

            async function FrontendController_getCartDetails(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"array","array":{"dataType":"refObject","ref":"CartItem"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getCartDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/frontend/order/addresses',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getUserAddresses)),

            async function FrontendController_getUserAddresses(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getUserAddresses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/order/save',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.saveOrder)),

            async function FrontendController_saveOrder(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"cart":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"product_price":{"dataType":"double"},"slug":{"dataType":"string"},"quantity":{"dataType":"double","required":true},"productId":{"dataType":"double","required":true}}},"required":true},"default_address":{"dataType":"boolean"},"discount_amount":{"dataType":"double"},"pincode":{"dataType":"string","required":true},"country":{"dataType":"string","required":true},"city":{"dataType":"string","required":true},"county":{"dataType":"string","required":true},"address":{"dataType":"string","required":true},"phone_number":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'saveOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/microchip/payment',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.microchipPayment)),

            async function FrontendController_microchipPayment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"selected_plan":{"dataType":"string","required":true},"microchip_id":{"dataType":"double","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'microchipPayment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/microchip/subscription',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.microchipSubscription)),

            async function FrontendController_microchipSubscription(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"plan":{"dataType":"enum","enums":["annual"],"required":true},"microchip_id":{"dataType":"double","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'microchipSubscription',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/transaction/request',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.createTransferRequest)),

            async function FrontendController_createTransferRequest(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"account_holders_name":{"dataType":"string","required":true},"bank_name":{"dataType":"string","required":true},"account_number_confirmation":{"dataType":"string","required":true},"account_number":{"dataType":"string","required":true},"requested_amount":{"dataType":"string","required":true},"sort_code":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'createTransferRequest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/transaction/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getTransferRequest)),

            async function FrontendController_getTransferRequest(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getTransferRequest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/registered_microchip/list',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getRegisteredMicrochip)),

            async function FrontendController_getRegisteredMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getRegisteredMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/wallet/amount',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.getWalletAmount)),

            async function FrontendController_getWalletAmount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'getWalletAmount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/frontend/twilio/fetchMicrochip',
            ...(fetchMiddlewares<RequestHandler>(FrontendController)),
            ...(fetchMiddlewares<RequestHandler>(FrontendController.prototype.fetchTwilioMicrochip)),

            async function FrontendController_fetchTwilioMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FrontendController();

              await templateService.apiHandler({
                methodName: 'fetchTwilioMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/filemanager/photos',
            ...(fetchMiddlewares<RequestHandler>(FileManagerController)),
            ...(fetchMiddlewares<RequestHandler>(FileManagerController.prototype.getFiles)),

            async function FileManagerController_getFiles(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FileManagerController();

              await templateService.apiHandler({
                methodName: 'getFiles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/filemanager/upload',
            ...(fetchMiddlewares<RequestHandler>(FileManagerController)),
            ...(fetchMiddlewares<RequestHandler>(FileManagerController.prototype.uploadImage)),

            async function FileManagerController_uploadImage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FileManagerController();

              await templateService.apiHandler({
                methodName: 'uploadImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/microchip/check',
            ...(fetchMiddlewares<RequestHandler>(DeffraController)),
            ...(fetchMiddlewares<RequestHandler>(DeffraController.prototype.checkMicrochip)),

            async function DeffraController_checkMicrochip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    username: {"in":"query","name":"username","dataType":"string"},
                    password: {"in":"query","name":"password","dataType":"string"},
                    chipnumber: {"in":"query","name":"chipnumber","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new DeffraController();

              await templateService.apiHandler({
                methodName: 'checkMicrochip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/dashboard/counts',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getDashboardCounts)),

            async function DashboardController_getDashboardCounts(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getDashboardCounts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/blogs/lists',
            ...(fetchMiddlewares<RequestHandler>(BlogsController)),
            ...(fetchMiddlewares<RequestHandler>(BlogsController.prototype.getMicrochipLists)),

            async function BlogsController_getMicrochipLists(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlogsController();

              await templateService.apiHandler({
                methodName: 'getMicrochipLists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/blogs/create',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BlogsController)),
            ...(fetchMiddlewares<RequestHandler>(BlogsController.prototype.createBlogs)),

            async function BlogsController_createBlogs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateBlogRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlogsController();

              await templateService.apiHandler({
                methodName: 'createBlogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/blogs/update/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BlogsController)),
            ...(fetchMiddlewares<RequestHandler>(BlogsController.prototype.editBlog)),

            async function BlogsController_editBlog(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"CreateBlogRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlogsController();

              await templateService.apiHandler({
                methodName: 'editBlog',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/blogs/edit/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BlogsController)),
            ...(fetchMiddlewares<RequestHandler>(BlogsController.prototype.getBlogForEdit)),

            async function BlogsController_getBlogForEdit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlogsController();

              await templateService.apiHandler({
                methodName: 'getBlogForEdit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/blogs/delete/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BlogsController)),
            ...(fetchMiddlewares<RequestHandler>(BlogsController.prototype.deleteBlogs)),

            async function BlogsController_deleteBlogs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlogsController();

              await templateService.apiHandler({
                methodName: 'deleteBlogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.Login)),

            async function AuthController_Login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"LoginUserRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'Login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/verify-reset-token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyResetToken)),

            async function AuthController_verifyResetToken(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyResetToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/reset-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.resetPassword)),

            async function AuthController_resetPassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"confirm_password":{"dataType":"string","required":true},"password":{"dataType":"string","required":true},"token":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'resetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.forgotPassword)),

            async function AuthController_forgotPassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'forgotPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/register',
            upload.fields([{"name":"implanter_certificate","maxCount":1,"multiple":false}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.Register)),

            async function AuthController_Register(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    first_name: {"in":"formData","name":"first_name","required":true,"dataType":"string"},
                    surf_name: {"in":"formData","name":"surf_name","required":true,"dataType":"string"},
                    email: {"in":"formData","name":"email","required":true,"dataType":"string"},
                    password: {"in":"formData","name":"password","required":true,"dataType":"string"},
                    confirm_password: {"in":"formData","name":"confirm_password","required":true,"dataType":"string"},
                    account_type: {"in":"formData","name":"account_type","required":true,"dataType":"string"},
                    title: {"in":"formData","name":"title","required":true,"dataType":"string"},
                    phone: {"in":"formData","name":"phone","required":true,"dataType":"string"},
                    emergency_number: {"in":"formData","name":"emergency_number","required":true,"dataType":"string"},
                    date_of_birth: {"in":"formData","name":"date_of_birth","required":true,"dataType":"string"},
                    address_1: {"in":"formData","name":"address_1","required":true,"dataType":"string"},
                    address_2: {"in":"formData","name":"address_2","required":true,"dataType":"string"},
                    address_3: {"in":"formData","name":"address_3","required":true,"dataType":"string"},
                    city: {"in":"formData","name":"city","required":true,"dataType":"string"},
                    county: {"in":"formData","name":"county","required":true,"dataType":"string"},
                    country: {"in":"formData","name":"country","required":true,"dataType":"string"},
                    postcode: {"in":"formData","name":"postcode","required":true,"dataType":"string"},
                    breeder_check: {"in":"formData","name":"breeder_check","required":true,"dataType":"string"},
                    implanter_radio: {"in":"formData","name":"implanter_radio","required":true,"dataType":"string"},
                    implanter_pin: {"in":"formData","name":"implanter_pin","dataType":"string"},
                    breeder_licence_no: {"in":"formData","name":"breeder_licence_no","dataType":"string"},
                    breeder_local_authority: {"in":"formData","name":"breeder_local_authority","dataType":"string"},
                    dealer_licence_no: {"in":"formData","name":"dealer_licence_no","dataType":"string"},
                    dealer_local_authority: {"in":"formData","name":"dealer_local_authority","dataType":"string"},
                    local_authority: {"in":"formData","name":"local_authority","dataType":"string"},
                    file: {"in":"formData","name":"implanter_certificate","dataType":"file"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'Register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/auth/validate-token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.ValidateToken)),

            async function AuthController_ValidateToken(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'ValidateToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/send/otp',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.ResetPassword)),

            async function AuthController_ResetPassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"ResetPasswordRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'ResetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/change/password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.changePassword)),

            async function AuthController_changePassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"confirm_password":{"dataType":"string","required":true},"token":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'changePassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
