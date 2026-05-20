import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fr")({
  component: Outlet,
});
