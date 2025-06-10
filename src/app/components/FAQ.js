'use client';

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Как оформить заказ?",
    answer:
      "Вы можете оформить заказ через наш сайт, выбрав нужный товар и заполнив форму оформления.",
  },
  {
    question: "Как оплатить заказ?",
    answer:
      "Мы принимаем оплату картами Visa, MasterCard, а также через электронные кошельки.",
  },
  {
    question: "Как получить электронный чек?",
    answer:
      "Электронный чек будет отправлен на вашу почту после подтверждения оплаты.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mt-20 mb-10">
      <h2 className="text-3xl font-semibold text-center mb-10">Частые вопросы</h2>
      <div>
      {faqs.map((item, index) => (
        <div
            key={index}
            className={`p-4 transition-all duration-300 border-t border-gray-300 ${
            index === faqs.length - 1 ? 'border-b' : ''
            }`}
        >
            <button
            onClick={() => toggleIndex(index)}
            className="w-full flex justify-between items-center text-left text-lg font-medium"
            >
            {item.question}
            <ChevronDown
                className={`ml-2 transform transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
                }`}
            />
            </button>
            {openIndex === index && (
            <div className="mt-3 text-gray-600">{item.answer}</div>
            )}
        </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
