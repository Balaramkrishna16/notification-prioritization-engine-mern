import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
// If this still fails, try: import './../styles/globals.css';
import '../styles/globals.css'; 

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Sidebar is hidden on the Login page (index.js)
  const isLoginPage = router.pathname === '/'; 

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 ${!isLoginPage ? 'ml-24' : ''}`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}