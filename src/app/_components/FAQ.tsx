'use client'

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { type FAQItem } from "../_domain/faq";

export function FAQ (props: {items: FAQItem[]}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 py-16" id="faq">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">
            FAQ
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Find answers to common questions about our platform.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-gray-200">
          {props.items.map((item, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {item.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-indigo-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="mt-2 pr-12">
                  <p className="text-base text-gray-500">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};