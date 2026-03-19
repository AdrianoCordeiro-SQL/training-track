"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { useProfile, UserMetadata, StatusMessage } from "@/hooks/useProfile";
import { AccountDataCard } from "./components-profile/AccountDataCard";
import { ContactDataCard } from "./components-profile/ContactDataCard";

export default function ProfilePage() {
  const {
    loading,
    email,
    metadata,
    initials,
    uploadingAvatar,
    statusMessage,
    uploadAvatar,
    updateContact,
    updatePassword,
  } = useProfile();

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  if (loading) {
    return <ProfileSkeleton />;
  }

  const isEditingAnything = isEditingContact || isEditingPassword;

  return (
    <main className="w-full p-4 md:p-8 relative">
      <StatusAlert message={statusMessage} />

      <AvatarHeader
        metadata={metadata}
        initials={initials}
        uploadingAvatar={uploadingAvatar}
        onUpload={uploadAvatar}
        disabled={isEditingAnything}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        <AccountDataCard
          email={email}
          isEditing={isEditingPassword}
          setIsEditing={setIsEditingPassword}
          onSave={updatePassword}
        />
        <ContactDataCard
          metadata={metadata}
          isEditing={isEditingContact}
          setIsEditing={setIsEditingContact}
          onSave={updateContact}
        />
      </section>
    </main>
  );
}

// --- SUBCOMPONENTES ---

function StatusAlert({ message }: { message: StatusMessage }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-medium shadow-xl transition-all animate-in slide-in-from-top-4 ${
        message.type === "success"
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
          : "bg-red-500/20 text-red-400 border border-red-500/50"
      }`}
    >
      {message.text}
    </div>
  );
}

function AvatarHeader({
  metadata,
  initials,
  uploadingAvatar,
  onUpload,
  disabled,
}: {
  metadata: UserMetadata;
  initials: string;
  uploadingAvatar: boolean;
  onUpload: (f: File) => void;
  disabled: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!disabled && !uploadingAvatar) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      onUpload(e.target.files[0]);
    if (e.target) e.target.value = "";
  };

  return (
    <header className="mb-10 mt-4 flex items-center gap-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <div
        onClick={handleAvatarClick}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shrink-0 border-4 border-zinc-800 transition-all ${
          uploadingAvatar
            ? "animate-pulse bg-zinc-700"
            : disabled
              ? "cursor-not-allowed bg-zinc-800"
              : "cursor-pointer hover:border-emerald-500 bg-emerald-600 group"
        }`}
      >
        {uploadingAvatar ? (
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        ) : metadata.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={metadata.avatar_url}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-4xl font-extrabold text-zinc-950">
            {initials}
          </span>
        )}
        {!uploadingAvatar && !disabled && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
            <Camera className="w-6 h-6 text-white" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              Mudar
            </span>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tighter">
          {metadata.first_name
            ? `${metadata.first_name} ${metadata.last_name}`
            : "Meu Perfil"}
        </h1>
        <p className="text-zinc-400 mt-1.5 text-lg">
          Suas informações e credenciais.
        </p>
      </div>
    </header>
  );
}

function ProfileSkeleton() {
  return (
    <main className="w-full p-4 md:p-8 relative animate-pulse">
      {/* Skeleton do Header (Avatar e Nome) */}
      <header className="mb-10 mt-4 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-800/50 shrink-0"></div>
        <div className="space-y-3 flex-1">
          <div className="h-8 bg-zinc-800 rounded-lg w-48 md:w-64"></div>
          <div className="h-5 bg-zinc-800/50 rounded-lg w-32 md:w-48"></div>
        </div>
      </header>

      {/* Skeleton dos Cartões */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-6"
          >
            {/* Skeleton do Título do Cartão */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-zinc-800"></div>
              <div className="h-6 bg-zinc-800 rounded-lg w-32"></div>
            </div>

            {/* Skeleton dos Campos */}
            <div className="space-y-2">
              <div className="h-4 bg-zinc-800/50 rounded w-24"></div>
              <div className="h-12 bg-zinc-800 rounded-xl w-full"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-zinc-800/50 rounded w-20"></div>
              <div className="h-12 bg-zinc-800 rounded-xl w-full"></div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
