"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
    value: (string | File)[];
    onChange: (value: (string | File)[]) => void;
    onRemove: (value: string | File) => void;
    maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onRemove, maxImages = 10 }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

    // Memory management for Blob URLs
    const updatePreviews = (items: (string | File)[]) => {
        const newMap = new Map(previewUrls);
        let changed = false;

        items.forEach((item) => {
            if (item instanceof File && !newMap.has(item)) {
                newMap.set(item, URL.createObjectURL(item));
                changed = true;
            }
        });

        // Cleanup URLs for removed files
        for (const [file, url] of previewUrls.entries()) {
            if (!items.includes(file)) {
                URL.revokeObjectURL(url);
                newMap.delete(file);
                changed = true;
            }
        }

        if (changed) setPreviewUrls(newMap);
    };

    // Cleanup all on unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const currentCount = value.length;
        const remainingSlots = maxImages - currentCount;

        if (remainingSlots <= 0) {
            alert(`You have already reached the limit of ${maxImages} images.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        let filesToAdd = Array.from(files);

        // Filter for only image files
        const nonImageFiles = filesToAdd.filter((f) => !f.type.startsWith("image/"));
        if (nonImageFiles.length > 0) {
            alert(`The following files are not images and will be skipped: ${nonImageFiles.map((f) => f.name).join(", ")}`);
            filesToAdd = filesToAdd.filter((f) => f.type.startsWith("image/"));
        }

        if (filesToAdd.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (filesToAdd.length > remainingSlots) {
            alert(`You can only add ${remainingSlots} more image(s). Only the first ${remainingSlots} selected images will be added.`);
            filesToAdd = filesToAdd.slice(0, remainingSlots);
        }

        const newValue = [...value, ...filesToAdd];
        updatePreviews(newValue);
        onChange(newValue);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemove = (item: string | File) => {
        const newValue = value.filter((i) => i !== item);
        updatePreviews(newValue);
        onRemove(item);
    };

    const getItemUrl = (item: string | File) => {
        if (typeof item === "string") return item;
        return previewUrls.get(item) || "";
    };

    return (
        <div className="space-y-4">
            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {value.map((item, index) => {
                        const url = getItemUrl(item);
                        if (!url) return null;

                        return (
                            <div key={typeof item === "string" ? item : `${item.name}-${index}`} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                                <Image fill src={url} alt="Property" className="object-cover transition-transform duration-300 group-hover:scale-110" />

                                {typeof item !== "string" && <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/90 text-[10px] text-white font-bold rounded-full z-10 shadow-sm">READY</div>}

                                <button type="button" onClick={() => handleRemove(item)} className="absolute top-1 right-1 p-1 bg-danger/80 hover:bg-danger text-white rounded-full shadow-lg transition-all transform hover:scale-80 z-10" title="Remove image">
                                    <span className="material-icons-outlined text-sm block">close</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full-Width Selection Button */}
            <button
                type="button"
                disabled={value.length >= maxImages}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative w-full py-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 shadow-sm overflow-hidden
          ${value.length >= maxImages ? "bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 cursor-not-allowed opacity-60" : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
            >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center">
                    <div
                        className={`p-4 rounded-full transition-colors mb-4 ring-8 ring-transparent 
            ${value.length >= maxImages ? "bg-slate-200 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:ring-primary/5"}`}
                    >
                        <span
                            className={`material-icons-outlined text-4xl transition-colors
              ${value.length >= maxImages ? "text-slate-400" : "text-text-muted group-hover:text-primary"}
            `}
                        >
                            {value.length >= maxImages ? "block" : "add_photo_alternate"}
                        </span>
                    </div>
                    <p
                        className={`text-sm font-bold transition-colors
            ${value.length >= maxImages ? "text-slate-400" : "text-text-main group-hover:text-primary"}
          `}
                    >
                        {value.length >= maxImages ? "Selection Limit Reached" : value.length > 0 ? "Add More Photos" : "Select Property Photos"}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1 font-medium italic">{value.length >= maxImages ? `Maximum ${maxImages} images allowed` : "PNG, JPG, WebP up to 10MB"}</p>
                </div>
            </button>

            {/* Hidden Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png, image/jpeg, image/jpg, image/webp" multiple={true} className="hidden" />

            {/* Helper Text */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 mt-2">
                <span className="material-icons-outlined text-primary text-sm mt-0.5">info</span>
                <div>
                    <p className="text-xs font-semibold text-text-main mb-0.5">How to select multiple images:</p>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                        While choosing files, hold <b>Ctrl</b> (Windows) or <b>Command</b> (Mac) to select multiple photos at once. Or simply click and drag to select a group of images.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
