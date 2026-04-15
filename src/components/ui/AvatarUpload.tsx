'use client';

import { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { Avatar } from './Avatar';

export interface AvatarUploadProps {
  currentImage?: string;
  fallback: string;
  onImageChange: (imageData: string | null) => void;
  size?: 'md' | 'lg' | 'xl';
}

// Helper function to create cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set canvas size to the cropped area
  const size = Math.max(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  // Draw circular clip
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Calculate rotation
  const radians = (rotation * Math.PI) / 180;

  // Translate to center, rotate, and translate back
  ctx.translate(size / 2, size / 2);
  ctx.rotate(radians);
  ctx.translate(-size / 2, -size / 2);

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  // Return as base64
  return canvas.toDataURL('image/jpeg', 0.9);
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

export function AvatarUpload({
  currentImage,
  fallback,
  onImageChange,
  size = 'xl',
}: AvatarUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsModalOpen(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onImageChange(croppedImage);
      setIsModalOpen(false);
      setImageSrc(null);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImageSrc(null);
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <>
      {/* Avatar Display with Upload Button */}
      <div className="relative inline-block">
        <Avatar
          src={currentImage}
          fallback={fallback}
          size={size}
          className={sizeClasses[size]}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          title="Upload photo"
        >
          <Camera size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Crop Modal */}
      <AnimatePresence>
        {isModalOpen && imageSrc && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          >
            <motion.div
              className="modal-content max-w-lg"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="modal-header">
                <h2 className="modal-title">Crop Photo</h2>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                  onClick={handleCancel}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cropper */}
              <div className="relative h-72 bg-black/90 rounded-[var(--radius-md)] overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              {/* Controls */}
              <div className="mt-4 space-y-4">
                {/* Zoom */}
                <div className="flex items-center gap-3">
                  <ZoomOut size={18} className="text-[var(--color-foreground-muted)]" />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)]"
                  />
                  <ZoomIn size={18} className="text-[var(--color-foreground-muted)]" />
                </div>

                {/* Rotation */}
                <div className="flex items-center gap-3">
                  <RotateCcw size={18} className="text-[var(--color-foreground-muted)]" />
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm text-[var(--color-foreground-muted)] w-12 text-right">
                    {rotation}°
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer mt-4">
                {currentImage && (
                  <Button
                    variant="ghost"
                    onClick={handleRemove}
                    className="text-[var(--color-error)] mr-auto"
                  >
                    Remove Photo
                  </Button>
                )}
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={isProcessing}>
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
