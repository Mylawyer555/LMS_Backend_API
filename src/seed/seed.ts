import {PrismaClient} from '@prisma/client';
import './UserData.json';
import * as fs from 'fs';
import * as path from 'path';
import { hashPassword } from '../utils/passaword.util';


const prisma = new PrismaClient();

async function main() {
    const userData = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "UserData.json"), "utf-8")
    );

    for(const data of userData){
      await prisma.user.upsert({
        where:{email:data.email},
        update:{},
        create:{
            email:data.email,
            firstname:data.firstname,
            lastname:data.lastname,
            password: await hashPassword(data.password),
            role: data.role,

        },
      });
    }
}

main()
.then(async ()=> {
    await prisma.$disconnect();
})
.catch(
    async (e)=> {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    }
)