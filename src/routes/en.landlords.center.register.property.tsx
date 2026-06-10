import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/center/register/property")({
  head: () => ({
    meta: [
      { title: "Property information · MapleHouse" },
      {
        name: "description",
        content: "Property information step in the MapleHouse landlord center registration flow.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="property" registrationBase="center" />,
});
