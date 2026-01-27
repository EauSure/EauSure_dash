'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, RotateCw, Check } from 'lucide-react';

export default function ImageCropper({ imageSrc, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const outputSize = 300;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize, outputSize);

      // Create circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.clip();

      // Calculate scaled dimensions
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Draw rotated and cropped image
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      const cropX = croppedAreaPixels.x * scaleX;
      const cropY = croppedAreaPixels.y * scaleY;
      const cropWidth = croppedAreaPixels.width * scaleX;
      const cropHeight = croppedAreaPixels.height * scaleY;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -outputSize / 2,
        -outputSize / 2,
        outputSize,
        outputSize
      );

      ctx.restore();

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          0.92
        );
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      return null;
    }
  };

  const handleComplete = async () => {
    const croppedImage = await createCroppedImage();
    if (croppedImage) {
      onComplete(croppedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Ajuster votre photo</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden mb-6">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Zoom */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ZoomIn size={16} />
                Zoom
              </label>
              <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <RotateCw size={16} />
                Rotation
              </label>
              <span className="text-xs text-gray-500">{rotation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to create image element
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}
