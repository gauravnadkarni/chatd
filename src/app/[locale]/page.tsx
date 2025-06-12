import { AuthForms } from "@/components/auth/AuthForms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useTranslations } from "next-intl";

export default function Home() {
  const landingPageTranslations = useTranslations("landingPage");
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Visual Section */}
            <div className="order-2 lg:order-1 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
                  <div className="space-y-4">
                    {/* Mock Chat Interface */}
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-white text-blue-600 px-4 py-2 rounded-2xl rounded-br-md max-w-xs shadow-sm">
                          {landingPageTranslations("messages.message1")}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-2xl rounded-bl-md max-w-xs">
                          {landingPageTranslations("messages.message2")}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-white text-blue-600 px-4 py-2 rounded-2xl rounded-br-md max-w-xs shadow-sm">
                          {landingPageTranslations("messages.message3")}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-2xl rounded-bl-md max-w-xs">
                          {landingPageTranslations("messages.message4")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center max-w-md mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {landingPageTranslations("cta")}
                </h1>
                <p className="text-lg text-white/90">
                  {landingPageTranslations("ctaDescription")}
                </p>
              </div>
            </div>

            {/* Authentication Section */}
            <AuthForms />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
