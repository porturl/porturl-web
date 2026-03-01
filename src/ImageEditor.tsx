import { useState, useCallback } from "react";
import { useInput, useRecordContext } from "react-admin";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Cropper from "react-easy-crop";

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

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
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
};

const ImageEditor = ({ source, label }: { source: string; label?: string }) => {
  const record = useRecordContext();
  const {
    field: { value, onChange },
  } = useInput({ source });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Determine what to show as the current preview
  // 1. Newly selected/cropped file (local blob URL)
  // 2. Existing iconUrl from record
  const currentPreview = value?.src || record?.iconUrl;

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setIsDialogOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCrop = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageBlob = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
        );
        const file = new File([croppedImageBlob], "icon.png", {
          type: "image/png",
        });

        // React Admin expects an object with rawFile and a local src for preview
        onChange({
          rawFile: file,
          src: URL.createObjectURL(croppedImageBlob),
          title: "icon.png",
        });
        setIsDialogOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 2,
      }}
    >
      {label && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={currentPreview}
          sx={{
            width: 120,
            height: 120,
            cursor: "pointer",
            border: "2px solid",
            borderColor: "primary.main",
            "&:hover": { opacity: 0.8 },
          }}
          onClick={() =>
            document.getElementById(`file-input-${source}`)?.click()
          }
        >
          {!currentPreview && <AddAPhotoIcon sx={{ fontSize: 40 }} />}
        </Avatar>
        <input
          type="file"
          id={`file-input-${source}`}
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Icon</DialogTitle>
        <DialogContent sx={{ height: 400, position: "relative", p: 0 }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
            />
          )}
        </DialogContent>
        <DialogActions
          sx={{ flexDirection: "column", alignItems: "stretch", px: 3, pb: 3 }}
        >
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="caption">Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value as number)}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveCrop}>
              Apply
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageEditor;
