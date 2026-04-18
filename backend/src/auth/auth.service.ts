import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "../schemas/Role.schemas";
import { User, UserDocument } from "../schemas/User.schemas";
import { UserRole } from "../schemas/UserRole.schemas";
import { LoginDTO } from "./dto/Login.dto";
import { RegisterDTO } from "./dto/Register.dto";
import { JwtService } from '@nestjs/jwt';
import { MyLogger } from "../logger/logger.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly logger: MyLogger,

        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
        private jwtService: JwtService
    ) {
        this.logger.setContext("AuthService")

    }
    async login(loginDTO: LoginDTO) {
       
        const { email, password } = loginDTO
        try {
            console.log("burada")
            const user = await this.userModel.findOne({ email }).select("+password") as UserDocument
            if (!user) {
                return {
                    status: false,
                    message: "Böyle bir kullanıcı bulunmamaktadır",
                };
            }

            // Şifre kontrolü
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return {
                    status: false,
                    message: "Şifre yanlış"
                };
            }

            // Aktiflik kontrolü
            if (!user.isActive) {
                return {
                    status: false,
                    message: "Sisteme giriş izniniz bulunmamaktadır.",
                    // Burada 403 Forbidden dönmek daha doğrudur ama sen return ettiğin için catch'e düşmez
                };
            }
            const userRoleId = await this.userRoleModel
                .findOne({ userId: user._id })
                .populate('roleId')

            const roleName = (userRoleId?.roleId as any)?.name
            await this.logger.log("AuthService","auth basarılı ")
            console.log("Kullanıcının Rolü:", roleName); // 'Yonetici', 'User' vb. çıkar
            const token = await this.jwtService.signAsync({ userId: user._id.toString(), roleName })
            return {
                data: {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: roleName,
                        phoneNumber: user.phoneNumber,
                    },
                    token,
                }
            }
         

        } catch (error:any) {
            console.error("Login Hatası:", error); 
            this.logger.error(` Login Hatası: -Data:${JSON.stringify(loginDTO)} -  Hata: ${error.message}`, error.stack)
            throw new InternalServerErrorException("Auth login hata var "); 
        }
    }
    async register(registerDTO: RegisterDTO) {
        try {


            const { firstName, lastName, email, password, phoneNumber, adminCode } = registerDTO;

            // 1. Kullanıcı var mı kontrol et
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                return {status:false,message:"Bu email adresi zaten kullanımda"};
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
                return { status: false, message: `${roleSlug} rolü sistemde tanımlı değil` }
            }

            // 5. UserRole ilişkisini oluştur
            await this.userRoleModel.create({
                userId: newUser._id,
                roleId: role._id
            });
            if (isAdmin) {
                const token = await this.jwtService.signAsync({ userId: newUser._id.toString(), roleName: role.name })
                return {
                    status: true,
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
                    status: true,
                    message: "Kayıt başarılı. Hesabınız admin onayı bekliyor.",
                };
            }
        } catch (error:any) {
            console.error("Register Hatası:", error); 
            this.logger.error(` Hatası: Gelen  -Data:${JSON.stringify(registerDTO)} -  Hata: ${error.message}`, error.stack)
            throw new InternalServerErrorException("Auth register hata var "); 
        }
    }

    async getUsers(req: any) {
        try {

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

            return { status: true, data: result };
        } catch (error:any) {
            this.logger.error(`GetUsers Hatası: -  Hata: ${error.message}`, error.stack)
            throw new InternalServerErrorException("Auth getUserda hata var ");

        }
    }
}