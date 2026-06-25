export default function RootLayout({children}:{children:React.ReactNode}) {
return <html><body style={{fontFamily:'Arial',maxWidth:900,margin:'40px auto'}}>{children}</body></html>
}