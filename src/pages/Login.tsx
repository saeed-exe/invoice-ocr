// src/pages/Login.tsx
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import './dashboard.css'

const Login = () => {
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] to-white flex items-center justify-center px-4 align-center">
            <div className="login-container max-w-md w-full space-y-8 p-8 rounded-xl">
                <div className="text-center">
                    <h2 className="mt-6 text-4xl font-bold text-[#1565C0] tracking-tight">
                        Invoice OCR System
                    </h2>
                    <p className="mt-4 text-lg text-[#2C3E50]">
                        Sign in with Google to continue
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<GoogleOutlined />}
                    size="large"
                    onClick={handleGoogleLogin}
                    className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
                        border: 'none',
                    }}
                >
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
};

export default Login;
