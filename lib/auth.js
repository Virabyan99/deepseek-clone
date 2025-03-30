import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email
      const name = user.name
      const image = user.image

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({ name, email, image }),
          }
        )
        if (!response.ok && response.status !== 409) {
          console.error('Failed to create user:', await response.text())
        }
        // If response.status is 409, the user already exists, which is fine
      } catch (error) {
        console.error('Error in signIn callback:', error)
      }
      return true // Always allow sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        // Only runs during initial sign-in
        const email = user.email
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/users?email=${encodeURIComponent(email)}`,
            {
              headers: {
                'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
              },
            }
          )
          const data = await response.json()
          if (data.users && data.users.length > 0) {
            token.id = data.users[0].id // Store database ID in token
          }
        } catch (error) {
          console.error('Error fetching user ID:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id // Add database ID to session
      }
      return session
    },
  },
}
