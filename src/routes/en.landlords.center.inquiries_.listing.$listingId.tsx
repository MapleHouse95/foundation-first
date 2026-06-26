import { createFileRoute } from "@tanstack/react-router";
import { SharedLandlordListingInquiryPage } from "@/components/pages/InquiryFlowPages";

export const Route = createFileRoute("/en/landlords/center/inquiries_/listing/$listingId")({
  head: () => ({
    meta: [
      { title: "Listing inquiries · MapleHouse" },
      {
        name: "description",
        content: "Manage listing inquiries and DMs in the MapleHouse landlord center.",
      },
    ],
  }),
  component: () => {
    const { listingId } = Route.useParams();
    const search = Route.useSearch() as { thread?: string };
    return (
      <SharedLandlordListingInquiryPage
        locale="en"
        listingId={listingId}
        selectedInquiryId={search.thread}
      />
    );
  },
});
