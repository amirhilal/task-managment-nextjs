// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcrypt";

// const authOptions = {
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "text" },
//                 password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     return null;
//                 }
//                 const user = await prisma.user.findUnique({
//                     where: { email: credentials.email }
//                 });
//                 if (!user) {
//                     return null;
//                 }
//                 const passwordMatch = await bcrypt.compare(credentials.password, user.password);
//                 if (!passwordMatch) {
//                     return null;
//                 }
//                 return {
//                     id: user.id,
//                     email: user.email,
//                     name: user.name
//                 }
//             }
//         })
//     ],
//     session: {
//         strategy: "jwt"
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             session.user.id = token.id;
//             return session;
//         }
//     },
//     pages: {
//         signIn: "/auth/signin"
//     }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };