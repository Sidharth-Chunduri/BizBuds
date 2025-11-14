import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play,
  BookOpen,
  FileText,
  Download,
  ThumbsUp,
  CheckCircle2,
  BookMarked,
  Video as VideoIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Resources() {
  const { toast } = useToast();
  const [helpfulNotes, setHelpfulNotes] = useState<string[]>([]);

  const videos = [
    {
      id: "v1",
      title: "How I Built My First SaaS in 3 Months",
      description: "A student's journey from idea to launch, including mistakes and lessons learned.",
      uploader: "Alex Martinez",
      views: 1250,
      thumbnailColor: "bg-chart-1/20"
    },
    {
      id: "v2",
      title: "Marketing on a $0 Budget",
      description: "Practical strategies for marketing your business without spending money.",
      uploader: "Jordan Lee",
      views: 892,
      thumbnailColor: "bg-chart-2/20"
    },
    {
      id: "v3",
      title: "Pitching to Investors: What Works",
      description: "Real examples from successful fundraising rounds and what made them work.",
      uploader: "Sam Chen",
      views: 2103,
      thumbnailColor: "bg-chart-3/20"
    },
    {
      id: "v4",
      title: "Building a Strong Team Culture",
      description: "Creating an amazing work environment even with limited resources.",
      uploader: "Taylor Brooks",
      views: 645,
      thumbnailColor: "bg-chart-4/20"
    }
  ];

  const lessons = [
    {
      id: "l1",
      title: "The Lean Startup Methodology",
      description: "Learn how to build, measure, and learn quickly to validate your business ideas.",
      tags: ["Entrepreneurship", "Strategy"],
      approved: true
    },
    {
      id: "l2",
      title: "Understanding Your Customer Journey",
      description: "Map out every touchpoint and optimize the customer experience.",
      tags: ["Marketing", "UX"],
      approved: true
    },
    {
      id: "l3",
      title: "Financial Metrics Every Founder Should Know",
      description: "CAC, LTV, burn rate, and other essential metrics explained simply.",
      tags: ["Finance", "Analytics"],
      approved: true
    }
  ];

  const courses = [
    {
      id: "c1",
      title: "Business Fundamentals",
      description: "Master the core concepts of business strategy, finance, and operations.",
      modules: 10,
      progress: 60
    },
    {
      id: "c2",
      title: "Marketing & Sales Mastery",
      description: "Learn digital marketing, content creation, and sales techniques that work.",
      modules: 12,
      progress: 35
    },
    {
      id: "c3",
      title: "Entrepreneurship 101",
      description: "From idea validation to product-market fit and scaling your startup.",
      modules: 8,
      progress: 80
    }
  ];

  const quizzes = [
    {
      id: "q1",
      courseId: "c1",
      title: "Business Strategy Fundamentals",
      questions: 15,
      completed: true
    },
    {
      id: "q2",
      courseId: "c2",
      title: "Intro to Marketing",
      questions: 20,
      completed: true
    },
    {
      id: "q3",
      courseId: "c2",
      title: "Digital Marketing Channels",
      questions: 18,
      completed: false
    },
    {
      id: "q4",
      courseId: "c3",
      title: "Startup Validation",
      questions: 12,
      completed: false
    }
  ];

  const materials = [
    {
      id: "m1",
      title: "Business Plan Template",
      description: "Comprehensive template with examples from successful startups.",
      fileType: "PDF",
      downloads: 3420
    },
    {
      id: "m2",
      title: "Marketing Funnel Cheat Sheet",
      description: "Visual guide to building effective marketing funnels.",
      fileType: "PDF",
      downloads: 2156
    },
    {
      id: "m3",
      title: "Financial Model Spreadsheet",
      description: "Pre-built financial model with instructions and formulas.",
      fileType: "XLSX",
      downloads: 1892
    },
    {
      id: "m4",
      title: "Pitch Deck Examples",
      description: "Collection of successful pitch decks from funded startups.",
      fileType: "PPT",
      downloads: 4521
    }
  ];

  const helpfulNotesData = [
    {
      id: "hn1",
      title: "Key Takeaways from 'Zero to One'",
      author: "Emma Wilson",
      votes: 47
    },
    {
      id: "hn2",
      title: "Growth Hacking Strategies That Actually Work",
      author: "Chris Park",
      votes: 32
    }
  ];

  const toggleHelpful = (noteId: string, noteTitle: string) => {
    if (helpfulNotes.includes(noteId)) {
      setHelpfulNotes(prev => prev.filter(id => id !== noteId));
    } else {
      setHelpfulNotes(prev => [...prev, noteId]);
      toast({
        title: "Marked as helpful!",
        description: `Thank you for voting on "${noteTitle}"`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Resources</h1>
          <p className="text-muted-foreground text-lg">Explore videos, courses, lessons, and downloadable materials</p>
        </div>

        <Tabs defaultValue="videos" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 gap-1">
            <TabsTrigger value="videos" data-testid="tab-videos">Videos</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
            <TabsTrigger value="lessons" data-testid="tab-lessons">Lessons</TabsTrigger>
            <TabsTrigger value="quizzes" data-testid="tab-quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="downloads" data-testid="tab-downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Student Business Stories & Tips</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`video-${video.id}`}>
                    <div className={`aspect-video ${video.thumbnailColor} flex items-center justify-center rounded-t-lg`}>
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {video.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-medium">{video.uploader}</span>
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="hover-elevate">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <BookMarked className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl" data-testid={`course-${course.id}-title`}>
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{course.modules} modules</span>
                          <span className="font-medium text-foreground">{course.progress}% complete</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <Button className="w-full" data-testid={`button-course-${course.id}`}>
                        {course.progress > 0 ? "Continue" : "Start Course"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Approved Lessons & Articles</h2>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <Card key={lesson.id} className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <CardTitle className="text-xl" data-testid={`lesson-${lesson.id}-title`}>
                          {lesson.title}
                        </CardTitle>
                        {lesson.approved && (
                          <Badge variant="secondary">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {lesson.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {lesson.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <Button variant="outline" data-testid={`button-read-${lesson.id}`}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Helpful Notes from Students</h3>
              <div className="space-y-3">
                {helpfulNotesData.map((note) => (
                  <Card key={note.id} className="hover-elevate">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1" data-testid={`note-${note.id}-title`}>
                            {note.title}
                          </p>
                          <p className="text-sm text-muted-foreground">by {note.author}</p>
                        </div>
                        <Button
                          variant={helpfulNotes.includes(note.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleHelpful(note.id, note.title)}
                          data-testid={`button-helpful-${note.id}`}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {note.votes + (helpfulNotes.includes(note.id) ? 1 : 0)}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Quizzes</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1" data-testid={`quiz-${quiz.id}-title`}>
                            {quiz.title}
                          </CardTitle>
                          <CardDescription>
                            {quiz.questions} questions
                          </CardDescription>
                        </div>
                        {quiz.completed && (
                          <Badge variant="secondary">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant={quiz.completed ? "outline" : "default"}
                        className="w-full"
                        data-testid={`button-quiz-${quiz.id}`}
                      >
                        {quiz.completed ? "Retake Quiz" : "Take Quiz"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Downloadable Materials</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {materials.map((material) => (
                  <Card key={material.id} className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-1" data-testid={`material-${material.id}-title`}>
                            {material.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {material.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{material.fileType}</Badge>
                          <span>{material.downloads.toLocaleString()} downloads</span>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-download-${material.id}`}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
