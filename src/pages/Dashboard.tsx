import { useState, useEffect } from 'react';
import { Upload, Button, Card, notification, Layout, Table } from 'antd';
import { UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { auth, db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { processFile } from '../utils/fileProcessing';
import './dashboard.css';

const Dashboard = () => {
    const [uploading, setUploading] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any[]>([]);

    // Fetch invoices data
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'invoices'));
                const invoices = querySnapshot.docs.map((doc) => doc.data().text);
                setInvoiceData(invoices);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch invoices.',
                    placement: 'topRight',
                });
            }
        };

        fetchInvoices();
    }, []);

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
            // Refresh the table after upload
            setInvoiceData(prevData => [...prevData, extractedText]);
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

    // Define columns for the table, including Sr. No.
    const columns = [
        {
            title: 'Sr. No.',
            width: 120,
            dataIndex: 'serial',
            key: 'serial',
            render: (text: string, record: any, index: number) => index + 1, // Render serial number based on index
        },
        {
            title: 'Invoice Text',
            dataIndex: 'text',
            key: 'text',
            render: (text: string) => <pre>{text}</pre>, // Render text with preformatted style
        },
    ];

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-[#EBF5FF] to-white width">
            <div className="max-w-6xl mx-auto w-full p-8">
                <div className="flex justify-between items-center mb-8 head-width">
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
                <div className="flex space-x-8">
                    <Card className="upload-card flex-grow">
                        <div className="text-center py-8 card-width">
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

                    {/* Table to display invoices with increased height and width */}
                    <div className="w-full" style={{ maxWidth: '70rem' }}>
                        <Table
                            columns={columns}
                            dataSource={invoiceData.map((text, index) => ({ key: index, text }))}
                            pagination={false}
                            scroll={{ y: 480 }}
                            bordered
                            style={{ width: '60rem' }}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
