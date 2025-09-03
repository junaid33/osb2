import { ThemeProvider } from "next-themes";
import Navbar from "@/components/ui/navbar";
import { getAppsData } from "@/actions/getAppsData";

export default async function AlternativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appsResponse = await getAppsData();
  const apps = appsResponse.success ? appsResponse.data : [];
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative min-h-screen">
        {/* Navbar on top */}
        <div className="absolute inset-x-0 top-0 z-20">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <Navbar apps={apps} className="bg-transparent backdrop-blur-0 shadow-none px-0" />
          </div>
        </div>
        
        {/* Content with background */}
        {children}
      </div>
    </ThemeProvider>
  );
}