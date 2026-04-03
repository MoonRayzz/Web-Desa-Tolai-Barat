import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackPageView from "@/components/TrackPageView";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TrackPageView />
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}