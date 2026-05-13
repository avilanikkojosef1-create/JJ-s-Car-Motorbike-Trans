import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "What are the requirements to rent a vehicle?",
      a: "You must provide two (2) valid IDs: your Driver's License (International IDs are accepted) and one (1) other government-issued ID."
    },
    {
      q: "Is there a reservation fee?",
      a: "Yes, a 500 PHP reservation fee is required to secure your booking. This amount is deductible from your total rental fee but is non-refundable if you cancel."
    },
    {
      q: "What is your fuel policy?",
      a: "The vehicle should be returned with the same fuel level as when it was rented. For returns in Tacloban, please refuel at the Caltex station in Baybay San Jose."
    },
    {
      q: "Where can I drive the rental vehicle?",
      a: "Driving outside Region 8 is strictly prohibited. Violations will incur penalties as per our terms of service."
    },
    {
      q: "How is a 'rental day' calculated?",
      a: "A day is calculated as a 24-hour period. Any extension beyond this period will result in additional charges."
    },
    {
      q: "What is your cancellation policy?",
      a: "Reservations are non-refundable upon cancellation, but you will only incur a reduced rental fee."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-24 px-8">
      <h1 className="text-4xl font-bold text-on-surface mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {faqs.map((faq, index) => (
          <div key={index} className="glass-card p-8">
            <h3 className="text-xl font-bold text-on-surface mb-4">{faq.q}</h3>
            <p className="text-on-surface-variant leading-relaxed font-bold">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
