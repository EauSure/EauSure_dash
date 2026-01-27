import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Use relative path for same-origin API calls
const API_URL = '/api';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          if (data.token && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              avatar: data.user.avatar,
              phone: data.user.phone,
              organization: data.user.organization,
              isProfileComplete: data.user.isProfileComplete,
              accessToken: data.token,
            };
          }

          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        // Don't store avatar in token to avoid header size issues
        token.phone = user.phone;
        token.organization = user.organization;
        token.isProfileComplete = user.isProfileComplete;
        token.accessToken = user.accessToken;
      }
      
      // Handle session update (excluding avatar to prevent header overflow)
      if (trigger === 'update' && session?.user) {
        const { avatar, ...userData } = session.user;
        token = { ...token, ...userData };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        // Avatar will be fetched separately to avoid session size issues
        session.user.phone = token.phone;
        session.user.organization = token.organization;
        session.user.isProfileComplete = token.isProfileComplete;
        session.user.token = token.accessToken;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  trustHost: true,
});
