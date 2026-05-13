import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-8">
      <h1 className="text-4xl font-bold text-on-surface mb-8">Terms of Service</h1>
      <p className="text-on-surface-variant mb-6 font-medium">Last updated: May 2024</p>
      
      <section className="flex flex-col gap-8 text-on-surface-variant leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">1. Rental Standards & Extensions</h2>
          <ul className="list-disc pl-6 gap-3 flex flex-col">
            <li>A rental day is considered exactly 24 hours from the time of pickup.</li>
            <li>Any extension beyond the 24-hour period will incur additional hourly or daily charges.</li>
            <li>Full payment of the rental fee must be paid upon turn over of the vehicle.</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">2. Fuel Policy</h2>
          <ul className="list-disc pl-6 gap-3 flex flex-col">
            <li>The rental should be returned with the fuel level at the same level as when it was initially rented.</li>
            <li>Upon return in the Tacloban area, the unit should be refueled at the nearest gas station in Baybay San Jose (Caltex).</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">3. Geographical Restrictions</h2>
          <p className="font-bold text-on-surface mb-2">Bringing the unit outside Region 8 is strictly prohibited.</p>
          <p>Violation of this geographical boundary will result in heavy penalties and may lead to immediate termination of the rental agreement without refund.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">4. Reservations & Cancellations</h2>
          <ul className="list-disc pl-6 gap-3 flex flex-col">
            <li>A 500 PHP reservation fee is required to secure your booking. This fee is deductible from the total rental price.</li>
            <li>Reservations are non-refundable upon cancellation.</li>
            <li>Cancelled bookings will incur a reduced rental fee as a processing cost.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">5. Required Documents</h2>
          <p className="mb-2 font-medium">To pick up your vehicle, you must present two (2) valid IDs:</p>
          <ul className="list-disc pl-6 gap-2 flex flex-col">
            <li>Valid Driver's License (International DL is accepted).</li>
            <li>One (1) Government Issued ID (Passport, UMID, etc.).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">6. Drop-off/Pick-up Rules</h2>
          <ul className="list-disc pl-6 gap-2 flex flex-col">
            <li>Rates provided for drop-off and pick-up are for one-way routes only.</li>
            <li>If you wish to go to a different destination than the one discussed or booked, there will be an additional fee.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
