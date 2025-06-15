import React from 'react';

export default function Contact() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* You can add your contact form or content here */}
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-md p-8">
          <p className="text-lg text-gray-300 mb-6 text-center">
            We'd love to hear from you! Please fill out the form below to get in touch.
          </p>
          {/* Contact Form (replace with your actual form) */}
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
              <input type="text" id="name" className="mt-1 p-2 w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
              <input type="email" id="email" className="mt-1 p-2 w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-200">Message</label>
              <textarea id="message" rows={4} className="mt-1 p-2 w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
