let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database = {};
} else {
     config.database = {
//         hostname: 'localhost',
//         database: 'database-name',
//         user: 'username',
//         password: 'password',
//         port: 5432
    };
}

export { config };
