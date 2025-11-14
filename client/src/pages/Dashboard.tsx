import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  CheckCircle2,
  Flame,
  Trophy,
  BookOpen,
  Clock,
  Award,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const stats = [
    {
      label: "Sessions Attended",
      value: 12,
      icon: Calendar,
      color: "text-brand-primary"
    },
    {
      label: "Quizzes Completed",
      value: 7,
      icon: CheckCircle2,
      color: "text-brand-accent"
    },
    {
      label: "Learning Streak",
      value: "5 days",
      icon: Flame,
      color: "text-brand-secondary"
    }
  ];

  const learningPaths = [
    {
      id: "1",
      title: "Business Fundamentals",
      progress: 60,
      modules: 10
    },
    {
      id: "2",
      title: "Marketing & Sales Mastery",
      progress: 35,
      modules: 12
    },
    {
      id: "3",
      title: "Entrepreneurship 101",
      progress: 80,
      modules: 8
    }
  ];

  const recentActivity = [
    {
      id: "1",
      type: "quiz",
      description: "Completed quiz: Intro to Marketing",
      timestamp: "2 hours ago",
      icon: CheckCircle2
    },
    {
      id: "2",
      type: "session",
      description: "Joined session: Startup Basics Live Q&A",
      timestamp: "Yesterday",
      icon: Calendar
    },
    {
      id: "3",
      type: "course",
      description: "Started module: Customer Discovery",
      timestamp: "2 days ago",
      icon: BookOpen
    }
  ];

  const achievements = [
    {
      id: "1",
      title: "Quiz Master",
      description: "Complete 5 quizzes with 80%+ score",
      icon: Trophy,
      unlocked: true
    },
    {
      id: "2",
      title: "Consistent Learner",
      description: "Maintain a 5-day learning streak",
      icon: Flame,
      unlocked: true
    },
    {
      id: "3",
      title: "First Session",
      description: "Attend your first live tutoring session",
      icon: Award,
      unlocked: true
    }
  ];

  const upcomingSessions = [
    {
      id: "1",
      title: "Marketing Strategy Workshop",
      date: "Tomorrow",
      time: "2:00 PM"
    },
    {
      id: "2",
      title: "Pitch Deck Masterclass",
      date: "Friday",
      time: "4:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back! Here's your learning overview</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-foreground" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Learning Paths</h2>
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <Card key={path.id} className="hover-elevate">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1" data-testid={`learning-path-${path.id}`}>
                            {path.title}
                          </CardTitle>
                          <CardDescription>
                            {Math.round((path.progress / 100) * path.modules)} of {path.modules} modules
                          </CardDescription>
                        </div>
                        <Button size="sm" data-testid={`button-continue-${path.id}`}>
                          Continue
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Upcoming Sessions</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-md hover-elevate" data-testid={`upcoming-session-${session.id}`}>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{session.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.date} at {session.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/schedule">
                    <Button variant="outline" className="w-full" data-testid="button-view-all-sessions">
                      View All Sessions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex gap-3" data-testid={`activity-${activity.id}`}>
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Achievements</h2>
              <div className="grid gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={achievement.id} className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-warning" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground" data-testid={`achievement-${achievement.id}`}>
                                {achievement.title}
                              </h3>
                              {achievement.unlocked && (
                                <Badge variant="secondary" className="text-xs">Unlocked</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <Link href="/resources">
                <Button variant="outline" className="w-full" data-testid="button-explore-resources">
                  Explore New Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
