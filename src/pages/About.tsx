
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            About AutoMart 🇮🇳
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect vehicle. From premium cars to reliable bikes 
            and quality accessories, we're here to make your automotive journey seamless.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <CardContent className="p-0">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To revolutionize the automotive buying experience in India by providing 
                a transparent, convenient, and trustworthy platform where customers can 
                find their dream vehicles with confidence.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardContent className="p-0">
              <Award className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become India's most trusted automotive marketplace, connecting 
                millions of buyers with quality vehicles and accessories while 
                setting new standards for customer satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Customer First</h4>
                <p className="text-sm text-gray-600">Every decision we make is centered around our customers' needs.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Transparency</h4>
                <p className="text-sm text-gray-600">Honest pricing and clear information for informed decisions.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Award className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Quality</h4>
                <p className="text-sm text-gray-600">Only verified, high-quality vehicles and accessories.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Target className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-gray-600">Continuously improving our platform and services.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Vehicles Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-6">
              Founded in 2024, AutoMart was born from a simple idea: buying a vehicle should be 
              exciting, not stressful. Our founders, passionate about automobiles and technology, 
              noticed the gap between traditional dealerships and modern consumer expectations.
            </p>
            <p className="mb-6">
              Starting with a small team in Bangalore, we set out to create a platform that would 
              combine the trust of traditional car buying with the convenience of modern e-commerce. 
              Today, we're proud to serve customers across India with our comprehensive selection 
              of cars, bikes, and accessories.
            </p>
            <p>
              Every day, we work towards making automotive dreams come true for families and 
              individuals across the country. Join us on this journey as we continue to innovate 
              and serve the automotive community with dedication and integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
