import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Session, Note } from '@shared/schema';

// Seed data for Firebase - run this once to populate initial data
export async function seedFirebaseData() {
  try {
    console.log('Seeding Firebase data...');

    // Seed sessions
    const mockSessions: Session[] = [
      {
        id: "t1",
        title: "Marketing Strategy Workshop",
        description: "Learn to create effective marketing campaigns and understand customer acquisition strategies.",
        date: "Monday, Nov 18",
        time: "2:00 PM - 3:30 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "t2",
        title: "Financial Planning for Startups",
        description: "Master the basics of budgeting, forecasting, and managing startup finances.",
        date: "Tuesday, Nov 19",
        time: "4:00 PM - 5:30 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "t3",
        title: "Pitch Deck Masterclass",
        description: "Create compelling pitch decks that attract investors and communicate your vision.",
        date: "Friday, Nov 22",
        time: "1:00 PM - 2:30 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "t4",
        title: "Customer Discovery Workshop",
        description: "Learn interview techniques and frameworks to validate your business ideas.",
        date: "Saturday, Nov 23",
        time: "10:00 AM - 12:00 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "g1",
        title: "Downtown Study Hub",
        description: "Group study opportunity at Central Library",
        location: "Central Library - Room 204",
        address: "123 Main Street, Downtown",
        date: "Weekdays",
        time: "3-6 PM",
        type: "group-study",
        zoomLink: ""
      },
      {
        id: "g2",
        title: "Campus Business Center",
        description: "Group study at Student Union Building",
        location: "Student Union Building",
        address: "University Campus, Building C",
        date: "Mon, Wed, Fri",
        time: "5-8 PM",
        type: "group-study",
        zoomLink: ""
      },
      {
        id: "g3",
        title: "Startup Co-working Space",
        description: "Weekend study sessions",
        location: "Innovation Hub",
        address: "456 Tech Ave, Suite 300",
        date: "Saturdays",
        time: "1-5 PM",
        type: "group-study",
        zoomLink: ""
      }
    ];

    for (const session of mockSessions) {
      await setDoc(doc(db, 'sessions', session.id), session);
    }

    // Seed notes (without IDs - let Firebase generate them)
    const mockNotes = [
      {
        title: "5 Customer Discovery Interview Mistakes to Avoid",
        content: "After conducting 50+ customer interviews, here are the biggest mistakes I made and what I learned from them. First, avoid leading questions that push customers toward the answer you want to hear. Second, don't just talk to friends and family - they'll be too nice. Third, actually listen to what they're saying, not what you want them to say. Fourth, ask about past behavior, not future intentions. Finally, always dig deeper with 'why' questions to understand the real pain points.",
        preview: "After conducting 50+ customer interviews, here are the biggest mistakes I made and what I learned from them...",
        author: "Sarah Miller",
        authorId: "demo-user-1",
        hashtags: ["#customerdev", "#startups", "#lean"],
        likes: 42,
        comments: 2,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        helpful: true
      },
      {
        title: "Growth Hacking Tactics That Got Us to 1000 Users",
        content: "We went from 0 to 1000 users in 6 weeks using these specific growth tactics. First, we created a viral referral program with incentives. Second, we leveraged social media influencers in our niche. Third, we optimized our onboarding flow for maximum conversion. Fourth, we used content marketing to establish thought leadership. Finally, we implemented A/B testing for every major feature.",
        preview: "We went from 0 to 1000 users in 6 weeks using these specific growth tactics. Here's exactly what we did...",
        author: "Mike Chang",
        authorId: "demo-user-2",
        hashtags: ["#growth", "#marketing", "#saas"],
        likes: 87,
        comments: 1,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        helpful: true
      },
      {
        title: "How to Validate Your Business Idea Without Building Anything",
        content: "Validation doesn't require code. Here are 7 ways to test demand before you build a single feature: 1) Landing page with email signup, 2) Social media polls and engagement, 3) Pre-order campaigns, 4) Customer interviews, 5) Competitor analysis, 6) Google Ads validation, 7) MVP prototypes using existing tools.",
        preview: "Validation doesn't require code. Here are 7 ways to test demand before you build a single feature...",
        author: "Emma Torres",
        authorId: "demo-user-3",
        hashtags: ["#validation", "#mvp", "#entrepreneurship"],
        likes: 56,
        comments: 0,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        helpful: false
      }
    ];

    for (const note of mockNotes) {
      await addDoc(collection(db, 'notes'), note);
    }

    console.log('Firebase data seeded successfully!');
  } catch (error) {
    console.error('Error seeding Firebase data:', error);
  }
}

// Utility function to call from browser console
(window as any).seedFirebaseData = seedFirebaseData;

// Also make the Firebase auth service available for testing
import { authService } from './auth';
(window as any).authService = authService;