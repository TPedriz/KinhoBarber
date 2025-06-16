import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <div className="bg-gray-900 text-white min-h-screen">
                <Header />
                <Component {...pageProps} />
            </div>
        </AuthProvider>
    );
}
export default MyApp;