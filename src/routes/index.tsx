import { createFileRoute } from "@tanstack/react-router";
import { HavenGame } from "@/game/HavenGame";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HavenGame />;
}
