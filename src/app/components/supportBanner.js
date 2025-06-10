'use client';

const SupportBanner = () => {
  return (
    <div className="relative w-full max-w-[1620px] h-96 mx-auto rounded-[20px] bg-zinc-300 overflow-hidden flex items-center justify-center">
      <img
        src="/left-sup.png"
        alt="Left Support"
        className="absolute left-0 top-0 h-full object-cover hidden md:block"
      />

      <img
        src="/right-sup.png"
        alt="Right Support"
        className="absolute right-0 top-0 h-full object-cover hidden md:block"
      />

      <div className="relative z-10 text-center px-6">
        <h2 className="text-4xl font-bold mb-4">Сервис и поддержка</h2>
        <p className="text-lg text-zinc-700">
          Если у вас возникли вопросы, мы всегда рядом.
        </p>
      </div>
    </div>
  );
};

export default SupportBanner;
