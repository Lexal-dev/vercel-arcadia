"use client"
import React, { useEffect, useState } from 'react';
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
            console.log(currentFile);
        }
    };

    const uploadImage = async (imageFile: File) => {
        const storageRef = ref(storage);
        const fileRef = ref(storageRef, `images/${folderName}/${imageFile.name}`);

        try {
            setUploading(true);
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
                        const updatedHabitat = { ...currentHabitat, imageUrl: updatedImageUrlList };
                        setCurrentHabitat(updatedHabitat);
                        setFile(null);
                        setError(null);
                        console.log('Image URL updated successfully');
                        onUpdate(updatedHabitat);
                        onClose();
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