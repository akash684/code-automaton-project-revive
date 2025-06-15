import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (type: 'email' | 'otp') => {
    setLoading(true);
    try {
      if (type === 'email') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Signed in successfully');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        toast.success('Check your email for the login link');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="container mx-auto py-20 flex justify-center">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>
          <div className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => handleSignIn('email')}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In with Password'}
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full text-white border-gray-700 hover:bg-gray-700"
                onClick={() => handleSignIn('otp')}
                disabled={loading}
              >
                {loading ? 'Sending Magic Link...' : 'Sign In with Magic Link'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
