import { ImagePlus, X } from "lucide-react";

// `images` items: { key, previewUrl, file? } — items with a `file` are
// pending uploads; items without one (edit mode) already exist on the
// server and carry `existingId` instead.
export default function ImageUploader({ images, onAdd, onRemove }) {
  function handleFileChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length) onAdd(files);
    event.target.value = "";
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition-colors hover:border-primary">
        <ImagePlus className="h-8 w-8 text-slate-400" aria-hidden="true" />
        <span className="mt-2 text-sm font-medium text-slate-600">Click to upload photos</span>
        <span className="text-xs text-slate-400">JPG or PNG — you can select multiple</span>
        <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFileChange} />
      </label>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.key} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
              <img src={img.previewUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(img)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
