// app/TestimonialsSection.tsx
export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Minh Hùng",
      comment: "Tôi rất ấn tượng với AI Triage. Chỉ sau 2 phút, tôi đã biết mình cần đi khám chuyên khoa nào mà không cần mất thời gian tìm kiếm thông tin không chính thống trên mạng. Bác sĩ tư vấn rất tận tâm!",
      stars: 5,
    },
    {
      name: "Hoàng Nam",
      comment: "Trải nghiệm đặt lịch rất mượt mà. Đơn thuốc điện tử và thông tin ca khám đều được tự động lưu trữ trên tài khoản cá nhân, rất tiện lợi để theo dõi sức khỏe gia đình.",
      stars: 5,
    },
    {
      name: "Hồng Vân",
      comment: "Ứng dụng dễ sử dụng, thiết kế trực quan. Nhờ sự gợi ý của AI mà tôi phát hiện sớm tình trạng bệnh và được bác sĩ can thiệp kịp thời. Rất biết ơn đội ngũ!",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Khách hàng nói về chúng tôi
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800 font-bold text-gray-600 dark:text-zinc-300 text-xs">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <div className="text-amber-400 text-xs">
                    {"★".repeat(item.stars)}
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-zinc-400 italic">
                {item.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}