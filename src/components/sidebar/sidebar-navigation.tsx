
import { Home, PieChart, LineChart, Settings, Menu, X, Send, Gift, Wallet, Activity, Bell, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

function SidebarLink({ href, icon, label, isActive, onClick, isCollapsed }: SidebarLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={cn(
        "sidebar-link",
        isActive && "active",
        isCollapsed ? "justify-center px-0" : ""
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </a>
  );
}

export function SidebarNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  
  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Dispatch custom event for other components to listen to
    const event = new CustomEvent("sidebar-change", { 
      detail: { collapsed: newCollapsedState } 
    });
    window.dispatchEvent(event);
  };
  
  const handleLinkClick = (page: string) => {
    setActivePage(page);
  };

  return (
    <aside
      className={cn(
        "bg-sidebar shadow-retro border-r-2 border-navy h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-20",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b-2 border-navy">
        {!isCollapsed && (
          <span className="text-lg font-bold text-navy flex items-center gap-1">
            <span className="text-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 15.5C9.5 14.12 10.62 13 12 13H16.5C17.88 13 19 14.12 19 15.5C19 16.88 17.88 18 16.5 18H12C10.62 18 9.5 16.88 9.5 15.5Z" fill="#9b87f5"/>
                <path d="M6.5 8.5C6.5 7.12 7.62 6 9 6H13.5C14.88 6 16 7.12 16 8.5C16 9.88 14.88 11 13.5 11H9C7.62 11 6.5 9.88 6.5 8.5Z" fill="#9b87f5"/>
              </svg>
            </span>
            PayPal
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-md hover:bg-secondary transition-colors",
            isCollapsed ? "mx-auto" : "ml-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto custom-scrollbar">
        <div className="mb-2 px-2">
          {!isCollapsed && (
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-50 rounded-md py-2 pl-8 pr-3 text-sm border-2 border-navy focus:outline-none focus:border-purple"
              />
              <span className="absolute left-2.5 top-2.5 text-gray">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#8E9196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          )}
        </div>
        <SidebarLink
          href="#"
          icon={<Home size={18} />}
          label="Dashboard"
          isActive={activePage === "dashboard"}
          onClick={() => handleLinkClick("dashboard")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="#"
          icon={<PieChart size={18} />}
          label="Finance"
          isActive={activePage === "finance"}
          onClick={() => handleLinkClick("finance")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="#"
          icon={<Send size={18} />}
          label="Send and Request"
          isActive={activePage === "send-request"}
          onClick={() => handleLinkClick("send-request")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="#"
          icon={<Gift size={18} />}
          label="Rewards"
          isActive={activePage === "rewards"}
          onClick={() => handleLinkClick("rewards")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="#"
          icon={<Wallet size={18} />}
          label="Wallet"
          isActive={activePage === "wallet"}
          onClick={() => handleLinkClick("wallet")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="#"
          icon={<Activity size={18} />}
          label="Activity"
          isActive={activePage === "activity"}
          onClick={() => handleLinkClick("activity")}
          isCollapsed={isCollapsed}
        />
      </div>
      
      <div className="border-t-2 border-navy">
        <div className="py-2 px-2">
          <SidebarLink
            href="#"
            icon={<Bell size={18} />}
            label="Notifications"
            isActive={activePage === "notifications"}
            onClick={() => handleLinkClick("notifications")}
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            href="#"
            icon={<HelpCircle size={18} />}
            label="Help Center"
            isActive={activePage === "help"}
            onClick={() => handleLinkClick("help")}
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            href="#"
            icon={<Settings size={18} />}
            label="Settings"
            isActive={activePage === "settings"}
            onClick={() => handleLinkClick("settings")}
            isCollapsed={isCollapsed}
          />
        </div>
        
        {!isCollapsed && (
          <div className="p-4 border-t-2 border-navy">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-gray-100 border-2 border-navy flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/32" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Jessica Atlas</p>
                <p className="text-xs text-gray truncate">jessicaatlas@gmail.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
