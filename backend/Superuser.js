const readline = require('readline');
const superUser = require('./models/users');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

// Setting up config file and Connect Mongo DB
dotenv.config({ path: 'backend/config/config.env' });
connectDB();

const credential = new Object();
const fields = ['username','password','confirm password','email']

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getCreds(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, answer => {
            resolve(answer);
        })
    })
}

async function createUser () {
    try {
        const rootuser = await getCreds(`Enter username for root: `);
        const rootpwd = await getCreds(`Enter password for root: `);

        if (rootuser != process.env.ROOT_USER && rootpwd != process.env.ROOT_PASSWORD) {
            console.log('Wrong Username or Password. Type Correctly!');
            process.exit();
        }

        for (const field of fields) {
            if (field !== "confirm password") {
                credential[field] = await getCreds(`Enter ${field}: `);
            } else {
                const field_name = field.split(' ').join('_');
                credential[field_name] = await getCreds(`Enter ${field_name}: `);
                if (credential.password !== credential[field_name]) {
                    console.log("Passwords don't match.");
                    process.exit();
                }
            }
        }

        rl.close();
        credential.role = 'admin';
        delete credential.confirm_password;

        const user = await superUser.create(credential);
        console.log('Super-User is created.', user);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        process.exit();
    }
}

setTimeout( () => createUser(), 2000);