
import React from 'react';
import { Upload, File, X, Loader2 } from 'lucide-react';

interface UploadButtonProps {
  label: string;
  onFileUpload: (file: File) => void;
  acceptedTypes?: string;
  fieldName?: string;
  uploadedFile?: { file: File; url: string; uploadedAt: Date } | null;
  isUploading?: boolean;
  onRemoveFile?: () => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  label,
  onFileUpload,
  acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  fieldName,
  uploadedFile,
  isUploading = false,
  onRemoveFile
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset input value to allow uploading the same file again
    event.target.value = '';
  };

  if (uploadedFile) {
    return (
      <div className="box-border w-[271px] h-16 border flex items-center justify-between gap-2 m-0 p-3 rounded-xl border-solid border-input-border max-sm:w-full bg-green-50 border-green-200">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <File className="w-[21px] h-[21px] text-green-600 flex-shrink-0" />
          <div className="box-border text-green-700 text-sm font-medium truncate">
            {uploadedFile.file.name}
          </div>
        </div>
        {onRemoveFile && (
          <button
            type="button"
            onClick={onRemoveFile}
            className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="box-border w-[271px] h-16 border flex items-center justify-center gap-8 m-0 p-0 rounded-xl border-solid border-input-border max-sm:w-full cursor-pointer hover:border-text-primary transition-colors relative">
      <input
        type="file"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept={acceptedTypes}
        disabled={isUploading}
      />
      {isUploading ? (
        <Loader2 className="w-[21px] h-[21px] text-text-primary opacity-50 animate-spin" />
      ) : (
        <Upload className="w-[21px] h-[21px] text-text-primary opacity-50" />
      )}
      <div className="box-border text-text-primary text-xl font-normal m-0 p-0">
        {isUploading ? 'Uploading...' : label}
      </div>
    </div>
  );
};
