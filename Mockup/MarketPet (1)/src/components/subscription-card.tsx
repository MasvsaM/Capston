import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Check, Crown, Star } from "lucide-react"

interface SubscriptionCardProps {
  name: string
  price: string
  period: string
  features: string[]
  isPopular?: boolean
  isCurrentPlan?: boolean
  onSubscribe?: () => void
}

export function SubscriptionCard({
  name,
  price,
  period,
  features,
  isPopular,
  isCurrentPlan,
  onSubscribe
}: SubscriptionCardProps) {
  return (
    <Card className={`w-full relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Más Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-2 mb-2">
          {name === "Premium" && <Crown className="w-5 h-5 text-yellow-500" />}
          {name}
        </CardTitle>
        <div className="space-y-1">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground">/{period}</span>
          </div>
          {isCurrentPlan && (
            <Badge variant="secondary">Plan Actual</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
          disabled={isCurrentPlan}
          onClick={onSubscribe}
        >
          {isCurrentPlan ? "Plan Actual" : "Suscribirse"}
        </Button>
      </CardContent>
    </Card>
  )
}