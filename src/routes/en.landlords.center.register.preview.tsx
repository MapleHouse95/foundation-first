import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/center/register/preview")({
  head: () => ({
    meta: [
      { title: "Listing preview · MapleHouse" },
      {
        name: "description",
        content: "Listing preview step in the MapleHouse landlord center registration flow.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="preview" registrationBase="center" />,
});
