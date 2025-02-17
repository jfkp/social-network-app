import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <main className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto pb-20">
                {children}
              </div>
              <Navigation />
            </main>
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
