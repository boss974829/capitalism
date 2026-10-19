import { createFileRoute } from "@tanstack/react-router";
import { FlopApp } from "@/components/flop/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <FlopApp />;
}
