import React, { useEffect, useState } from 'react';
import { Check, Volume2, VolumeX, X } from 'lucide-react';
import {
  getLovelySystemVoices,
  getSelectedSystemVoiceURI,
  getSelectedVoicePreset,
  setSelectedSystemVoiceURI,
  setSelectedVoicePreset,
  speakText,
  stopSpeaking,
  subscribeVoicesLoaded,
  VOICE_PRESETS,
  VoicePresetId,
} from '../utils/speech';
import { MonsterSvg } from './PlayfulMonsters';

interface VoicePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoicePickerModal: React.FC<VoicePickerModalProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<VoicePresetId>(() =>
    getSelectedVoicePreset()
  );
  const [systemVoiceURI, setSystemVoiceURI] = useState<string>(() =>
    getSelectedSystemVoiceURI()
  );
  const [deviceVoices, setDeviceVoices] = useState<SpeechSynthesisVoice[]>(() =>
    getLovelySystemVoices()
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(getSelectedVoicePreset());
      setSystemVoiceURI(getSelectedSystemVoiceURI());
    }
    setDeviceVoices(getLovelySystemVoices());
    return subscribeVoicesLoaded(() => {
      setDeviceVoices(getLovelySystemVoices());
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (id: VoicePresetId) => {
    setSelectedPreset(id);
    setSelectedVoicePreset(id);
    const chosen = VOICE_PRESETS.find((v) => v.id === id);
    if (chosen) {
      speakText(chosen.sampleLine, undefined, id);
    }
  };

  const handleSelectDeviceVoice = (uri: string) => {
    setSystemVoiceURI(uri);
    setSelectedSystemVoiceURI(uri);
    const chosen = VOICE_PRESETS.find((v) => v.id === selectedPreset);
    speakText(
      chosen?.sampleLine || 'Hello explorer! Ready for a wonderful story today?',
      undefined,
      selectedPreset
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-picker-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-light-card="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl border-2 border-sky-200 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#F8FAFC] text-slate-900 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto overflow-x-hidden"
      >
        {/* Dreamy Fluffy Cloud Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        >
          <svg
            viewBox="0 0 600 420"
            className="w-full h-full object-cover opacity-90"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Upper Left Fluffy Cloud */}
            <g fill="#FFFFFF" opacity="0.85">
              <circle cx="85" cy="70" r="38" />
              <circle cx="122" cy="58" r="46" />
              <circle cx="165" cy="72" r="34" />
              <rect x="75" y="72" width="102" height="36" rx="18" />
            </g>
            {/* Upper Right Soft Cloud */}
            <g fill="#FFFFFF" opacity="0.78">
              <circle cx="435" cy="84" r="34" />
              <circle cx="475" cy="68" r="44" />
              <circle cx="518" cy="82" r="32" />
              <rect x="425" y="80" width="108" height="34" rx="17" />
            </g>
            {/* Middle Rolling Cloud */}
            <g fill="#FFFFFF" opacity="0.68">
              <circle cx="245" cy="215" r="42" />
              <circle cx="295" cy="198" r="54" />
              <circle cx="348" cy="215" r="40" />
              <rect x="230" y="212" width="135" height="44" rx="22" />
            </g>
            {/* Bottom Horizon Cloud Bank */}
            <g fill="#FFFFFF" opacity="0.92">
              <circle cx="60" cy="378" r="58" />
              <circle cx="145" cy="364" r="68" />
              <circle cx="245" cy="376" r="62" />
              <circle cx="350" cy="362" r="72" />
              <circle cx="455" cy="374" r="64" />
              <circle cx="545" cy="368" r="56" />
              <rect x="0" y="370" width="600" height="60" />
            </g>
          </svg>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between gap-3 border-b border-sky-200/80 pb-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              UK Storyteller Monsters
            </p>
            <h2
              id="voice-picker-title"
              className="font-heading font-extrabold text-xl text-slate-900 mt-0.5"
            >
              Choose a Lovely Voice
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            aria-label="Close voice picker"
            className="w-9 h-9 rounded-xl bg-white/85 hover:bg-white border border-sky-200 text-slate-700 flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Monster Face Voice Cards (No text descriptions) */}
        <div className="relative z-10 grid grid-cols-2 gap-3.5">
          {VOICE_PRESETS.map((voice) => {
            const active = selectedPreset === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => handleSelectPreset(voice.id)}
                className={`relative rounded-3xl border-2 p-4 sm:p-5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 backdrop-blur-xs ${
                  active
                    ? 'bg-white border-sky-500 ring-4 ring-sky-300/60 shadow-lg -translate-y-0.5'
                    : 'bg-white/85 border-white hover:bg-white hover:border-sky-300 shadow-sm'
                }`}
              >
                {active && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <MonsterSvg
                  id={voice.monsterId}
                  jumping={active}
                  className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm"
                />
                <p className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                  {voice.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Optional Live Device / OS Voice Selector */}
        {deviceVoices.length > 0 && (
          <div className="relative z-10 pt-3 border-t border-sky-200/80 space-y-2">
            <label
              htmlFor="device-voice-select"
              className="block text-xs font-extrabold text-slate-800"
            >
              Device Natural Voice ({deviceVoices.length} available on this device)
            </label>
            <select
              id="device-voice-select"
              value={systemVoiceURI}
              onChange={(e) => handleSelectDeviceVoice(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-sky-200 bg-white text-xs font-semibold text-slate-900"
            >
              <option value="auto">Auto-pick best natural UK voice (Recommended)</option>
              {deviceVoices.map((dv) => (
                <option key={dv.voiceURI} value={dv.voiceURI}>
                  {dv.name} ({dv.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative z-10 pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={stopSpeaking}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-sky-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <VolumeX className="w-3.5 h-3.5" />
            Stop Voice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-[#001E62] hover:bg-[#0B2D7A] text-white text-xs font-extrabold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
