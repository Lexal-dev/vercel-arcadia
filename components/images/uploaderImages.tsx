import React, { useEffect, useState } from 'react';
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, getMetadata } from 'firebase/storage';

interface ImageUploaderProps<T> {
    folderName: string;
    selectedItem: T;
    onClose: () => void;
    onUpdate: (updatedItem: T) => void;
    fieldToUpdate: keyof T; // Champ spécifique à mettre à jour dans l'objet T (comme 'imageUrl')
}

const checkFileExistsInStorage = async (imageFileName: string, folderName: string): Promise<boolean> => {
    const storageRef = ref(storage);
    const fileRef = ref(storageRef, `images/${folderName}/${imageFileName}`);
    try {
        await getMetadata(fileRef);
        return true; // Le fichier existe
    } catch (error:any) {
        if (error.code === 'storage/object-not-found') {
            return false; // Le fichier n'existe pas
        }
        console.error('Error checking if file exists in storage:', error);
        throw error; // Rethrow other errors
    }
};

const ImageUploader = <T extends { id: number; [key: string]: any }>({ folderName, selectedItem, onClose, onUpdate, fieldToUpdate }: ImageUploaderProps<T>) => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [currentItem, setCurrentItem] = useState<T>(selectedItem);

    useEffect(() => {
        setCurrentItem(selectedItem);
    }, [selectedItem]);

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

            // Vérifier si le fichier existe dans le stockage avant de tenter de le télécharger
            const fileExists = await checkFileExistsInStorage(imageFile.name, folderName);
            if (fileExists) {
                setError('Image already exists in storage.');
                return null;
            }

            // Procéder au téléchargement de l'image si elle n'existe pas déjà
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
                    const updatedFieldList = [...(currentItem[fieldToUpdate] || []), url];
                    const response = await fetch(`/api/${folderName}/updateUrl`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: currentItem.id, [fieldToUpdate]: updatedFieldList })
                    });

                    const data = await response.json();
                    if (data.message) {
                        setCurrentItem({ ...currentItem, [fieldToUpdate]: updatedFieldList });
                        setFile(null);
                        setError(null);
                        console.log('Image URL updated successfully');
                        onUpdate({ ...currentItem, [fieldToUpdate]: updatedFieldList }); // Mettre à jour l'état parent
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
        <div className="mt-4 flex flex-col w-full">
            <input type="file" onChange={handleFileChange}/>
            {error && <p className="text-red-500">{error}</p>}
            <div className='flex justify-center'>
                <button
                    className="mt-2 bg-muted hover:bg-background text-white font-bold py-2 px-4 rounded"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : "Envoyer l'image"}
                </button>                
            </div>

        </div>
    );
};

export default ImageUploader;