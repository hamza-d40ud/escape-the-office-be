import swaggerJsdoc from 'swagger-jsdoc';

const schemas = {
    Error: {
        type: 'object',
        properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string' }
        }
    }
};

const securitySchemes = {
    bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
    }
}; 

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ETO API Documentation',
            version: '1.0.0',
            description: `## Authentication Flows

### Signup Flow
1. User requests an OTP for signup using \`/api/v1/auth/send-otp\`
2. User validates the OTP using \`/api/v1/auth/validate-otp\`
3. Upon successful validation, user signs up using \`/api/v1/auth/signup\`
4. Account status is set to \`PENDING_UPLOAD\`
5. User uploads required documents:
   - \`id_picture\` (required for all users)
   - \`university_id_picture\` (required if \`is_student = true\`)
6. User requests approval using \`/api/v1/auth/request-approval\`
7. Account status changes to \`PENDING_APPROVAL\`

### Login Flow
1. User requests an OTP for login using \`/api/v1/auth/send-otp\`
2. User validates the OTP using \`/api/v1/auth/validate-otp\`
3. Upon successful validation, user receives authentication token

## User Status Flow
- \`PENDING_UPLOAD\`: Initial state after signup, waiting for document uploads
- \`PENDING_APPROVAL\`: Documents uploaded, waiting for admin approval
- \`ACTIVE\`: Account approved and active
- \`REJECTED\`: Account rejected, requires updates
- \`SUSPENDED\`: Account temporarily suspended`,
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Endpoints for user authentication, including signup, login, and OTP verification'
            },
            {
                name: 'Upload',
                description: 'Endpoints for uploading user documents (ID, profile, and university ID pictures)'
            },
            {
                name: 'User',
                description: 'Endpoints for managing user details and information'
            },
            {
                name: 'Admin',
                description: 'Endpoints for admin'
            },
            {
                name: 'Static',
                description: 'Endpoints for static data'
            },
            {
                name: 'Efawateercom',
                description: 'Endpoints for Efawateercom'
            },
            {
                name: 'Locations',
                description: 'Endpoints for locations data'
            },
            {
                name: 'Payments',
                description: 'Endpoints for payments domain'
            },
            {
                name: 'Website',
                description: 'Endpoints for website'
            }

        ],
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
            {
                url: 'https://backend-dev.etojo.com',
                description: 'Development server',
            },
            {
                url: 'https://backend.etojo.com',
                description: 'Production server',
            }
        ],
        components: {
            schemas,
            securitySchemes
        },
    },
    apis: ['./docs/swagger/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs; 