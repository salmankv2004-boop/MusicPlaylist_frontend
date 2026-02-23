import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({ image, onCropDone, onCropCancel, aspect = 1 }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg");
        });
    };

    const handleDone = async () => {
        const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
        onCropDone(croppedBlob);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-2xl h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md">
                <div className="w-full">
                    <p className="text-gray-400 text-sm mb-2 text-center">Zoom: {zoom.toFixed(1)}x</p>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onCropCancel}
                        className="flex-1 py-3 px-6 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDone}
                        className="flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Crop & Save
                    </button>
                </div>
            </div>
        </div>
    );
}
