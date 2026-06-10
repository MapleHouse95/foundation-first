import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/center/register/terms")({
  head: () => ({
    meta: [
      { title: "Terms and rules · MapleHouse" },
      {
        name: "description",
        content: "Terms and rules step in the MapleHouse landlord center registration flow.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="terms" registrationBase="center" />,
});
