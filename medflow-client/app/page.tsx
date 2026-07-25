// app/page.tsx
import Header from "./Header";
import HeroSection from "./HeroSection";
import ExpertSection from "./ExpertSection";
import ChatWidget from "./ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* 1. Top Navigation */}
      <Header />

      {/* 2. Main Content */}
      <main>
        <HeroSection />
        
        {/* Process Section */}
        <section className="py-16 border-t border-gray-100 dark:border-zinc-800 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Quy trình hoạt động</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
              3 bước đơn giản để nhận được sự chăm sóc y tế tốt nhất với sự hỗ trợ của trí tuệ nhân tạo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
              <div className="p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-bold">1. AI Triage</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Đánh giá triệu chứng thông minh và dự đoán phân loại mức độ ưu tiên.</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">👨‍⚕️</div>
                <h3 className="font-bold">2. Expert Consult</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Đặt lịch ngay với bác sĩ chuyên khoa phù hợp thông qua chat hoặc video call.</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-bold">3. Treatment</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Nhận phác đồ điều trị, đơn thuốc điện tử và hướng dẫn theo dõi sức khỏe chi tiết.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Expert Doctors Section */}
        <ExpertSection />
      </main>

      {/* 4. Floating AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}