import { DynamicModule, Module } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Module({})
export class AdminModule {
    static async forRootAsync(): Promise<DynamicModule> {
        const { AdminModule } = await import('@adminjs/nestjs');
        const { Database, Resource, getModelByName } = await import(
            '@adminjs/prisma'
        );
        const AdminJS = await import('adminjs');

        AdminJS.default.registerAdapter({ Database, Resource });

        return AdminModule.createAdminAsync({
            imports: [PrismaModule],
            inject: [PrismaService],
            useFactory: (prisma: PrismaService) => ({
                adminJsOptions: {
                    rootPath: '/admin',
                    branding: {
                        companyName: 'usof',
                    },
                    resources: [
                        {
                            resource: {
                                model: getModelByName('User'),
                                client: prisma,
                            },
                            options: {
                                properties: {
                                    avatar: {
                                        isVisible: {
                                            new: false,
                                        },
                                    },
                                    rating: {
                                        isVisible: {
                                            new: false,
                                            edit: false,
                                        },
                                    },
                                    refreshToken: {
                                        isVisible: false,
                                    },
                                },
                                listProperties: [
                                    'id',
                                    'login',
                                    'fullName',
                                    'email',
                                    'rating',
                                    'role',
                                    'emailVerified',
                                ],
                                showProperties: [
                                    'id',
                                    'login',
                                    'fullName',
                                    'avatar',
                                    'email',
                                    'rating',
                                    'role',
                                    'emailVerified',
                                    'createdAt',
                                    'updatedAt',
                                ],
                                actions: {
                                    new: {
                                        before: this.hashPasswordBefore,
                                    },
                                },
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Post'),
                                client: prisma,
                            },
                            options: {
                                properties: {
                                    content: {
                                        isVisible: {
                                            filter: false,
                                        },
                                    },
                                },
                                listProperties: [
                                    'id',
                                    'title',
                                    'author',
                                    'status',
                                    'rating',
                                    'createdAt',
                                ],
                                showProperties: [
                                    'id',
                                    'title',
                                    'author',
                                    'content',
                                    'status',
                                    'rating',
                                    'createdAt',
                                    'updatedAt',
                                ],
                                editProperties: ['status'],
                                actions: {
                                    new: {
                                        isVisible: false,
                                    },
                                },
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Comment'),
                                client: prisma,
                            },
                            options: {
                                properties: {
                                    content: {
                                        isVisible: {
                                            filter: false,
                                        },
                                    },
                                },
                                actions: {
                                    new: {
                                        isVisible: false,
                                    },
                                    edit: {
                                        isVisible: false,
                                    },
                                },
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Category'),
                                client: prisma,
                            },
                            editProperties: ['title', 'description'],
                        },
                        {
                            resource: {
                                model: getModelByName('Like'),
                                client: prisma,
                            },
                        },
                    ],
                },
                auth: {
                    authenticate: async (email: string, password: string) => {
                        const admin = await prisma.user.findUnique({
                            where: {
                                email,
                                role: Role.ADMIN,
                            },
                        });

                        if (!admin) {
                            return null;
                        }

                        const passwordMatches = await bcrypt.compare(
                            password,
                            admin.password,
                        );
                        if (!passwordMatches) {
                            return null;
                        }

                        return { id: `${admin.id}`, email: admin.email };
                    },
                    cookieName: 'adminjs',
                    cookiePassword: 'secret',
                },
                sessionOptions: {
                    resave: true,
                    saveUninitialized: true,
                    secret: 'secret',
                },
            }),
        });
    }

    private static async hashPasswordBefore(req) {
        if (req.payload.password) {
            req.payload.password = await bcrypt.hash(req.payload.password, 10);
        }

        return req;
    }
}
