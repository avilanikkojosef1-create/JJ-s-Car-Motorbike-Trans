import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-8">
      <h1 className="text-4xl font-bold text-on-surface mb-8">Privacy Policy</h1>
      <p className="text-on-surface-variant mb-6 font-medium">Last updated: May 2024</p>
      
      <section className="flex flex-col gap-8 text-on-surface-variant leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you book a vehicle, create an account, or contact us for support. This includes your name, email address, phone number, and driver's license information.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process your bookings, and communicate with you about your rentals.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as required by law or to provide the services you have requested (e.g., insurance processing).</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
        </div>
      </section>
    </div>
  );
}
