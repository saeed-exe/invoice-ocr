// src/utils/fileProcessing.ts
import Tesseract from 'tesseract.js';

export const processFile = async (file: File): Promise<string> => {
    // Convert to jpg if needed
    const imageFile = await convertToJpg(file);

    // Perform OCR
    const result = await Tesseract.recognize(imageFile, 'eng');
    return result.data.text;
};

const convertToJpg = async (file: File): Promise<Blob> => {
    if (file.type === 'image/jpeg') {
        return file;
    }

    // If PDF, convert to jpg using pdf.js
    if (file.type === 'application/pdf') {
        // Implementation of PDF to JPG conversion
        // Using pdf.js or similar library
    }

    // For other image formats, convert to jpg using canvas
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                resolve(blob!);
            }, 'image/jpeg', 0.95);
        };
        img.src = URL.createObjectURL(file);
    });
};

