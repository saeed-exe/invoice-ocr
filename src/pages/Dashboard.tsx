// src/pages/Dashboard.tsx
import { useState } from 'react';
import { Upload, Button, Card, notification, Layout } from 'antd';
import { UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { processFile } from '../utils/fileProcessing';
import './dashboard.css'

const Dashboard = () => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const extractedText = await processFile(file);
            await addDoc(collection(db, 'invoices'), {
                userId: auth.currentUser?.uid,
                text: extractedText,
                timestamp: new Date(),
            });

            notification.success({
                message: 'Success',
                description: 'Invoice processed and stored successfully!',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error processing file:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to process the invoice. Please try again.',
                placement: 'topRight',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-[#EBF5FF] to-white width">
            <div className="max-w-6xl mx-auto w-full p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1565C0]">Invoice Processing</h1>
                    <Button
                        onClick={handleLogout}
                        icon={<LogoutOutlined />}
                        size="large"
                        className="bg-white hover:bg-gray-50"
                    >
                        Logout
                    </Button>
                </div>

                <Card className="upload-card">
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-semibold text-[#2C3E50] mb-4">
                            Upload Your Invoice
                        </h2>
                        <p className="text-[#5A7184] mb-8">
                            Support for PDF and all major image formats
                        </p>
                        <Upload
                            accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff,.tif,.gif"
                            customRequest={({ file }) => handleFileUpload(file as File)}
                            showUploadList={false}
                        >
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                size="large"
                                loading={uploading}
                                className="h-16 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
                                    border: 'none',
                                }}
                            >
                                Click to Upload
                            </Button>
                        </Upload>
                        <p className="text-sm text-gray-500 mt-4">
                            Drag and drop is also supported
                        </p>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;