import { Chat } from "@/components/chat/ChatList";
import { Message } from "@/components/chat/ChatView";
import ConversationsLanding from "@/components/chat/ConversationsLanding";
import { ProtectedLayout } from "@/components/ProtectedLayout";

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "Hey! Are we still on for lunch tomorrow?",
    timestamp: "2m ago",
    unreadCount: 2,
    isOnline: true,
    isGroup: false,
  },
  {
    id: "2",
    name: "Team Alpha",
    avatar: "TA",
    lastMessage: "Great work on the presentation everyone!",
    timestamp: "15m ago",
    unreadCount: 0,
    isOnline: false,
    isGroup: true,
    members: ["John Doe", "Jane Smith", "Mike Wilson", "Sarah Johnson"],
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "MC",
    lastMessage: "Thanks for the help with the project",
    timestamp: "1h ago",
    unreadCount: 1,
    isOnline: true,
    isGroup: false,
  },
  {
    id: "4",
    name: "Design Team",
    avatar: "DT",
    lastMessage: "New mockups are ready for review",
    timestamp: "2h ago",
    unreadCount: 0,
    isOnline: false,
    isGroup: true,
    members: ["Emma Wilson", "David Brown", "Lisa Garcia", "Tom Anderson"],
  },
  {
    id: "5",
    name: "Emma Wilson",
    avatar: "EW",
    lastMessage: "See you at the conference!",
    timestamp: "3h ago",
    unreadCount: 0,
    isOnline: false,
    isGroup: false,
  },
  {
    id: "6",
    name: "Marketing Squad",
    avatar: "MS",
    lastMessage: "Campaign results look promising!",
    timestamp: "4h ago",
    unreadCount: 3,
    isOnline: false,
    isGroup: true,
    members: ["Alex Turner", "Rachel Green", "Chris Martin", "Sophie Davis"],
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Hey! How are you doing?",
      timestamp: "10:30 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "2",
      content:
        "Hi Sarah! I'm doing great, thanks for asking. Just enjoying the day here in Goa. How about you?",
      timestamp: "10:31 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "3",
      content:
        "Goa sounds lovely! I'm doing well too, just wrapped up a big project at work.",
      timestamp: "10:32 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "4",
      content:
        "That's fantastic! What kind of project was it, if you don't mind me asking?",
      timestamp: "10:33 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "5",
      content:
        "It was a marketing campaign for a new tech startup. Lots of late nights but super rewarding.",
      timestamp: "10:34 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "6",
      content:
        "Wow, that sounds intense but also really exciting! What was your favorite part of it?",
      timestamp: "10:35 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "7",
      content:
        "Definitely seeing the final creative come to life. And the client was really happy, which is always a bonus.",
      timestamp: "10:36 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "8",
      content:
        "That's awesome! So, any plans to celebrate the successful completion?",
      timestamp: "10:37 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "9",
      content:
        "Thinking of a quiet dinner tonight, maybe with some friends. Nothing too crazy.",
      timestamp: "10:38 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "10",
      content: "Sounds like a perfect way to unwind. Enjoy!",
      timestamp: "10:39 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "11",
      content:
        "Thanks! So, what's new on your end? Anything exciting happening in Goa?",
      timestamp: "10:40 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "12",
      content:
        "Well, the monsoon season is starting to hint at its arrival, so the weather's been a mix of sunny spells and a few refreshing showers.",
      timestamp: "10:41 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "13",
      content:
        "Oh, that sounds beautiful! I've always wanted to visit during monsoon. Is it true the landscape turns incredibly green?",
      timestamp: "10:42 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "14",
      content:
        "Absolutely! Everything just bursts with life. The fields become so vibrant, it's a sight to behold.",
      timestamp: "10:43 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "15",
      content: "That sounds magical. My kind of escape from the city hustle.",
      timestamp: "10:44 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "16",
      content:
        "It really is. Have you been doing any traveling recently, or just focused on work?",
      timestamp: "10:45 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "17",
      content:
        "Not much, honestly. This project consumed most of my time. But I'm hoping to squeeze in a short trip next month.",
      timestamp: "10:46 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "18",
      content: "Anywhere in particular you're thinking of going?",
      timestamp: "10:47 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "19",
      content:
        "Maybe a quick beach getaway, but not sure where yet. Somewhere relaxing, definitely.",
      timestamp: "10:48 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "20",
      content:
        "Well, if you ever consider a monsoon-time Goa trip, let me know! I could give you some local insights.",
      timestamp: "10:49 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "21",
      content:
        "That's super kind of you! I just might take you up on that offer.",
      timestamp: "10:50 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "22",
      content: "Perfect! We could even grab a coffee if you do come down.",
      timestamp: "10:51 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "23",
      content:
        "Sounds like a plan! Speaking of coffee, I should probably get some work done before my dinner plans.",
      timestamp: "10:52 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "24",
      content: "Totally understand! Good luck with that last bit of work.",
      timestamp: "10:53 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "25",
      content: "Thanks! It was good catching up.",
      timestamp: "10:54 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "26",
      content: "You too, Sarah! Have a great evening.",
      timestamp: "10:55 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "27",
      content: "You too! Bye for now.",
      timestamp: "10:56 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "28",
      content: "Bye!",
      timestamp: "10:57 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "29",
      content:
        "Oh, almost forgot! Did you try that new cafe near your place yet?",
      timestamp: "11:00 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
    {
      id: "30",
      content:
        "Not yet, but it's on my list for this week! Heard good things. Have you?",
      timestamp: "11:01 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "31",
      content:
        "Nope, but thinking of checking it out if I'm ever in the area. Let me know what you think!",
      timestamp: "11:02 AM",
      isOwn: false,
      sender: "Sarah Johnson",
    },
  ],
  "2": [
    {
      id: "1",
      content: "Good morning everyone! Ready for today's presentation?",
      timestamp: "9:00 AM",
      isOwn: false,
      sender: "John Doe",
    },
    {
      id: "2",
      content: "Absolutely! I've prepared all the slides.",
      timestamp: "9:05 AM",
      isOwn: true,
      sender: "You",
    },
    {
      id: "3",
      content: "Great! I'll handle the technical demo.",
      timestamp: "9:10 AM",
      isOwn: false,
      sender: "Jane Smith",
    },
    {
      id: "4",
      content: "Perfect teamwork! Let's nail this presentation.",
      timestamp: "9:15 AM",
      isOwn: false,
      sender: "Mike Wilson",
    },
    {
      id: "5",
      content: "Great work on the presentation everyone!",
      timestamp: "15m ago",
      isOwn: false,
      sender: "Sarah Johnson",
    },
  ],
  "3": [
    {
      id: "1",
      content: "Hey, could you help me with the React component?",
      timestamp: "2h ago",
      isOwn: false,
      sender: "Mike Chen",
    },
    {
      id: "2",
      content: "Sure! What specific issue are you facing?",
      timestamp: "2h ago",
      isOwn: true,
      sender: "You",
    },
    {
      id: "3",
      content: "The state management is getting complex.",
      timestamp: "1h ago",
      isOwn: false,
      sender: "Mike Chen",
    },
    {
      id: "4",
      content: "I can help you refactor it. Let me send you some examples.",
      timestamp: "1h ago",
      isOwn: true,
      sender: "You",
    },
    {
      id: "5",
      content: "Thanks for the help with the project",
      timestamp: "1h ago",
      isOwn: false,
      sender: "Mike Chen",
    },
  ],
  "4": [
    {
      id: "1",
      content: "New mockups are ready for review",
      timestamp: "2h ago",
      isOwn: false,
      sender: "Emma Wilson",
    },
  ],
  "5": [
    {
      id: "1",
      content: "Are you attending the tech conference next week?",
      timestamp: "4h ago",
      isOwn: false,
      sender: "Emma Wilson",
    },
    {
      id: "2",
      content: "Yes! I'm really excited about the AI sessions.",
      timestamp: "3h ago",
      isOwn: true,
      sender: "You",
    },
    {
      id: "3",
      content: "See you at the conference!",
      timestamp: "3h ago",
      isOwn: false,
      sender: "Emma Wilson",
    },
  ],
  "6": [
    {
      id: "1",
      content: "The new campaign is performing really well!",
      timestamp: "5h ago",
      isOwn: false,
      sender: "Alex Turner",
    },
    {
      id: "2",
      content: "That's fantastic news! What are the key metrics?",
      timestamp: "4h ago",
      isOwn: true,
      sender: "You",
    },
    {
      id: "3",
      content: "Click-through rate is up 40% and conversions are strong.",
      timestamp: "4h ago",
      isOwn: false,
      sender: "Rachel Green",
    },
    {
      id: "4",
      content: "Campaign results look promising!",
      timestamp: "4h ago",
      isOwn: false,
      sender: "Chris Martin",
    },
  ],
};

export default async function Chats({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  return (
    <div className="min-h-screen flex flex-col bg-background h-[100vh]">
      <ProtectedLayout locale={locale}>
        <ConversationsLanding
          mockChats={mockChats}
          mockMessages={mockMessages}
        />
      </ProtectedLayout>
    </div>
  );
}
