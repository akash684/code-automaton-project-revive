
import { Card, CardContent } from "@/components/ui/card";
import { Truck, CheckCircle2, Zap, Clock } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const whyUs = [
  { icon: Truck, text: "Instant Bookings" },
  { icon: CheckCircle2, text: "Verified Listings" },
  { icon: Zap, text: "No Hidden Fees" },
  { icon: Clock, text: "24/7 Support" },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    quote: "Booking my dream car was effortless — the best service I’ve used so far!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Patel",
    quote: "Got my bike delivered on time with zero hassle. Superb experience.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Amit Kumar",
    quote: "Fantastic support team — answered my queries round the clock. Five stars!",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];
export default function TrustSection() {
  return (
    <section className="py-20">
      <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us</h2>
      <div className="flex flex-wrap justify-center gap-7 mb-12">
        {whyUs.map((item) => (
          <Card className="glass morph flex flex-col items-center p-6 border-0 shadow-xl bg-white/10 min-w-[180px] max-w-xs" key={item.text}>
            <item.icon className="w-8 h-8 text-blue-400 mb-2" />
            <span className="font-semibold text-white">{item.text}</span>
          </Card>
        ))}
      </div>
      <div className="max-w-3xl mx-auto">
        <Carousel>
          <CarouselContent>
            {testimonials.map((t, idx) => (
              <CarouselItem key={idx}>
                <Card className="glass morph border-0 shadow-xl bg-white/20 text-center p-8 flex flex-col items-center">
                  <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 ring-4 ring-blue-500/40 object-cover" />
                  <p className="text-xl text-slate-100 font-medium mb-3">"{t.quote}"</p>
                  <span className="font-semibold text-white">{t.name}</span>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
