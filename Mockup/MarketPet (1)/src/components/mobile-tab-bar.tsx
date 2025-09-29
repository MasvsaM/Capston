import { Button } from "./ui/button"
import { Heart, Users, Calendar, Crown } from "lucide-react"

interface MobileTabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  const tabs = [
    { id: "pets", label: "Mascotas", icon: Heart },
    { id: "providers", label: "Servicios", icon: Users },
    { id: "appointments", label: "Citas", icon: Calendar },
    { id: "subscription", label: "Planes", icon: Crown },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`h-full rounded-none flex flex-col gap-1 p-2 ${
                isActive 
                  ? 'text-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs leading-none">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}