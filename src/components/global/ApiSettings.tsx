import React, { useState } from 'react';
import { Check, Edit2, Trash2, Key, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useCFStore } from '../../zustand/useCFStore';
import { motion, AnimatePresence } from 'framer-motion';

const ApiSettings: React.FC = () => {
    const apiKey = useCFStore((state) => state.apiKey);
    const setApiKey = useCFStore((state) => state.setApiKey);
    const [isEditing, setIsEditing] = useState(false);
    const [tempKey, setTempKey] = useState('');

    const validateAndSaveKey = async () => {
        if (!tempKey.trim()) {
            return;
        }

        try {
            const response = await fetch('https://judge0-ce.p.sulu.sh/languages', {
                headers: {
                    'Authorization': `Bearer ${tempKey}`
                }
            });

            if (response.ok) {
                localStorage.setItem('judge0CEApiKey', tempKey);
                setApiKey(tempKey);
                setIsEditing(false);
                setTempKey('');
                toast.success('API key saved successfully');
            } else {
                toast.error('Invalid API key. Please check and try again');
            }
        } catch (error) {
            toast.error('Failed to validate API key. Please check your internet connection');
        }
    };

    const deleteKey = () => {
        localStorage.removeItem('judge0CEApiKey');
        setApiKey('');
        toast.success('API key removed');
    };

    return (
        <motion.div 
            className="w-full py-4 max-w-3xl mx-auto border-t-2 border-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">API Settings</h2>
                <a className='text-blue-500 hover:text-blue-600 flex items-center gap-1' href="https://github.com/MaanasSehgal/Codeforces-Lite?tab=readme-ov-file#how-to-get-api-key" target='_blank'>
                    How to get API key?
                    <ExternalLink size={10} />
                </a>
            </div>
            <motion.div 
                className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 px-3 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Key size={16} className="text-gray-500" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                Judge0 API Key
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {apiKey && (
                                <motion.button
                                    onClick={deleteKey}
                                    className="text-red-500 hover:text-red-600"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Trash2 size={18} />
                                </motion.button>
                            )}
                            <motion.button
                                onClick={() => {
                                    setIsEditing(!isEditing);
                                    setTempKey(apiKey);
                                }}
                                className="text-blue-500 hover:text-blue-600"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Edit2 size={18} />
                            </motion.button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isEditing ? (
                            <motion.div 
                                className="mt-3"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <input
                                    type="password"
                                    placeholder="Enter your Judge0 API key"
                                    value={tempKey}
                                    onChange={(e) => setTempKey(e.target.value)}
                                    className="w-full p-2 mb-3 border bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                />
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTempKey('');
                                        }}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={validateAndSaveKey}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Check size={16} /> Save Key
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            apiKey && (
                                <motion.div 
                                    className="text-sm text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    API key is set and ready to use
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ApiSettings;
