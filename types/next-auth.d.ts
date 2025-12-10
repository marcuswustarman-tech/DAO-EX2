import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email?: string;
      image?: string;
      role_status: string;
    }
  }

  interface User {
    id: string;
    name: string;
    email?: string;
    image?: string;
    role_status: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
    role_status: string;
  }
}
