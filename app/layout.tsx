import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPath — College Counselling Platform",
  description:
    "One workspace for students and counsellors — tracking applications, deadlines, essays, programs, and every milestone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-cream text-navy antialiased">
        {children}
      </body>
    </html>
  );
}
