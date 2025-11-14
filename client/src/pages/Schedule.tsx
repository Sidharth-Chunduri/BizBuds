import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MOCK_USER_ID } from "@/lib/mockUser";
import type { Session } from "@shared/schema";

export default function Schedule() {
  const { toast } = useToast();
  const [signedUpSessions, setSignedUpSessions] = useState<string[]>([]);

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const { data: userSignups = [] } = useQuery({
    queryKey: [`/api/users/${MOCK_USER_ID}/signups`],
  });

  useEffect(() => {
    if (userSignups.length > 0) {
      const sessionIds = userSignups.map((signup: any) => signup.sessionId);
      setSignedUpSessions(sessionIds);
    }
  }, [userSignups]);

  const signupMutation = useMutation({
    mutationFn: async ({ sessionId, action }: { sessionId: string; action: "signup" | "cancel" }) => {
      if (action === "signup") {
        return apiRequest("POST", `/api/sessions/${sessionId}/signup`, { userId: MOCK_USER_ID });
      } else {
        return apiRequest("DELETE", `/api/sessions/${sessionId}/signup`, { userId: MOCK_USER_ID });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${MOCK_USER_ID}/signups`] });
    }
  });

  const tutoringSessions = sessions.filter(s => s.type === "tutoring");
  const groupStudySessions = sessions.filter(s => s.type === "group-study");

  const handleSignUp = async (sessionId: string, sessionTitle: string) => {
    const isSignedUp = signedUpSessions.includes(sessionId);
    const action = isSignedUp ? "cancel" : "signup";

    if (isSignedUp) {
      setSignedUpSessions(prev => prev.filter(id => id !== sessionId));
    } else {
      setSignedUpSessions(prev => [...prev, sessionId]);
    }

    try {
      await signupMutation.mutateAsync({ sessionId, action });
      toast({
        title: isSignedUp ? "Removed from session" : "Successfully signed up!",
        description: isSignedUp 
          ? `You've been removed from "${sessionTitle}"`
          : `You're registered for "${sessionTitle}"`,
      });
    } catch (error) {
      if (isSignedUp) {
        setSignedUpSessions(prev => [...prev, sessionId]);
      } else {
        setSignedUpSessions(prev => prev.filter(id => id !== sessionId));
      }
      toast({
        title: "Error",
        description: "Failed to update signup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isSignedUp = (sessionId: string) => signedUpSessions.includes(sessionId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Schedule</h1>
          <p className="text-muted-foreground text-lg">Join live sessions and find study groups near you</p>
        </div>

        <Tabs defaultValue="tutoring" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tutoring" data-testid="tab-tutoring">
              <Video className="h-4 w-4 mr-2" />
              Live Tutoring
            </TabsTrigger>
            <TabsTrigger value="group-study" data-testid="tab-group-study">
              <Users className="h-4 w-4 mr-2" />
              Group Study
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tutoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Live Tutoring Sessions</h2>
              <p className="text-muted-foreground mb-6">Interactive online sessions with expert instructors</p>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-24" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {tutoringSessions.map((session) => (
                  <Card key={session.id} className="hover-elevate">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2" data-testid={`session-${session.id}-title`}>
                            {session.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {session.description}
                          </CardDescription>
                        </div>
                        {isSignedUp(session.id) && (
                          <Badge variant="secondary" className="w-fit">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{session.time}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={isSignedUp(session.id) ? "outline" : "default"}
                            onClick={() => handleSignUp(session.id, session.title)}
                            data-testid={`button-signup-${session.id}`}
                          >
                            {isSignedUp(session.id) ? "Cancel" : "Sign Up"}
                          </Button>
                          {isSignedUp(session.id) && (
                            <Button variant="outline" asChild data-testid={`button-join-${session.id}`}>
                              <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                                Join via Zoom
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="group-study" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Group Study Near You</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupStudySessions.map((session) => (
                    <Card key={session.id} className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1" data-testid={`group-${session.id}-title`}>
                              {session.title}
                            </CardTitle>
                            <CardDescription>
                              {session.location}
                            </CardDescription>
                          </div>
                          {isSignedUp(session.id) && (
                            <Badge variant="secondary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Joined
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{session.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{session.time}</span>
                          </div>
                        </div>
                        <Button
                          variant={isSignedUp(session.id) ? "outline" : "default"}
                          className="w-full"
                          onClick={() => handleSignUp(session.id, session.title)}
                          data-testid={`button-signup-group-${session.id}`}
                        >
                          {isSignedUp(session.id) ? "Leave Group" : "Join Group"}
                        </Button>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Location Map</h2>
                <Card className="h-[600px]">
                  <CardContent className="p-0 h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground font-medium">Map Placeholder</p>
                      <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
