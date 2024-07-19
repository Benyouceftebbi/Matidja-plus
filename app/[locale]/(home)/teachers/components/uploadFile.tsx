"use client";


import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useTranslations} from "next-intl"
interface FileUploadProgress {
  file: File;
  source: any;
  name:string
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}
type ImageUploadProps = {
  filesToUpload: FileUploadProgress[];
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileUploadProgress[]>>;
};
const ImageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

const PdfColor = {
  bgColor: "bg-blue-400",
  fillColor: "fill-blue-400",
};

const AudioColor = {
  bgColor: "bg-yellow-400",
  fillColor: "fill-yellow-400",
};

const VideoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

const ImageUpload: React.FC<ImageUploadProps> = ({filesToUpload, setFilesToUpload }) => {
    const t=useTranslations()

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <File size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
        color: AudioColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={VideoColor.fillColor} />,
        color: VideoColor.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
      color: OtherColor.bgColor,
    };
  };
  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.file !== file);
    });

  };

  const onDrop =async (acceptedFiles: File[]) => {
    setFilesToUpload((prevUploadProgress) => {
      return [
        ...prevUploadProgress,
        ...acceptedFiles.map((file) => {
          return {
            file: file,
            source: null,
            name:file.name
          };
        }),
      ];
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleDownload = (fileUploadProgress:FileUploadProgress) => {
    const url = URL.createObjectURL(fileUploadProgress.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileUploadProgress.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer "
        >
          <div className=" text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">{t('drag-files-0')}</span>
            </p>
            <p className="text-xs text-gray-500">
              {t('click-to-upload-files-and-40-files-should-be-under-10-mb-and-41-and-41')}</p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              {t('files-to-upload')} </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
         
                    key={fileUploadProgress.file.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white"  onClick={()=>handleDownload(fileUploadProgress)}>
                        {getFileIconAndColor(fileUploadProgress.file).icon}
                      </div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.file.name.slice(0, 25)}
                          </p>
                        </div>
                        <Progress 
                          className={
                            getFileIconAndColor(fileUploadProgress.file).color
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel("Upload cancelled");
                        removeFile(fileUploadProgress.file);
                      }}
                      className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
export default ImageUpload