import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "src/schemas/Role.schemas";
import { User, UserDocument } from "src/schemas/User.schemas";
import { UserRole } from "src/schemas/UserRole.schemas";
import { LoginDTO } from "./dto/Login.dto";
import { RegisterDTO } from "./dto/Register.dto";
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
        @InjectModel(Role.name) private roleModel: Model<Role>
    ) { }
    async login(loginDTO: LoginDTO) {
        const { email, password } = loginDTO
        try {
            console.log("burada")
            const user = await this.userModel.findOne({ email }).select("+password") as UserDocument
            if (!user) {
                throw new HttpException(
                    {
                        success: false,
                        message: "Böyle bir kullanıcı bulunmamaktadır"
                    },
                    HttpStatus.OK,
                );
            }
            console.log(user)
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new HttpException(
                    { success: false, message: "Şifre yanlış" },
                    HttpStatus.OK,
                );
            }

            if (!user.isActive) {
                throw new HttpException(
                    {
                        success: false,
                        message: "Sisteme giriş izniniz bulunmamaktadır.",
                    },
                    HttpStatus.FORBIDDEN,
                );
            }
            const userRole = await this.userRoleModel
                .findOne({ userId: user._id })
                .populate<{ roleId: Role }>("roleId");

            const roleName = (userRole?.roleId as any)?.name
            const token = this.generateToken(user._id.toString(), roleName);

            return {
                success: true,
                message: "Login successful",
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
                },
            };

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
                throw new HttpException("Bu email adresi zaten kullanımda", HttpStatus.BAD_REQUEST);
            }

            // 2. Admin yetkisi kontrolü
            const isAdmin = adminCode === process.env.ADMIN_CODE;
            const isActive = isAdmin ? true : false; // null yerine false daha sağlıklı olabilir
            const roleSlug = isAdmin ? "admin" : "user";

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
                throw new HttpException(`${roleSlug} rolü sistemde tanımlı değil`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // 5. UserRole ilişkisini oluştur
            await this.userRoleModel.create({
                userId: newUser._id,
                roleId: role._id
            });

            // 6. Token oluşturma (JWT Service enjekte ettiğini varsayarsak)
            const token = this.generateToken(newUser._id.toString(), role.name);

            // 7. Yanıtı dön (Express'teki res.status yerine return kullanıyoruz)
            if (isAdmin) {
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
    generateToken(userId: string, role: string) {
        return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
    }
}