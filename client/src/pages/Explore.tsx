import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart,
  MessageCircle,
  Plus,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MOCK_USER_ID, MOCK_USER_NAME } from "@/lib/mockUser";
import type { Note, Comment } from "@shared/schema";

export default function Explore() {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<string>("recent");
  const [likedNotes, setLikedNotes] = useState<string[]>([]);

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const { data: userLikes = [] } = useQuery({
    queryKey: [`/api/users/${MOCK_USER_ID}/likes`],
  });

  useEffect(() => {
    if (userLikes.length > 0) {
      const noteIds = userLikes.map((like: any) => like.noteId);
      setLikedNotes(noteIds);
    }
  }, [userLikes]);

  const [commentsCache, setCommentsCache] = useState<Record<string, Comment[]>>({});
  const likeMutation = useMutation({
    mutationFn: async ({ noteId, action }: { noteId: string; action: "like" | "unlike" }) => {
      if (action === "like") {
        return apiRequest("POST", `/api/notes/${noteId}/like`, { userId: MOCK_USER_ID });
      } else {
        return apiRequest("DELETE", `/api/notes/${noteId}/like`, { userId: MOCK_USER_ID });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${MOCK_USER_ID}/likes`] });
    }
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; hashtags: string[] }) => {
      return apiRequest("POST", "/api/notes", {
        ...noteData,
        author: MOCK_USER_NAME,
        authorId: MOCK_USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    }
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    content: "",
    hashtags: ""
  });

  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const topContributors = [
    {
      id: "tc1",
      name: "Sarah Miller",
      badge: "Top Contributor",
      notesCount: 23,
      helpfulVotes: 412,
      avatarInitials: "SM"
    },
    {
      id: "tc2",
      name: "Mike Chang",
      badge: "Most Helpful Notes",
      notesCount: 18,
      helpfulVotes: 389,
      avatarInitials: "MC"
    },
    {
      id: "tc3",
      name: "Lisa Chen",
      badge: "Community Favorite",
      notesCount: 15,
      helpfulVotes: 367,
      avatarInitials: "LC"
    }
  ];

  const toggleLike = async (noteId: string) => {
    const isLiked = likedNotes.includes(noteId);
    const action = isLiked ? "unlike" : "like";

    if (isLiked) {
      setLikedNotes(prev => prev.filter(id => id !== noteId));
    } else {
      setLikedNotes(prev => [...prev, noteId]);
    }

    try {
      await likeMutation.mutateAsync({ noteId, action });
    } catch (error) {
      if (isLiked) {
        setLikedNotes(prev => [...prev, noteId]);
      } else {
        setLikedNotes(prev => prev.filter(id => id !== noteId));
      }
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openComments = async (noteId: string) => {
    setSelectedNoteId(noteId);
    setCommentsDialogOpen(true);
    
    if (!commentsCache[noteId]) {
      try {
        const response = await fetch(`/api/notes/${noteId}/comments`);
        if (response.ok) {
          const comments = await response.json();
          setCommentsCache(prev => ({ ...prev, [noteId]: comments }));
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title.trim() || !uploadForm.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in title and content",
        variant: "destructive"
      });
      return;
    }

    const hashtags = uploadForm.hashtags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith("#") ? tag : `#${tag}`);

    try {
      await createNoteMutation.mutateAsync({
        title: uploadForm.title,
        content: uploadForm.content,
        hashtags
      });

      setUploadForm({ title: "", content: "", hashtags: "" });
      setUploadDialogOpen(false);

      toast({
        title: "Note uploaded!",
        description: "Your note has been shared with the community",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === "helpful") {
      return b.likes - a.likes;
    } else if (sortBy === "popular") {
      return (b.likes + b.comments * 2) - (a.likes + a.comments * 2);
    }
    return 0;
  });

  const getAvatarInitials = (author: string) => {
    return author.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Explore</h1>
          <p className="text-muted-foreground text-lg">Discover student notes, share knowledge, and connect with peers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-share-notes">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Your Notes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Share Your Notes</DialogTitle>
                    <DialogDescription>
                      Help the community by sharing your learnings and insights
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-title">Title *</Label>
                      <Input
                        id="upload-title"
                        placeholder="Give your note a clear, descriptive title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        data-testid="input-note-title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-content">Content *</Label>
                      <Textarea
                        id="upload-content"
                        placeholder="Share your knowledge, tips, or experiences..."
                        className="min-h-[150px]"
                        value={uploadForm.content}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, content: e.target.value }))}
                        data-testid="textarea-note-content"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-hashtags">Hashtags</Label>
                      <Input
                        id="upload-hashtags"
                        placeholder="marketing, startups, growth (comma separated)"
                        value={uploadForm.hashtags}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, hashtags: e.target.value }))}
                        data-testid="input-note-hashtags"
                      />
                      <p className="text-sm text-muted-foreground">Separate multiple tags with commas</p>
                    </div>
                    <Button onClick={handleUpload} className="w-full" data-testid="button-upload-note">
                      Upload Note
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start gap-3 mb-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedNotes.map((note) => (
                  <Card key={note.id} className="hover-elevate" data-testid={`note-${note.id}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">{getAvatarInitials(note.author)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{note.author}</p>
                          <p className="text-sm text-muted-foreground">{getRelativeTime(note.createdAt)}</p>
                        </div>
                      {note.helpful && (
                        <Badge variant="secondary" className="flex-shrink-0">
                          <Award className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{note.title}</CardTitle>
                    <CardDescription className="text-base">
                      {note.preview}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.hashtags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(note.id)}
                        className={likedNotes.includes(note.id) ? "text-destructive" : ""}
                        data-testid={`button-like-${note.id}`}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${likedNotes.includes(note.id) ? "fill-current" : ""}`} />
                        {note.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openComments(note.id)}
                        data-testid={`button-comments-${note.id}`}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {note.comments}
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-start gap-3 p-3 rounded-lg hover-elevate" data-testid={`contributor-${contributor.id}`}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">{contributor.avatarInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{contributor.name}</p>
                        <Sparkles className="h-3 w-3 text-warning" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{contributor.badge}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{contributor.notesCount} notes</span>
                        <span>•</span>
                        <span>{contributor.helpfulVotes} helpful votes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["#startups", "#marketing", "#growth", "#finance", "#entrepreneurship", "#lean", "#mvp", "#saas"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover-elevate">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={commentsDialogOpen} onOpenChange={setCommentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Join the discussion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto py-4">
            {selectedNoteId && commentsCache[selectedNoteId]?.map((comment) => (
              <div key={comment.id} className="space-y-2" data-testid={`comment-${comment.id}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {comment.author.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{comment.author}</p>
                      <span className="text-xs text-muted-foreground">{getRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {selectedNoteId && (!commentsCache[selectedNoteId] || commentsCache[selectedNoteId].length === 0) && (
              <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
          <div className="border-t pt-4">
            <Textarea placeholder="Add a comment..." className="mb-3" data-testid="textarea-add-comment" />
            <Button className="w-full" data-testid="button-post-comment">Post Comment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
