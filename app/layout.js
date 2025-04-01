import { Inter } from 'next/font/google'
import './globals.css'
import "./prism.css"
import ClientProviders from '@/components/ClientProviders' // Adjust the path if needed
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata = {
  title: 'DeepSeek Clone',
  description: 'Full stack project clone of DeepSeek',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>
          <Toaster
            toastOptions={{
              success: { style: { background: 'black', color: 'white' } },
              error: { style: { background: 'black', color: 'white' } },
            }}
          />
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
