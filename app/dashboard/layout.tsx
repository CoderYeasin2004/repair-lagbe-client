import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar></DashboardSidebar>
      <main className="flex-1 min-w-0 flex flex-col">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
};
export default DashboardLayout