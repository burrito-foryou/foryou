import { useEffect, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";

const ProfileImageSection = ({
  member,
  imageLoading,
  fileInputRef,
  onImageClick,
  onImageChange,
  onImageReset,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onImageChange}
      />

      <button
        className="group relative block"
        onClick={() => setMenuOpen((v) => !v)}
        disabled={imageLoading}
      >
        {member.profileImageUrl ? (
          <img
            src={member.profileImageUrl}
            alt="프로필 이미지"
            className="h-24 w-24 rounded-full object-cover transition-opacity group-hover:opacity-80"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light text-3xl font-black text-primary transition-opacity group-hover:opacity-80">
            {imageLoading ? "..." : member.nickname.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <FiCamera size={20} className="text-white" />
        </div>
        <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-soft transition-transform group-hover:scale-110">
          <FiCamera size={15} />
        </span>
      </button>

      {menuOpen && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
          <button
            onClick={() => {
              setMenuOpen(false);
              onImageClick();
            }}
            className="w-full px-4 py-3 text-left text-sm font-bold text-text transition-colors hover:bg-surface"
          >
            사진 변경
          </button>
          {member.profileImageUrl && (
            <button
              onClick={() => {
                setMenuOpen(false);
                onImageReset();
              }}
              className="w-full border-t border-border px-4 py-3 text-left text-sm font-bold text-error transition-colors hover:bg-surface"
            >
              기본 이미지로 변경
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileImageSection;
