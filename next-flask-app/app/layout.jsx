import '../assets/css/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nestjs and Flask App',
  description: 'In Progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`background-animate ${inter.className}`}>{children}</body>
    </html>
  )
}
