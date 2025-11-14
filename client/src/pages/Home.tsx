import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Users, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const successStory = {
    name: "John Doe",
    story: "Started with zero business knowledge and built a sustainable e-commerce brand that now serves 500+ customers monthly. BizBudz gave me the community, resources, and mentorship I needed to turn my idea into reality.",
    achievement: "Founded EcoStyle - Sustainable Fashion Marketplace"
  };

  const businessOfMonth = {
    name: "GreenTech Solutions",
    description: "A student-led initiative reducing campus carbon footprint through innovative IoT solutions, saving 30% energy costs.",
    tags: ["#sustainability", "#iot", "#socialimpact"]
  };

  const navigationTiles = [
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Track your learning progress",
      path: "/dashboard",
      color: "#459DEF"
    },
    {
      icon: Calendar,
      title: "Schedule",
      description: "Join live sessions",
      path: "/schedule",
      color: "#4567F0"
    },
    {
      icon: BookOpen,
      title: "Resources",
      description: "Explore courses & materials",
      path: "/resources",
      color: "#0533ED"
    },
    {
      icon: Users,
      title: "Explore",
      description: "Connect with students",
      path: "/explore",
      color: "#05C6ED"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <section 
          className="py-16 sm:py-24 relative"
          style={{
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Learn Business Together</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  BizBudz
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                  Your student-focused business learning hub. Master entrepreneurship, marketing, and business fundamentals through live sessions, expert-curated resources, and a supportive community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/join">
                    <Button size="lg" className="w-full sm:w-auto font-semibold" data-testid="button-join-hero">
                      Join Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold" data-testid="button-browse-resources">
                      Browse Resources
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-primary/20 via-brand-secondary/20 to-brand-accent/20 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <TrendingUp className="h-24 w-24 text-primary mx-auto" />
                    <p className="text-2xl font-semibold text-foreground">Building Future Leaders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Student Success Story</h2>
              <p className="text-muted-foreground text-lg">See how BizBudz transforms students into entrepreneurs</p>
            </div>
            
            <Card className="max-w-4xl mx-auto hover-elevate">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">SC</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2" data-testid="text-success-student-name">{successStory.name}</CardTitle>
                    <CardDescription className="text-base font-medium text-primary">
                      {successStory.achievement}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed" data-testid="text-success-story">
                  "{successStory.story}"
                </p>
                <div className="mt-6">
                  <a href="#" className="text-primary font-medium hover:underline inline-flex items-center" data-testid="link-read-more-stories">
                    Read more stories
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">Featured</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Business of the Month</h2>
            </div>
            
            <Card className="max-w-3xl mx-auto hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl" data-testid="text-business-name">{businessOfMonth.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg" data-testid="text-business-description">
                  {businessOfMonth.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {businessOfMonth.tags.map((tag) => (
                    <Badge key={tag} variant="outline" data-testid={`badge-tag-${tag}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Quick Navigation</h2>
              <p className="text-muted-foreground text-lg">Jump right into what you need</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {navigationTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <Link key={tile.path} href={tile.path}>
                    <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-shadow" data-testid={`card-nav-${tile.title.toLowerCase()}`}>
                      <CardHeader>
                        <Icon className="h-10 w-10 mb-3" style={{ color: tile.color }} />
                        <CardTitle className="text-xl">{tile.title}</CardTitle>
                        <CardDescription className="text-base">
                          {tile.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
