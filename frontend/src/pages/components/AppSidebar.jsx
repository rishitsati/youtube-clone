import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PlaySquare,
  History,
  ListVideo,
  ThumbsUp,
  UserSquare2,
  ChevronRight,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Sidebar, SidebarContent } from "../../components/ui/sidebar";
import { getMe } from "@/api/api";

const SidebarMenuButton = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`w-full flex items-center gap-5 px-3 py-2.5 cursor-pointer outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const SidebarMenuItem = ({ children, isActive = false }) => (
  <div className="px-2">
    <div
      className={`rounded-xl transition-colors ${
        isActive ? "bg-[#272727] font-semibold" : "hover:bg-[#272727]"
      }`}
    >
      {children}
    </div>
  </div>
);

const SidebarSectionTitle = ({ children, hasChevron = false }) => (
  <div className="flex items-center gap-2 px-3 py-2 mt-2 text-base font-bold text-[#f1f1f1] hover:bg-[#272727] rounded-lg mx-2 cursor-pointer transition-colors group">
    <span>{children}</span>
    {hasChevron && <ChevronRight size={18} className="text-[#f1f1f1]" />}
  </div>
);

export function AppSidebar() {
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load user subscriptions if logged in
    if (token) {
      getMe(token)
        .then((res) => {
          if (res.data.subscriptions) {
            setSubscriptions(res.data.subscriptions);
          }
        })
        .catch(() => {
          // User not logged in or token invalid
        });
    }
  }, [token]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Sidebar>
        <SidebarContent className="p-2">
          <div className="m-1">
            {/* Main Navigation */}
            <SidebarMenuItem isActive={isActive("/")}>
              <SidebarMenuButton className="mt-2">
                <Link to="/" className="flex gap-2 text-[#f1f1f1] hover:text-white">
                  <Home size={22} strokeWidth={2.5} />
                  <span className="text-sm">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem isActive={isActive("/trending")}>
              <SidebarMenuButton>
                <Link to="/trending" className="flex gap-2 text-[#f1f1f1] hover:text-white">
                  <TrendingUp size={22} />
                  <span className="text-sm">Trending</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem isActive={isActive("/upload")}>
              <SidebarMenuButton>
                <Link to="/upload" className="flex gap-2 text-[#f1f1f1] hover:text-white">
                  <Upload size={22} />
                  <span className="text-sm">Upload</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <hr className="border-[#3f3f3f] my-3 mx-4" />
            
            {/* Subscriptions */}
            <SidebarSectionTitle hasChevron>Subscriptions</SidebarSectionTitle>
            {token && subscriptions.length > 0 ? (
              subscriptions.slice(0, 5).map((channel) => (
                <SidebarMenuItem key={channel._id} isActive={isActive(`/channel/${channel._id}`)}>
                  <SidebarMenuButton>
                    <Link
                      to={`/channel/${channel._id}`}
                      className="flex gap-2 text-[#f1f1f1] hover:text-white"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500 shrink-0 flex items-center justify-center text-white text-xs font-bold">
                        {channel.channelName?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                      <span className="text-sm truncate">{channel.channelName || "Channel"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <SidebarMenuItem isActive={isActive("/my-subscriptions")}>
                <SidebarMenuButton>
                  <Link
                    to="/my-subscriptions"
                    className="flex gap-2 text-[#f1f1f1] hover:text-white"
                  >
                    <PlaySquare size={22} />
                    <span className="text-sm">My Subscriptions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
            <hr className="border-[#3f3f3f] my-3 mx-4" />
            
            {/* "You" Section */}
            <SidebarSectionTitle hasChevron>You</SidebarSectionTitle>
            <SidebarMenuItem isActive={isActive("/watch-history")}>
              <SidebarMenuButton>
                <Link
                  to="/watch-history"
                  className="flex gap-2 text-[#f1f1f1] hover:text-white"
                >
                  <History size={22} />
                  <span className="text-sm">History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem isActive={isActive("/playlists")}>
              <SidebarMenuButton>
                <Link
                  to="/playlists"
                  className="flex gap-2 text-[#f1f1f1] hover:text-white"
                >
                  <ListVideo size={22} />
                  <span className="text-sm">Playlists</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem isActive={isActive("/my-channel")}>
              <SidebarMenuButton>
                <Link
                  to="/my-channel"
                  className="flex gap-2 text-[#f1f1f1] hover:text-white"
                >
                  <UserSquare2 size={22} />
                  <span className="text-sm">Your videos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {token && (
              <SidebarMenuItem isActive={isActive("/profile")}>
                <SidebarMenuButton>
                  <Link
                    to="/profile"
                    className="flex gap-2 text-[#f1f1f1] hover:text-white"
                  >
                    <ThumbsUp size={22} />
                    <span className="text-sm">Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
