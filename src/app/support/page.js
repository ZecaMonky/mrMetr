import FAQ from "../components/FAQ";
import FeedbackForm from "../components/FeedbackForm";
import SupportBanner from "../components/supportBanner";

const SupportPage = () => {
  return (
    <div className="flex flex-col items-center container mx-auto w-full mt-5 px-4 sm:px-0 sm:mt-10">
      <SupportBanner />
      <FAQ />
      <FeedbackForm />
    </div>
  );
};

export default SupportPage;
