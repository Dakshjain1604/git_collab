import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './Components/NavBar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
            <NavBar />
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="border-t border-slate-800/50 mt-auto py-8 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} DMatch. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
