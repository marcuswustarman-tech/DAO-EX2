import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "账号", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 从数据库查询用户
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', credentials.username)
          .eq('is_active', true)
          .single();

        if (error || !user) {
          return null;
        }

        // 验证密码
        const isPasswordValid = await compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          return null;
        }

        // 返回用户信息
        return {
          id: user.id,
          name: user.username,
          role_status: user.role_status,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role_status = user.role_status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role_status = token.role_status as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/console',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
