/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { PostRequirement } from './pages/PostRequirement';
import { Auth } from './pages/Auth';
import { SupabaseDemo } from './pages/SupabaseDemo';
import { ProfileSetup } from './pages/ProfileSetup';
import { AdminPanel } from './pages/AdminPanel';
import { AuthProvider } from './components/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/setup-profile" element={<ProfileSetup />} />
            <Route path="/dashboard" element={<Home />} /> {/* Temporary fallback for dashboard */}
            <Route path="/post-requirement" element={<PostRequirement />} />
            <Route path="/supabase-demo" element={<SupabaseDemo />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
