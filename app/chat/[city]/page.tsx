import ChatInterface from "@/components/ChatInterface";

export default async function ChatPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  return <ChatInterface citySlug={city} />;
}

export function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  return {
    title: "City Bucket List — Your Concierge",
  };
}
