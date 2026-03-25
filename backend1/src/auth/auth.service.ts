import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "src/schemas/Role.schemas";
import { User, UserDocument } from "src/schemas/User.schemas";
import { UserRole } from "src/schemas/UserRole.schemas";
import { LoginDTO } from "./dto/Login.dto";
import { RegisterDTO } from "./dto/Register.dto";
import jwt from "jsonwebtoken"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
        private jwtService: JwtService
    ) { }
    async login(loginDTO: LoginDTO) {
        //     console.log(req.user)
        //    return await this.jwtService.signAsync({ userId: req.user._id.toString() })
        const { email, password } = loginDTO
        try {
            console.log("burada")
            const user = await this.userModel.findOne({ email }).select("+password") as UserDocument
            if (!user) {
                return {
                    success: false,
                    message: "Böyle bir kullanıcı bulunmamaktadır",
                    statusCode: HttpStatus.OK // İstersen statüyü obje içinde de dönebilirsin
                };
            }

            // Şifre kontrolü
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Şifre yanlış"
                };
            }

            // Aktiflik kontrolü
            if (!user.isActive) {
                return {
                    success: false,
                    message: "Sisteme giriş izniniz bulunmamaktadır.",
                    // Burada 403 Forbidden dönmek daha doğrudur ama sen return ettiğin için catch'e düşmez
                };
            }
            const userRoleId = await this.userRoleModel
                .findOne({ userId: user._id })
                .populate('roleId')

            const roleName = (userRoleId?.roleId as any)?.name
            console.log("Kullanıcının Rolü:", roleName); // 'Yonetici', 'User' vb. çıkar
            const token = await this.jwtService.signAsync({ userId: user._id.toString(), roleName })
            //  const token = this.generateToken(user._id.toString(), roleName);
            return {
                data:{
                 user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: roleName,
                        phoneNumber: user.phoneNumber,
                    },
                    token,
            }}
            // return {
            //     success: true,
            //     message: "Login successful",
            //     data: {
            //         user: {
            //             id: user._id,
            //             firstName: user.firstName,
            //             lastName: user.lastName,
            //             email: user.email,
            //             role: roleName,
            //             phoneNumber: user.phoneNumber,
            //         },
            //         token,
            //     },
            // };

        } catch (error) {
            console.error("Login Hatası:", error); // Hatayı konsolda gör
            throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
        }
    }
    async register(registerDTO: RegisterDTO) {
        try {


            const { firstName, lastName, email, password, phoneNumber, adminCode } = registerDTO;

            // 1. Kullanıcı var mı kontrol et
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new HttpException("Bu email adresi zaten kullanımda", HttpStatus.OK);
            }

            // 2. Admin yetkisi kontrolü
            const isAdmin = adminCode === process.env.ADMIN_CODE;
            const isActive = isAdmin ? true : false; // null yerine false daha sağlıklı olabilir
            const roleSlug = isAdmin ? "Yonetici" : "Kasiyer";

            // 3. Kullanıcıyı oluştur (Mongoose pre-save hook şifreyi hashleyecektir)
            const newUser = await this.userModel.create({
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                isActive: isActive
            });

            // 4. Role tablosundan ilgili rolü bul
            const role = await this.roleModel.findOne({ name: roleSlug });
            if (!role) {
                return{ status:false,message:`${roleSlug} rolü sistemde tanımlı değil`}
            }

            // 5. UserRole ilişkisini oluştur
            await this.userRoleModel.create({
                userId: newUser._id,
                roleId: role._id
            });

            // 6. Token oluşturma (JWT Service enjekte ettiğini varsayarsak)
            //  const token = this.generateToken(newUser._id.toString(), role.name);
            
            // 7. Yanıtı dön (Express'teki res.status yerine return kullanıyoruz)
            if (isAdmin) {
                const token = await this.jwtService.signAsync({ userId: newUser._id.toString(), roleName: role.name })
                return {
                    success: true,
                    message: "Başarıyla kayıt oldunuz.",
                    data: {
                        user: {
                            id: newUser._id,
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            role: roleSlug
                        },
                        token
                    }
                };
            } else {
                return {
                    success: true,
                    message: "Kayıt başarılı. Hesabınız admin onayı bekliyor.",
                    data: {}
                };
            }
        } catch (error) {
            console.error("Register Hatası:", error); // Hatayı konsolda gör
            throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
        }
    }

    async getUsers(req: any) {
        console.log("getusers icindeki user:", req.user)
        const users = await this.userModel
            .find()
            .select('-password')
            .lean();

        const result = await Promise.all(
            users.map(async (user) => {
                const userRole = await this.userRoleModel
                    .findOne({ userId: user._id })
                    .populate('roleId', 'name')
                    .lean();

                const roleId = userRole?.roleId as any;

                return {
                    ...user, // Artık sadece temiz veri gelecek
                    roleName: roleId?.name || 'Rol Atanmamış',
                };
            }),
        );

        return { success: true, data: result };
    }
}