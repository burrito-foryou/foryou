import { useEffect, useRef, useState } from "react";
import { FiImage } from "react-icons/fi";

const ProfileImageSection = ({
  member,
  imageLoading,
  fileInputRef,
  onImageClick,
  onImageChange,
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
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onImageChange}
      />

      <div className="relative" ref={menuRef}>
        <button
          className="group relative"
          onClick={() => setMenuOpen((v) => !v)}
          disabled={imageLoading}
        >
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt="프로필 이미지"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light text-3xl font-bold text-primary">
              {imageLoading ? "..." : member.nickname.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <FiImage size={22} className="text-white" />
          </div>
          <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
            <FiImage size={13} className="text-text-muted" />
          </div>
        </button>

        {menuOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
            <button
              onClick={() => {
                setMenuOpen(false);
                onImageClick();
              }}
              className="w-full px-4 py-3 text-left text-sm text-text hover:bg-gray-50 transition-colors"
            >
              사진 변경
            </button>
            {member.profileImageUrl && (
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full px-4 py-3 text-left text-sm text-error hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                기본 이미지로 변경
              </button>
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-base font-bold text-text">{member.nickname}</p>
        <p className="mt-1 text-sm text-text-muted">{member.email}</p>
      </div>
    </div>
  );
};

export default ProfileImageSection;
