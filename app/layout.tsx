
import "./globals.css";

export const metadata = {
  title: "Our Family Chat",
  description: "Ask questions about our family",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
