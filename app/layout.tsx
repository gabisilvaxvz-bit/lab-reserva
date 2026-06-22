import { Geist_Mono, Poppins } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({subsets:['latin'],variable:'--font-sans', weight: ['400', '500', '600']})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", poppins.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }} 
          />  
        </ThemeProvider>
      </body>
    </html>
  )
}
