import './globals.css'

export const metadata = {
  title: 'Faith Builders Collaborative',
  description: 'Community platform for faith-based organizations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
