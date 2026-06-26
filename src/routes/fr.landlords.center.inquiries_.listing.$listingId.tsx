import { createFileRoute } from "@tanstack/react-router";
import { SharedLandlordListingInquiryPage } from "@/components/pages/InquiryFlowPages";

export const Route = createFileRoute("/fr/landlords/center/inquiries_/listing/$listingId")({
  head: () => ({
    meta: [
      { title: "Demandes par logement · MapleHouse" },
      {
        name: "description",
        content: "Gérer les demandes et DM par logement dans le centre propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => {
    const { listingId } = Route.useParams();
    const search = Route.useSearch() as { thread?: string };
    return (
      <SharedLandlordListingInquiryPage
        locale="fr"
        listingId={listingId}
        selectedInquiryId={search.thread}
      />
    );
  },
});
