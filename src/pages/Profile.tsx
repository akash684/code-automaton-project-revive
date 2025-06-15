
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      // Fetch from profiles table if exists, else get from user meta
      let meta = user.user_metadata || {};
      setProfile({
        email: user.email,
        ...meta,
      });
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-gray-300">
        <h2 className="font-bold text-2xl mb-2">Profile</h2>
        <p className="text-lg">You are not signed in.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white py-8">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-gray-900 rounded-xl shadow-lg p-7 border border-gray-800">
          <h2 className="font-bold text-3xl mb-5">Profile Details</h2>
          <div className="space-y-4">
            <div>
              <span className="text-blue-200">Email:</span>
              <span className="ml-2 text-white">{profile.email}</span>
            </div>
            {profile.full_name && (
              <div>
                <span className="text-blue-200">Full Name:</span>
                <span className="ml-2 text-white">{profile.full_name}</span>
              </div>
            )}
            {/* Add more fields as necessary */}
          </div>
        </div>
      </div>
    </div>
  );
}
