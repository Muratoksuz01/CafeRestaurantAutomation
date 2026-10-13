import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/User.schemas';
import { Role, RoleDocument } from '../../schemas/Role.schemas';
import { UserRole, UserRoleDocument } from '../../schemas/UserRole.schemas';


/* @Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>,
    ) { }

    async onApplicationBootstrap() {
        const userCount = await this.userModel.countDocuments();

        if (userCount > 0) {
            console.log('Seed atlandı, veri zaten var');
            return;
        }

        console.log('Seed başlıyor...');

        // 1. Roller
        const roles = await this.roleModel.insertMany([
            { name: 'Yonetici' },
            { name: 'Kasiyer' },
            { name: 'Garson' },
        ]);
        const roleMap = roles.reduce((acc, role) => {
            acc[role.name] = role._id;
            return acc;
        }, {} as Record<string, any>);




        // 2. Kullanıcılar
       const usersData = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@kafe.com',
        password: '123456',
        isActive:true
    },
    {
        firstName: 'Kasiyer',
        lastName: 'User',
        email: 'kasiyer@kafe.com',
        password: '123456',
        isActive:true
    },
    {
        firstName: 'Garson',
        lastName: 'User',
        email: 'garson@kafe.com',
        password: '123456',
        isActive:true
    },
];

// insertMany yerine create kullanıyoruz
const users = await this.userModel.create(usersData);
      

const getUserId = (email: string) => {
            const user = users.find(u => u.email === email);
            if (!user) throw new Error(`${email} bulunamadı`);
            return user._id;
        };


        // 3. UserRole mapping
        await this.userRoleModel.insertMany([
            {
                userId: getUserId('admin@kafe.com'),
                roleId: roleMap['Yonetici'],
            },
            {
                userId: getUserId('kasiyer@kafe.com'),
                roleId: roleMap['Kasiyer'],
            },
            {
                userId: getUserId('garson@kafe.com'),
                roleId: roleMap['Garson'],
            },
        ]);

        console.log('Seed tamamlandı');
    }
} */


@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(UserRole.name)
    private userRoleModel: Model<UserRoleDocument>,
  ) {}

  async runSeed() {
      const userCount = await this.userModel.countDocuments();

        if (userCount > 0) {
            console.log('Seed atlandı, veri zaten var');
            return;
        }

        console.log('Seed başlıyor...');

        // 1. Roller
        const roles = await this.roleModel.insertMany([
            { name: 'Yonetici' },
            { name: 'Kasiyer' },
            { name: 'Garson' },
        ]);
        const roleMap = roles.reduce((acc, role) => {
            acc[role.name] = role._id;
            return acc;
        }, {} as Record<string, any>);




        // 2. Kullanıcılar
       const usersData = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@kafe.com',
        password: '123456',
        isActive:true
    },
    {
        firstName: 'Kasiyer',
        lastName: 'User',
        email: 'kasiyer@kafe.com',
        password: '123456',
        isActive:true
    },
    {
        firstName: 'Garson',
        lastName: 'User',
        email: 'garson@kafe.com',
        password: '123456',
        isActive:true
    },
];

// insertMany yerine create kullanıyoruz
const users = await this.userModel.create(usersData);
      

const getUserId = (email: string) => {
            const user = users.find(u => u.email === email);
            if (!user) throw new Error(`${email} bulunamadı`);
            return user._id;
        };


        // 3. UserRole mapping
        await this.userRoleModel.insertMany([
            {
                userId: getUserId('admin@kafe.com'),
                roleId: roleMap['Yonetici'],
            },
            {
                userId: getUserId('kasiyer@kafe.com'),
                roleId: roleMap['Kasiyer'],
            },
            {
                userId: getUserId('garson@kafe.com'),
                roleId: roleMap['Garson'],
            },
        ]);

        console.log('Seed tamamlandı');
  }
}