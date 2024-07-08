import React, { useEffect, useState } from 'react';
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, getMetadata } from 'firebase/storage';

interface ImageUploaderProps {
    folderName: string;
    selectedHabitat: Habitat;
    onClose: () => void;
    onUpdate: (updatedHabitat: Habitat) => void;
}

export interface Habitat {
    id: number;
    name: string;
    description: string;
    comment: string;
    imageUrl: string[];
}

const checkFileExistsInStorage = async (imageFileName: string, folderName: string): Promise<boolean> => {
    const storageRef = ref(storage);
    const fileRef = ref(storageRef, `images/${folderName}/${imageFileName}`);
    try {
        await getMetadata(fileRef);
        return true; // File exists
    } catch (error:any) {
        if (error.code === 'storage/object-not-found') {
            return false; // File does not exist
        }
        console.error('Error checking if file exists in storage:', error);
        throw error; // Rethrow other errors
    }
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ folderName, selectedHabitat, onClose, onUpdate }) => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [currentHabitat, setCurrentHabitat] = useState<Habitat>(selectedHabitat);

    useEffect(() => {
        setCurrentHabitat(selectedHabitat);
    }, [selectedHabitat]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentFile = e.target.files?.[0];
        if (currentFile) {
            setFile(currentFile);
        }
    };

    const uploadImage = async (imageFile: File) => {
        const storageRef = ref(storage);
        const fileRef = ref(storageRef, `images/${folderName}/${imageFile.name}`);

        try {
            setUploading(true);

            // Check if the file exists in storage before attempting to upload
            const fileExists = await checkFileExistsInStorage(imageFile.name, folderName);
            if (fileExists) {
                setError('Image already exists in storage.');
                return null;
            }

            // Proceed with uploading the image if it doesn't already exist
            const snapshot = await uploadBytes(fileRef, imageFile);
            const url = await getDownloadURL(snapshot.ref);
            console.log('Image uploaded successfully:', url);
            return url;
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async () => {
        if (file) {
            try {
                setUploading(true);
                const url = await uploadImage(file);

                if (url) {
                    const updatedImageUrlList = [...(currentHabitat.imageUrl || []), url];
                    const response = await fetch('/api/habitats/updateUrl', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: currentHabitat.id, imageUrl: updatedImageUrlList })
                    });

                    const data = await response.json();
                    if (data.message) {
                        setCurrentHabitat({ ...currentHabitat, imageUrl: updatedImageUrlList });
                        setFile(null);
                        setError(null);
                        console.log('Image URL updated successfully');
                        onUpdate({ ...currentHabitat, imageUrl: updatedImageUrlList }); // Update parent state
                        onClose(); // Close modal or handle closing logic
                    } else {
                        setError(data.error || 'Failed to update imageUrl');
                    }
                }
            } catch (error) {
                console.error('Error updating image URL:', error);
                setError('Failed to update image URL');
            } finally {
                setUploading(false);
            }
        } else {
            setError('Please select an image file.');
        }
    };

    return (
        <div className="mt-4">
            <input type="file" onChange={handleFileChange} />
            {error && <p className="text-red-500">{error}</p>}
            <button
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
        </div>
    );
};

export default ImageUploader;