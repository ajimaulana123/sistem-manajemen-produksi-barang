'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.email === 'admin' && formData.password === 'admin') {
        // Set cookie untuk status login (expires dalam 7 hari)
        Cookies.set('isLoggedIn', 'true', { expires: 7, path: '/' });
        
        // Navigasi ke dashboard
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Username atau password salah!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login Dashboard</CardTitle>
          <CardDescription>
            Masuk ke sistem manajemen produksi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input 
                id="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link 
                href="/dashboard/register" 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Buat akun baru
              </Link>
              <Link 
                href="#" 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Lupa password?
              </Link>
            </div>
<a href="/dashboard">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
</a>
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Demo credentials:</p>
              <p>Username: admin</p>
              <p>Password: admin</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}