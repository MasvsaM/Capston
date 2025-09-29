import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Heart, Menu, Bell, User } from "lucide-react"

interface MobileHeaderProps {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
  onMenuClick?: () => void
}

export function MobileHeader({ 
  title, 
  showBackButton, 
  onBackClick, 
  onMenuClick 
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={onBackClick} className="p-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-bold text-primary">MarketPet</h1>
            </div>
          )}
        </div>

        {/* Center */}
        {showBackButton && (
          <h2 className="font-semibold text-center flex-1">{title}</h2>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!showBackButton && (
            <>
              <Badge variant="secondary" className="text-xs px-2 py-1">
                Básico
              </Badge>
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="p-2">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}