/**
 * dashboardLayout - Client component that receives server-side data
 * Follows Dashboard1's pattern: server layout fetches data, client layout provides it
 */

'use client'

import React, { createContext, useContext, useState } from 'react'
import { AdminMetaProvider } from '../hooks/useAdminMeta'
import { SidebarProvider, SidebarInset, useSidebarWithSide } from '@/components/ui/sidebar'
import { Sidebar } from './Sidebar'
import { ErrorBoundary } from './ErrorBoundary'
import { DashboardProvider } from '../context/DashboardProvider'
import { RightSidebar } from './dual-sidebar/right-sidebar'
<<<<<<< HEAD
import { FloatingChatBox } from './dual-sidebar/floating-chat-box'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Chat mode context
type ChatMode = 'sidebar' | 'chatbox';

interface ChatModeContextType {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  isFloatingChatVisible: boolean;
  setIsFloatingChatVisible: (visible: boolean) => void;
}

const ChatModeContext = createContext<ChatModeContextType | null>(null);

export function useChatMode() {
  const context = useContext(ChatModeContext);
  if (!context) {
    throw new Error('useChatMode must be used within ChatModeProvider');
  }
  return context;
}
=======
import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
>>>>>>> cb5013d8343afa01a14cfb402ae976bec47abad5

interface DashboardLayoutProps {
  children: React.ReactNode
  adminMeta?: any
  authenticatedItem?: any
}

function FloatingChatButton() {
  const { toggleSidebar, open } = useSidebarWithSide('right')
<<<<<<< HEAD
  const { chatMode, isFloatingChatVisible, setIsFloatingChatVisible } = useChatMode()
  
  const handleClick = () => {
    if (chatMode === 'sidebar') {
      toggleSidebar()
    } else {
      setIsFloatingChatVisible(!isFloatingChatVisible)
    }
  }
  
  const Icon = (chatMode === 'sidebar' && open) || (chatMode === 'chatbox' && isFloatingChatVisible) 
    ? ChevronRight : Sparkles;
  
  return (
    <Button
      onClick={handleClick}
      size="icon"
      className={cn(
        "fixed bottom-3 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
        chatMode === 'sidebar' && open
          ? "right-[calc(30rem+1rem)] bg-background hover:bg-accent" 
          : "right-3"
      )}
    >
      <Icon className="h-5 w-5" />
=======
  const Icon = open ? ChevronRight : Sparkles;
  
  return (
    <Button
      onClick={toggleSidebar}
      size="icon"
      className={cn(
        "fixed bottom-3 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
        open ? "right-[calc(30rem+1rem)] bg-background hover:bg-accent" : "right-3"
      )}
    >
        <Icon 
          
        />
        
>>>>>>> cb5013d8343afa01a14cfb402ae976bec47abad5
    </Button>
  )
}

function DashboardLayoutContent({ children, adminMeta, authenticatedItem }: DashboardLayoutProps) {
<<<<<<< HEAD
  const { chatMode, setChatMode, isFloatingChatVisible, setIsFloatingChatVisible } = useChatMode()
  
=======
>>>>>>> cb5013d8343afa01a14cfb402ae976bec47abad5
  return (
    <>
      <Sidebar adminMeta={adminMeta} user={authenticatedItem} />
      <SidebarInset className="min-w-0">
        {children}
      </SidebarInset>
<<<<<<< HEAD
      {chatMode === 'sidebar' && <RightSidebar side="right" />}
      <FloatingChatButton />
      
      {/* Floating Chat Box */}
      {chatMode === 'chatbox' && (
        <FloatingChatBox
          isVisible={isFloatingChatVisible}
          onClose={() => setIsFloatingChatVisible(false)}
          onModeChange={() => setChatMode('sidebar')}
        />
      )}
=======
      <RightSidebar side="right" />
      <FloatingChatButton />
>>>>>>> cb5013d8343afa01a14cfb402ae976bec47abad5
    </>
  )
}

<<<<<<< HEAD
function ChatModeProvider({ children }: { children: React.ReactNode }) {
  const [chatMode, setChatMode] = useState<ChatMode>('sidebar')
  const [isFloatingChatVisible, setIsFloatingChatVisible] = useState(false)
  
  // Auto-open chat box when switching to chatbox mode
  const handleSetChatMode = (mode: ChatMode) => {
    setChatMode(mode)
    if (mode === 'chatbox') {
      setIsFloatingChatVisible(true)
    }
  }
  
  return (
    <ChatModeContext.Provider value={{
      chatMode,
      setChatMode: handleSetChatMode,
      isFloatingChatVisible,
      setIsFloatingChatVisible
    }}>
      {children}
    </ChatModeContext.Provider>
  )
}

=======
>>>>>>> cb5013d8343afa01a14cfb402ae976bec47abad5
export function DashboardLayout({ children, adminMeta, authenticatedItem }: DashboardLayoutProps) {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <AdminMetaProvider initialData={adminMeta}>
<<<<<<< HEAD
          <ChatModeProvider>
            <SidebarProvider defaultOpenRight={false}>
              <DashboardLayoutContent adminMeta={adminMeta} authenticatedItem={authenticatedItem}>
                {children}
              </DashboardLayoutContent>
            </SidebarProvider>
          </ChatModeProvider>
=======
          <SidebarProvider defaultOpenRight={false}>
            <DashboardLayoutContent adminMeta={adminMeta} authenticatedItem={authenticatedItem}>
              {children}
            </DashboardLayoutContent>
          </SidebarProvider>
>>>>>>> cb5013d8343afa01a14cfb402ae976bec47abad5
        </AdminMetaProvider>
      </DashboardProvider>
    </ErrorBoundary>
  )
}

export default DashboardLayout