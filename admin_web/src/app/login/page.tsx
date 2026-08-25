import LoginForm from './LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🥥</div>
                    <h1 className="text-3xl font-bold text-white mb-2">CoconutGuard</h1>
                    <p className="text-emerald-100">Admin Portal Login</p>
                </div>

                <LoginForm />

                <div className="mt-6 text-center text-emerald-200/60 text-sm">
                    Secure Access Only
                </div>
            </div>
        </div>
    );
}
